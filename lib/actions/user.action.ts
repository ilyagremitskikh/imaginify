'use server';

import { revalidatePath } from 'next/cache';

import { handleError } from '../utils';
import prisma from '@/prisma/prisma-client';
import { User } from '@prisma/client';

// CREATE
export async function createUser(user: User) {
  try {
    const newUser = await prisma.user.create({ data: user });
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findFirst({ where: { clerkId: userId } });

    if (!user) throw new Error('User not found');

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: User) {
  try {
    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: user,
    });

    if (!updatedUser) throw new Error('User update failed');

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    // Find user to delete
    // const userToDelete = await User.findOne({ clerkId });

    const userToDelete = await prisma.user.findFirst({ where: { clerkId } });

    if (!userToDelete) {
      throw new Error('User not found');
    }

    // Delete user
    const deletedUser = await prisma.user.delete({ where: { clerkId } });
    revalidatePath('/');

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
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
    handleError(error);
  }
}
