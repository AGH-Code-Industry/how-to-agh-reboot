import { UserRepository } from '../repository/user_repository';
import { User as DomainUser } from '../types/user';

export class UserController {
  constructor(private userRepository: UserRepository) {}

  async getUser(id: number): Promise<DomainUser | null> {
    return this.userRepository.getUserById(id);
  }

  async getUsers(): Promise<DomainUser[]> {
    return this.userRepository.getAllUsers();
  }
}
