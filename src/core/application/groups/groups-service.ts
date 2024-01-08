import { CreateUseCase } from "~/core/application/groups/use-cases/create";
import { GetAllDataAccess, GetByIDDataAccess } from "~/core/application/groups/use-cases/read";
import { UpdateUseCase } from "~/core/application/groups/use-cases/update";
import { ActivateUseCase, DeactivateUseCase, DeleteUseCase } from "./use-cases/delete";

export class GroupsService {
  GetAllDataAccess = new GetAllDataAccess();
  GetByIDDataAccess = new GetByIDDataAccess();
  CreateUseCase = new CreateUseCase();
  UpdateUseCase = new UpdateUseCase();
  ActivateUseCase = new ActivateUseCase();
  DeactivateUseCase = new DeactivateUseCase();
  DeleteUseCase = new DeleteUseCase();

  constructor() {
    // Bind the run method to the instance of CreateUseCase
    this.GetAllDataAccess.run = this.GetAllDataAccess.run.bind(this.GetAllDataAccess);
    this.GetByIDDataAccess.run = this.GetByIDDataAccess.run.bind(this.GetByIDDataAccess);
    this.CreateUseCase.run = this.CreateUseCase.run.bind(this.CreateUseCase);
    this.UpdateUseCase.run = this.UpdateUseCase.run.bind(this.UpdateUseCase);
    this.ActivateUseCase.run = this.ActivateUseCase.run.bind(this.ActivateUseCase);
    this.DeactivateUseCase.run = this.DeactivateUseCase.run.bind(this.DeactivateUseCase);
    this.DeleteUseCase.run = this.DeleteUseCase.run.bind(this.DeleteUseCase);
  }
}
