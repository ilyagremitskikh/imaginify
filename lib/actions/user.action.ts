'use server';

import { Prisma, User } from '@/prisma/generated/client';
import prisma from '@/prisma/prisma-client';
import { handleError } from '../utils';
import { PrismaClientKnownRequestError } from '@/prisma/generated/client/runtime/library';
import { revalidatePath } from 'next/cache';

// CREATE
export async function createUser(user: Prisma.UserCreateInput): Promise<User> {
  try {
    const newUser = await prisma.user.create({ data: user });
    return newUser;
  } catch (error) {
    return handleError(error);
  }
}

// READ
export async function getUserById(userId: string): Promise<User> {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        clerkId: userId,
      },
    });

    return user;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new Error('User not found');
      }
    }
    return handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: Prisma.UserUpdateInput): Promise<User> {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        clerkId: clerkId,
      },
      data: user,
    });

    return updatedUser;
  } catch (error) {
    return handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string): Promise<User | null> {
  try {
    // Delete user
    const deletedUser = await prisma.user.delete({
      where: {
        clerkId: clerkId,
      },
    });
    revalidatePath('/');

    return deletedUser || null;
  } catch (error) {
    return handleError(error);
  }
}

// USE CREDITS
export async function updateCredits(userId: string, creditFee: number): Promise<User> {
  try {
    const updatedUserCredits = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        creditBalance: {
          increment: creditFee,
        },
      },
    });

    if (!updatedUserCredits) throw new Error('User credits update failed');

    return updatedUserCredits;
  } catch (error) {
    return handleError(error);
  }
}
