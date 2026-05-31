import { UserRepository } from '../repositories/user.repository';
import { BlogRepository } from '../repositories/blog.repository';
import { UserRow, BlogRow } from '../types';

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

  async getDeletedUsers(): Promise<UserRow[]> {
    return UserRepository.findDeleted();
  },

  async restoreUser(id: number): Promise<void> {
    const user = await UserRepository.findById(id);
    if (!user) { const err: any = new Error('User not found.'); err.status = 404; throw err; }
    if (!user.is_deleted) { const err: any = new Error('User is not deleted.'); err.status = 400; throw err; }
    await UserRepository.restore(id);
  },

  async hardDeleteUser(id: number): Promise<void> {
    const user = await UserRepository.findById(id);
    if (!user) { const err: any = new Error('User not found.'); err.status = 404; throw err; }
    await UserRepository.hardDelete(id);
  },

  async getDeletedBlogs(): Promise<BlogRow[]> {
    return BlogRepository.findDeleted();
  },

  async restoreBlog(id: number): Promise<void> {
    const blog = await BlogRepository.findById(id);
    if (!blog) { const err: any = new Error('Blog not found.'); err.status = 404; throw err; }
    if (!blog.is_deleted) { const err: any = new Error('Blog is not deleted.'); err.status = 400; throw err; }
    await BlogRepository.restore(id);
  },

  async hardDeleteBlog(id: number): Promise<void> {
    const blog = await BlogRepository.findById(id);
    if (!blog) { const err: any = new Error('Blog not found.'); err.status = 404; throw err; }
    await BlogRepository.hardDelete(id);
  }
};
