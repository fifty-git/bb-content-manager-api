import { mysqlTable, mysqlSchema, AnyMySqlColumn, foreignKey, primaryKey, int, datetime, index, varchar, decimal, tinyint, text, mysqlEnum, json, unique, timestamp } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const bundle_options = mysqlTable("bundle_options", {
	bundle_option_id: int("bundle_option_id").autoincrement().notNull(),
	bundle_id: int("bundle_id").references(() => bundles.bundle_id),
	option_catalog_id: int("option_catalog_id").references(() => options_catalog.option_catalog_id),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		bundle_options_bundle_option_id: primaryKey(table.bundle_option_id),
	}
});

export const bundle_products = mysqlTable("bundle_products", {
	bundle_product_id: int("bundle_product_id").autoincrement().notNull(),
	bundle_id: int("bundle_id").notNull().references(() => bundles.bundle_id),
	product_id: int("product_id").notNull().references(() => products.product_id),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		bundle_id: index("bundle_id").on(table.bundle_id),
		product_id: index("product_id").on(table.product_id),
		bundle_products_bundle_product_id: primaryKey(table.bundle_product_id),
	}
});

export const bundle_variants = mysqlTable("bundle_variants", {
	bundle_variant_id: int("bundle_variant_id").autoincrement().notNull(),
	bundle_id: int("bundle_id").notNull().references(() => bundles.bundle_id),
	name: varchar("name", { length: 255 }).notNull(),
	price: decimal("price", { precision: 6, scale: 2 }).notNull(),
	active: tinyint("active").default(0).notNull(),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		bundle_id: index("bundle_id").on(table.bundle_id),
		bundle_variants_bundle_variant_id: primaryKey(table.bundle_variant_id),
	}
});

export const bundles = mysqlTable("bundles", {
	bundle_id: int("bundle_id").autoincrement().notNull(),
	name: varchar("name", { length: 100 }).notNull(),
	description: text("description").notNull(),
	active: tinyint("active").default(1).notNull(),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		bundles_bundle_id: primaryKey(table.bundle_id),
	}
});

export const carrier_services = mysqlTable("carrier_services", {
	carrier_service_id: int("carrier_service_id").autoincrement().notNull(),
	code: varchar("code", { length: 50 }).notNull(),
	name: varchar("name", { length: 50 }).notNull(),
	type: mysqlEnum("type", ['domestic','international']).default('domestic').notNull(),
	carrier_id: int("carrier_id").notNull().references(() => carriers.carrier_id),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		carrier_id: index("carrier_id").on(table.carrier_id),
		carrier_services_carrier_service_id: primaryKey(table.carrier_service_id),
	}
});

export const carriers = mysqlTable("carriers", {
	carrier_id: int("carrier_id").autoincrement().notNull(),
	code: varchar("code", { length: 50 }).notNull(),
	name: varchar("name", { length: 50 }).notNull(),
	accountNumber: varchar("accountNumber", { length: 255 }).notNull(),
	active: tinyint("active").default(1).notNull(),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		carriers_carrier_id: primaryKey(table.carrier_id),
	}
});

export const farm_product_varieties = mysqlTable("farm_product_varieties", {
	farm_product_variety_id: int("farm_product_variety_id").autoincrement().notNull(),
	farm_id: int("farm_id").notNull().references(() => farms.farm_id),
	variety_id: int("variety_id").notNull().references(() => product_varieties.product_variety_id),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		farm_id: index("farm_id").on(table.farm_id),
		variety_id: index("variety_id").on(table.variety_id),
		farm_product_varieties_farm_product_variety_id: primaryKey(table.farm_product_variety_id),
	}
});

export const farms = mysqlTable("farms", {
	farm_id: int("farm_id").autoincrement().notNull(),
	name: varchar("name", { length: 50 }).notNull(),
	country: varchar("country", { length: 50 }).notNull(),
	city: varchar("city", { length: 255 }).notNull(),
	email: varchar("email", { length: 50 }).notNull(),
	active: tinyint("active").default(1).notNull(),
	carrier_id: int("carrier_id").notNull().references(() => carriers.carrier_id),
	service_id: int("service_id").notNull().references(() => carrier_services.carrier_service_id),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		carrier_id: index("carrier_id").on(table.carrier_id),
		service_id: index("service_id").on(table.service_id),
		farms_farm_id: primaryKey(table.farm_id),
	}
});

export const menu = mysqlTable("menu", {
	menu_id: int("menu_id").autoincrement().notNull(),
	name: varchar("name", { length: 50 }).notNull(),
	href: varchar("href", { length: 50 }).notNull(),
	default_href: varchar("default_href", { length: 50 }).notNull(),
	icon: varchar("icon", { length: 50 }).notNull(),
	role: varchar("role", { length: 50 }).default('default').notNull(),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		menu_menu_id: primaryKey(table.menu_id),
	}
});

