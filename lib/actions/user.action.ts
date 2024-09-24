'use server';

import { Prisma, User } from '@/prisma/generated/client';
import prisma from '@/prisma/prisma-client';
import { handleError } from '../utils';

// CREATE
export async function createUser(user: Prisma.UserCreateInput): Promise<User> {
  try {
    const newUser = await prisma.user.create({ data: user });
    return newUser;
  } catch (error) {
    handleError(error);
    return Promise.reject(error);
  }
}
