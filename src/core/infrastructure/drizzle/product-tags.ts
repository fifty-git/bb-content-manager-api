import type { NewProductTag } from "~/core/domain/product-tags/entity";
import type { Transaction } from "~/core/domain/types";
import { and, eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { product_tag_link } from "~/schema/product-tag-link";
import { tags } from "~/schema/tags";

export class ProductTagsDS {
  static async getAll(product_id: number) {
    return db
      .select({
        tag_id: tags.tag_id,
        name: tags.name,
        type: tags.type,
        created_at: product_tag_link.created_at,
        updated_at: product_tag_link.updated_at,
      })
      .from(product_tag_link)
      .leftJoin(tags, eq(product_tag_link.tag_id, tags.tag_id))
      .where(eq(product_tag_link.product_id, product_id))
      .prepare()
      .execute();
  }

  static async create(data: NewProductTag, tx?: Transaction) {
    return (tx ?? db).insert(product_tag_link).values(data).prepare().execute();
  }

  static async delete(product_id: number, tag_id: number) {
    return db
      .delete(product_tag_link)
      .where(and(eq(product_tag_link.product_id, product_id), eq(product_tag_link.tag_id, tag_id)))
      .prepare()
      .execute();
  }
}
