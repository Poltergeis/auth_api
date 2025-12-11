import { StudentRepository } from "../domain/StudentRepository";

export default class DeleteStudentUseCase {
  constructor(
    private readonly repository: StudentRepository
  ) { }
  
  async run(email: string, password: string) {
    return await this.repository.delete(email, password);
  }
}