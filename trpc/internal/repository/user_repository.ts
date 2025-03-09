import { PrismaClient } from '@prisma/client';
import { User as DomainUser } from '../types/user';
import { toDomainUser } from '../mappers/user_api_types';

const prisma = new PrismaClient();

export class UserRepository {
  async getUserById(id: number): Promise<DomainUser | null> {
    const user = await prisma.user.findUnique({
      where: { user_id: id },
      include: {
        event_visits: true,
        quiz_question_answers: true,
      },
    });
    return user ? toDomainUser(user) : null;
  }

  async getAllUsers(): Promise<DomainUser[]> {
    const users = await prisma.user.findMany({
      include: {
        event_visits: true,
        quiz_question_answers: true,
      },
    });
    return users.map(toDomainUser);
  }
}