export const options_catalog = mysqlTable("options_catalog", {
	option_catalog_id: int("option_catalog_id").autoincrement().notNull(),
	dropdown_name: varchar("dropdown_name", { length: 100 }),
	product_exists: tinyint("product_exists").default(1),
	creates_po: tinyint("creates_po").default(1),
	manual_options: json("manual_options"),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		options_catalog_option_catalog_id: primaryKey(table.option_catalog_id),
	}
});

export const product_options = mysqlTable("product_options", {
	product_option_id: int("product_option_id").autoincrement().notNull(),
	option_catalog_id: int("option_catalog_id").references(() => options_catalog.option_catalog_id),
	product_id: int("product_id").references(() => products.product_id),
	option_name: varchar("option_name", { length: 100 }),
	additional_price: decimal("additional_price", { precision: 10, scale: 0 }).notNull(),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		product_options_product_option_id: primaryKey(table.product_option_id),
	}
});

export const product_tags = mysqlTable("product_tags", {
	tag_id: int("tag_id").notNull().references(() => tags.tag_id),
	product_id: int("product_id").notNull().references(() => products.product_id),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		tag_id: index("tag_id").on(table.tag_id),
		product_id: index("product_id").on(table.product_id),
	}
});

export const product_variants = mysqlTable("product_variants", {
	variant_id: int("variant_id").autoincrement().notNull(),
	product_id: int("product_id").notNull().references(() => products.product_id),
	name: varchar("name", { length: 100 }).notNull(),
	description: text("description").notNull(),
	price: decimal("price", { precision: 10, scale: 2 }).notNull(),
	units: int("units").notNull(),
	measure_units: varchar("measure_units", { length: 20 }).notNull(),
	season_start: mysqlEnum("season_start", ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']).default('Jan').notNull(),
	season_end: mysqlEnum("season_end", ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']).default('Dec').notNull(),
	active: tinyint("active").default(1).notNull(),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		product_variants_variant_id: primaryKey(table.variant_id),
	}
});

export const product_varieties = mysqlTable("product_varieties", {
	product_variety_id: int("product_variety_id").autoincrement().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	sku: varchar("sku", { length: 255 }).notNull(),
	cost: decimal("cost", { precision: 6, scale: 2 }).default('0.00').notNull(),
	active: tinyint("active").default(1).notNull(),
	quality: mysqlEnum("quality", ['A','B','C']).default('A').notNull(),
	product_id: int("product_id").default(1).notNull().references(() => products.product_id),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		product_varieties_product_variety_id: primaryKey(table.product_variety_id),
	}
});

export const products = mysqlTable("products", {
	product_id: int("product_id").autoincrement().notNull(),
	name: varchar("name", { length: 100 }).notNull(),
	description: text("description").notNull(),
	upc: varchar("upc", { length: 50 }).notNull(),
	active: tinyint("active").default(1).notNull(),
	is_standalone: tinyint("is_standalone").default(1).notNull(),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		products_product_id: primaryKey(table.product_id),
		products_pk: unique("products_pk").on(table.upc),
	}
});

export const submenu = mysqlTable("submenu", {
	submenu_id: int("submenu_id").autoincrement().notNull(),
	menu_id: int("menu_id").notNull().references(() => menu.menu_id),
	name: varchar("name", { length: 50 }).notNull(),
	href: varchar("href", { length: 50 }).notNull(),
	role: varchar("role", { length: 50 }).default('default').notNull(),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		submenu_submenu_id: primaryKey(table.submenu_id),
	}
});

export const tags = mysqlTable("tags", {
	tag_id: int("tag_id").autoincrement().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	type: mysqlEnum("type", ['PRODUCT','ORDER','PURCHASE ORDER','SEARCHABLE']).default('PRODUCT').notNull(),
	created_at: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		tags_tag_id: primaryKey(table.tag_id),
		name: unique("name").on(table.name),
	}
});

export const users = mysqlTable("users", {
	user_id: int("user_id").autoincrement().notNull(),
	first_name: varchar("first_name", { length: 50 }).notNull(),
	last_name: varchar("last_name", { length: 50 }).notNull(),
	email: varchar("email", { length: 200 }).notNull(),
	login: varchar("login", { length: 50 }).notNull(),
	password: varchar("password", { length: 500 }).notNull(),
	secure_password: varchar("secure_password", { length: 128 }),
	status: mysqlEnum("status", ['active','inactive']).default('active').notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		users_user_id: primaryKey(table.user_id),
		users_pk: unique("users_pk").on(table.login),
	}
});

export const workspaces = mysqlTable("workspaces", {
	workspace_id: int("workspace_id").autoincrement().notNull(),
	user_id: int("user_id").notNull().references(() => users.user_id),
	bookmarks: json("bookmarks").notNull(),
},
(table) => {
	return {
		workspaces_workspace_id: primaryKey(table.workspace_id),
	}
});