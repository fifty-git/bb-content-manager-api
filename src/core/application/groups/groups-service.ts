import { CreateUseCase } from "~/core/application/groups/use-cases/create";
import { UpdateUseCase } from "~/core/application/groups/use-cases/update";

export class GroupsService {
  static CreateUseCase = new CreateUseCase();
  static UpdateUseCase = new UpdateUseCase();

  constructor() {
    // Bind the run method to the instance of CreateUseCase
    GroupsService.CreateUseCase.run = GroupsService.CreateUseCase.run.bind(GroupsService.CreateUseCase);
    GroupsService.UpdateUseCase.run = GroupsService.UpdateUseCase.run.bind(GroupsService.UpdateUseCase);
  }
}
