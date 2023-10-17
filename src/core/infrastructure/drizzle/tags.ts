import type { NewTag } from "~/core/domain/tags/entity";
import { db } from "~/modules/drizzle";
import { tags } from "~/schema/tags";

export class TagsDS {
  static async create(data: NewTag) {
    return db.insert(tags).values(data).prepare().execute();
  }
}
