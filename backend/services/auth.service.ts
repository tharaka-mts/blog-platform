import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { generateToken } from '../config/jwt';
import { CreateUserDTO } from '../types';

export const AuthService = {

  async register(dto: CreateUserDTO) {
    const existing = await UserRepository.findByEmail(dto.email);
    if (existing) {
      const err: any = new Error('Email is already registered.'); err.status = 409; throw err;
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const id     = await UserRepository.create({ ...dto, password: hashed });
    const user   = await UserRepository.findById(id);
    return user;
  },

  async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      const err: any = new Error('Invalid credentials.'); err.status = 401; throw err;
    }
    if (!user.is_active) {
      const err: any = new Error('Your account has been deactivated. Please contact an administrator.'); err.status = 403; throw err;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const err: any = new Error('Invalid credentials.'); err.status = 401; throw err;
    }
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } };
  },

  async updateProfile(userId: number, newUsername: string) {
    await UserRepository.updateUsername(userId, newUsername);
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error('User not found.');
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } };
  },

  async updatePassword(userId: number, oldPass: string, newPass: string) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      const err: any = new Error('User not found.'); err.status = 404; throw err;
    }
    const match = await bcrypt.compare(oldPass, user.password);
    if (!match) {
      const err: any = new Error('Incorrect current password.'); err.status = 401; throw err;
    }
    const hashed = await bcrypt.hash(newPass, 10);
    await UserRepository.updatePassword(userId, hashed);
  },
};

