import type { NewTag } from "~/core/domain/tags/entity";
import type { Transaction } from "~/core/domain/types";
import { like } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { tags } from "~/schema/tags";

export class TagsDS {
  static async findByName(name: string, limit = 10) {
    return db
      .select()
      .from(tags)
      .where(like(tags.name, `%${name}%`))
      .limit(limit)
      .prepare()
      .execute();
  }

  static async create(data: NewTag, tx?: Transaction) {
    return (tx ?? db).insert(tags).values(data).prepare().execute();
  }
}
