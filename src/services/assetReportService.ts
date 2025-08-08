import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAssetsByStatus = async () => {
  try {
    const assetsByStatus = await prisma.asset.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    return assetsByStatus.map(item => ({
      status: item.status,
      count: item._count.id,
    }));
  } catch (error) {
    console.error('Error fetching assets by status:', error);
    throw new Error('Could not fetch assets by status');
  }
};

// ... existing code ...