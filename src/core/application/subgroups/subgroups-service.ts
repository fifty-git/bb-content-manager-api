import { CreateUseCase } from "~/core/application/subgroups/use-cases/create";
import { ActivateUseCase, DeactivateUseCase, DeleteUseCase } from "~/core/application/subgroups/use-cases/delete";
import { GetAllDataAccess } from "~/core/application/subgroups/use-cases/read";
import { UpdateUseCase } from "~/core/application/subgroups/use-cases/update";

export class SubgroupsService {
  GetAllDataAccess = new GetAllDataAccess();
  CreateUseCase = new CreateUseCase();
  UpdateUseCase = new UpdateUseCase();
  ActivateUseCase = new ActivateUseCase();
  DeactivateUseCase = new DeactivateUseCase();
  DeleteUseCase = new DeleteUseCase();

  constructor() {
    // Bind the run method to the instance of CreateUseCase
    this.GetAllDataAccess.run = this.GetAllDataAccess.run.bind(this.GetAllDataAccess);
    this.CreateUseCase.run = this.CreateUseCase.run.bind(this.CreateUseCase);
    this.UpdateUseCase.run = this.UpdateUseCase.run.bind(this.UpdateUseCase);
    this.ActivateUseCase.run = this.ActivateUseCase.run.bind(this.ActivateUseCase);
    this.DeactivateUseCase.run = this.DeactivateUseCase.run.bind(this.DeactivateUseCase);
    this.DeleteUseCase.run = this.DeleteUseCase.run.bind(this.DeleteUseCase);
  }
}
