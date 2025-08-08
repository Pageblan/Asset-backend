import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllApprovals = async () => {
  return prisma.approval.findMany();
};