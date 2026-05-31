import { UserRepository } from '../repositories/user.repository';

export const AdminService = {

  async getUsers() {
    return UserRepository.findAll();
  },

  async activateUser(id: number) {
    const user = await UserRepository.findById(id);
    if (!user) { const err: any = new Error('User not found.'); err.status = 404; throw err; }
    await UserRepository.setActive(id, true);
    return UserRepository.findById(id);
  },

  async deactivateUser(id: number) {
    const user = await UserRepository.findById(id);
    if (!user) { const err: any = new Error('User not found.'); err.status = 404; throw err; }
    await UserRepository.setActive(id, false);
    return UserRepository.findById(id);
  },

  async deleteUser(id: number, requesterId: number) {
    if (id === requesterId) {
      const err: any = new Error('You cannot delete your own account.'); err.status = 400; throw err;
    }
    const user = await UserRepository.findById(id);
    if (!user) { const err: any = new Error('User not found.'); err.status = 404; throw err; }
    await UserRepository.softDelete(id);
  },
};
