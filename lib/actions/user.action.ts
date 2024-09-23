'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/prisma/prisma-client';
import { Prisma, User } from '@prisma/client';

// CREATE
export async function createUser(user: Prisma.UserCreateInput): Promise<User> {
  try {
    const newUser = await prisma.user.create({ data: user });
    return newUser;
  } catch (error) {
    return Promise.reject(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findFirst({ where: { clerkId: userId } });

    if (!user) throw new Error('User not found');

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    return Promise.reject(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: Prisma.UserUpdateInput) {
  try {
    const updatedUser = await prisma.user.update({
      where: { clerkId: clerkId },
      data: user,
    });

    if (!updatedUser) throw new Error('User update failed');

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    return Promise.reject(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    // Find user to delete
    // const userToDelete = await User.findOne({ clerkId });

    const userToDelete = await prisma.user.findFirst({ where: { clerkId: clerkId } });

    if (!userToDelete) {
      throw new Error('User not found');
    }

    // Delete user
    const deletedUser = await prisma.user.delete({ where: { clerkId: clerkId } });
    revalidatePath('/');

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    return Promise.reject(error);
  }
}

// USE CREDITS
export async function updateCredits(userId: number, creditFee: number) {
  try {
    const updatedUserCredits = await prisma.user.update({
      where: { id: userId },
      data: {
        creditBalance: {
          increment: creditFee, // Increment the creditBalance by creditFee
        },
      },
    });

    if (!updatedUserCredits) throw new Error('User credits update failed');

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    return Promise.reject(error);
  }
}
