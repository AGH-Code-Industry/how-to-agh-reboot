import { z } from 'zod';
import { UserController } from '../controllers/user_controller';
import { UserRepository } from '../repository/user_repository';
import { procedure, router } from '../../init';

const userRepository = new UserRepository();
const userController = new UserController(userRepository);

export const userRouter = router({
  getUser: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return userController.getUser(input.id);
  }),

  getUsers: procedure.query(async () => {
    return userController.getUsers();
  }),
});
