import type { NewTag } from "~/core/domain/tags/entity";
import type { Transaction } from "~/core/domain/types";
import { eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { tags } from "~/schema/tags";

export class TagsDS {
  static async findByName(name: string) {
    return db.select().from(tags).where(eq(tags.name, name)).prepare().execute();
  }

  static async create(data: NewTag, tx?: Transaction) {
    return (tx ?? db).insert(tags).values(data).prepare().execute();
  }
}
