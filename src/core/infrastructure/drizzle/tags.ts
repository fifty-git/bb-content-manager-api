import type { NewTag } from "~/core/domain/tags/entity";
import type { Transaction } from "~/core/domain/types";
import { db } from "~/modules/drizzle";
import { tags } from "~/schema/tags";

export class TagsDS {
  static async create(data: NewTag, tx?: Transaction) {
    return (tx ?? db).insert(tags).values(data).prepare().execute();
  }
}
