import { TutorRepository } from "../domain/TutorRepository";

export default class DeleteTutorUseCase {
  constructor(
    private readonly repository: TutorRepository
  ) { }
  
  async run(email: string, password: string) {
    return await this.repository.delete(email, password);
  }
}