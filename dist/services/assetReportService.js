"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetsByStatus = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAssetsByStatus = async () => {
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
    }
    catch (error) {
        console.error('Error fetching assets by status:', error);
        throw new Error('Could not fetch assets by status');
    }
};
exports.getAssetsByStatus = getAssetsByStatus;
// ... existing code ...
