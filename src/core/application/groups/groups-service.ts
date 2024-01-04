import { CreateUseCase } from "~/core/application/groups/use-cases/create";
import { UpdateUseCase } from "~/core/application/groups/use-cases/update";

export class GroupsService {
  static CreateUseCase = new CreateUseCase();
  static UpdateUseCase = new UpdateUseCase();
}
