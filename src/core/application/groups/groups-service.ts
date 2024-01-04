import { CreateUseCase } from "~/core/application/groups/use-cases/create";
import { UpdateUseCase } from "~/core/application/groups/use-cases/update";

export class GroupsService {
  CreateUseCase = new CreateUseCase();
  UpdateUseCase = new UpdateUseCase();

  constructor() {
    // Bind the run method to the instance of CreateUseCase
    this.CreateUseCase.run = this.CreateUseCase.run.bind(this.CreateUseCase);
    this.UpdateUseCase.run = this.UpdateUseCase.run.bind(this.UpdateUseCase);
  }
}
