import type { ClonedVariantOption, ClonedVariantOV } from "~/core/domain/product-options/entity";
import type { ClonedVariant } from "~/core/domain/product-variants/entity";
import type { ClonedProduct } from "~/core/domain/products/entity";
import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { CreateOfferAPISchema } from "~/core/domain/product-offers/validator/create-offer-validator";
import { CreateProductOptionsAllAPISchema } from "~/core/domain/product-options/validator/create-option-validator";
import { CloneProductAPISchema } from "~/core/domain/products/validator/clone-product-validator";
import { CreateProductsAPISchema } from "~/core/domain/products/validator/create-product-validator";
import { GroupsDS, SubGroupDS } from "~/core/infrastructure/drizzle/groups";
import { OffersDS } from "~/core/infrastructure/drizzle/product-offers";
import { ProductOptionsDS } from "~/core/infrastructure/drizzle/product-options";
import { ProductVariantsDS } from "~/core/infrastructure/drizzle/product-variants";
import { ProductVarietiesDS } from "~/core/infrastructure/drizzle/product-varieties";
import { ProductsDS } from "~/core/infrastructure/drizzle/products";
import { db } from "~/modules/drizzle";

async function getProductsWithAttributes(name: string | undefined) {
  const products = name ? await ProductsDS.findByName(name) : await ProductsDS.getAll();
  return Promise.all(
    products.map(async (product) => {
      const groups = await GroupsDS.getGroupByProductID(product.product_id);
      const offers = await OffersDS.getAllByProductID(product.product_id);
      return { ...product, id: product.product_id, groups, offers };
    }),
  );
}

export async function getProducts(c: Context<EnvAPI>) {
  const name = c.req.query("name");
  const products = await getProductsWithAttributes(name);
  return c.json({ status: "success", data: products });
}

export async function getProduct(c: Context<EnvAPI>) {
  const id = c.req.param("product_id");
  const product = await ProductsDS.getByID(+id);
  if (!product) return c.json({ status: "success", data: product });

  const groups = await GroupsDS.getGroupByProductID(+id);
  return c.json({ status: "success", data: { ...product, groups } });
}

export async function createProduct(c: Context<EnvAPI>) {
  // Validator
  const validator = CreateProductsAPISchema.safeParse(await c.req.json());
  if (!validator.success)
    return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);

  // Product creation
  c.var.log.info(`Products to be created: ${validator.data.products.length}`);
  for (const product of validator.data.products) {
    await db.transaction(async (tx) => {
      const [{ insertId }] = await ProductsDS.create(product, tx);
      if (product.subgroup_id && product.subgroup_id !== 0) await ProductsDS.addSubgroup(insertId, product.subgroup_id, tx);
    });
  }

  return c.json({ status: "success", msg: "Product creation was completed successfully!" }, 201);
}

export async function createOffer(c: Context<EnvAPI>) {
  const product_id = parseInt(c.req.param("product_id"), 10);
  // Validator
  const validator = CreateOfferAPISchema.safeParse(await c.req.json());
  if (!validator.success)
    return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);

  // Offer creation
  await OffersDS.create({ ...validator.data, product_id });
  return c.json({ status: "success", msg: "Product offer creation was completed successfully!" }, 201);
}

export async function cloneProduct(c: Context<EnvAPI>) {
  const product_id = parseInt(c.req.param("product_id"), 10);
  c.var.log.info(`Cloning product from product ID ${product_id}`);
  const data = await c.req.json();
  const validator = CloneProductAPISchema.safeParse({ ...data, product_id });
  if (!validator.success)
    return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);

  // Transaction for product cloning
  await db.transaction(async (tx) => {
    // Basic Product cloning
    const cloned_product: ClonedProduct = { ...validator.data };
    delete cloned_product.product_id;

    const [{ insertId }] = await ProductsDS.create(cloned_product, tx);
    if (validator.data.subgroup_id && validator.data.subgroup_id !== 0)
      await ProductsDS.addSubgroup(insertId, validator.data.subgroup_id, tx);

    // Product variants cloning
    const variants = await ProductVariantsDS.getByProductID(validator.data.product_id, tx);
    for (const variant of variants) {
      const cloned: ClonedVariant = { ...variant };
      delete cloned.variant_id;
      cloned.product_id = insertId;
      const [{ insertId: variantInsertId }] = await ProductVariantsDS.create(cloned, tx);

      // Product options cloning
      const options = await ProductOptionsDS.getByVariantID(variant.variant_id, tx);
      for (const option of options) {
        const cloned_option: ClonedVariantOption = { ...option };
        delete cloned_option.variant_option_id;
        cloned_option.variant_id = variantInsertId;
        const [{ insertId: optionInsertId }] = await ProductOptionsDS.create(cloned_option, tx);

        // Product option values cloning
        const option_values = await ProductOptionsDS.getOptionValues(option.variant_option_id, tx);
        for (const ov of option_values) {
          const cloned_ov: ClonedVariantOV = { ...ov };
          delete cloned_ov.variant_option_value_id;
          cloned_ov.variant_option_id = optionInsertId;
          await ProductOptionsDS.createOptionValue(cloned_ov, tx);
        }
      }
    }
    // TODO Product media cloning
  });

  return c.json({ status: "success", msg: `Product ${product_id} was cloned successfully!` }, 201);
}

