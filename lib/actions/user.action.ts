'use server';

import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

// CREATE
export async function createUser(user: Prisma.UserCreateInput) {
  const prisma = new PrismaClient();
  await prisma.user
    .create({ data: user })
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