export async function createProductOptions(c: Context<EnvAPI>) {
  const product_id = parseInt(c.req.param("product_id"), 10);
  c.var.log.info(`Creating options for product ID ${product_id} - All Variants`);
  const data = await c.req.json();
  const validator = CreateProductOptionsAllAPISchema.safeParse({ ...data, product_id });
  if (!validator.success)
    return c.json({ status: "error", msg: `${validator.error.errors[0].message} (${validator.error.errors[0].path.join(".")})` }, 400);

  // Option creation for all variants
  const variants = await ProductVariantsDS.getByProductID(product_id);
  for (const variant of variants) {
    const last_display_order = await ProductOptionsDS.getLastDisplayOrder(variant.variant_id);
    const option = {
      ...validator.data,
      variant_id: variant.variant_id,
      display_order: last_display_order + 1,
    };
    const [{ insertId }] = await ProductOptionsDS.create(option);

    // Option values creation
    const option_values = validator.data.options.map((option_value, index) => {
      return { ...option_value, variant_option_id: insertId, display_order: index };
    });
    await ProductOptionsDS.createOptionValues(option_values);
  }

  return c.json({ status: "success", msg: `Options for all product ID ${product_id} variants were created successfully!` }, 201);
}

export async function enableProduct(c: Context<EnvAPI>) {
  const id = c.req.param("product_id");
  c.var.log.info(`Product to be enabled: ${id}`);

  await ProductsDS.enable(+id);
  return c.json({ status: "success", msg: `Product ${id} was enabled successfully` });
}

export async function disableProduct(c: Context<EnvAPI>) {
  const id = c.req.param("product_id");
  c.var.log.info(`Product to be disabled: ${id}`);

  await ProductsDS.disable(+id);
  return c.json({ status: "success", msg: `Product ${id} was disabled successfully` });
}

export async function deleteProduct(c: Context<EnvAPI>) {
  const id = c.req.param("product_id");
  c.var.log.info(`Product to be deleted: ${id}`);

  await db.transaction(async (tx) => {
    // Delete dependencies
    await ProductsDS.deleteGroup(+id, tx);
    await ProductsDS.deleteOptionValues(+id, tx);
    const variants = await ProductVariantsDS.getByProductID(+id, tx);
    const variant_ids = variants.map((v) => v.variant_id);
    await ProductOptionsDS.deleteManyByVariantID(variant_ids, tx);
    await ProductVariantsDS.deleteManyByProductID(+id, tx);
    await ProductVarietiesDS.deleteManyByProductID(+id, tx);
    await ProductsDS.deleteTags(+id, tx);

    // Delete product
    await ProductsDS.delete(+id, tx);
  });

  return c.json(null, 204);
}

export async function changeGroups(c: Context<EnvAPI>) {
  const { productGroups } = await c.req.json();
  const productIds: number[] = productGroups.map((elm: any) => elm.product_id);
  await db.transaction(async (tx) => {
    await ProductsDS.deleteGroups(productIds, tx);
    await ProductsDS.addSubgroups(productGroups, tx);
  });
  return c.json("Groups changed successfully", 200);
}

export async function changeGroup(c: Context<EnvAPI>) {
  const product_id = c.req.param("product_id");
  const subgroup_id = c.req.param("subgroup_id");
  const subgroup = await SubGroupDS.getSubgroupById(parseInt(subgroup_id, 10));
  const product = await ProductsDS.getByID(+product_id);
  if (!subgroup) return c.json({ msg: "Subgroup not found" }, 404);
  if (!product) return c.json({ msg: "Product not found" }, 404);
  await db.transaction(async (tx) => {
    await ProductsDS.deleteGroup(+product_id, tx);
    await ProductsDS.addSubgroup(+product_id, +subgroup_id, tx);
  });
  return c.json({ status: "success", msg: `Product ${product_id} has been assigned to subgroup ${subgroup_id} successfully` });
}
