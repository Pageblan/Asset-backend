"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetUtilizationRates = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAssetUtilizationRates = async (startDate, endDate) => {
    const assignments = await prisma.assignment.findMany({
        where: {
            status: 'active',
            OR: [
                { endDate: { gte: startDate } }, // Assignment ends after or within the period
                { endDate: null }, // Ongoing assignment
            ],
            startDate: { lte: endDate }, // Assignment starts before or within the period
        },
        include: {
            asset: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    const assetUtilizationMap = new Map();
    const periodDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    assignments.forEach(assignment => {
        const assignStart = assignment.startDate > startDate ? assignment.startDate : startDate;
        const assignEnd = assignment.endDate && assignment.endDate < endDate ? assignment.endDate : endDate;
        const currentAssignmentEnd = assignment.endDate === null ? endDate : assignEnd;
        if (currentAssignmentEnd && assignStart < currentAssignmentEnd) {
            const assignedDurationMs = currentAssignmentEnd.getTime() - assignStart.getTime();
            const assignedDays = assignedDurationMs / (1000 * 60 * 60 * 24);
            const existing = assetUtilizationMap.get(assignment.assetId) || { totalAssignedDays: 0, assetName: assignment.asset.name };
            existing.totalAssignedDays += assignedDays;
            assetUtilizationMap.set(assignment.assetId, existing);
        }
    });
    const utilizationRates = Array.from(assetUtilizationMap.entries()).map(([assetId, data]) => ({
        assetId,
        assetName: data.assetName,
        utilizationRate: (data.totalAssignedDays / periodDays) * 100,
    }));
    return utilizationRates;
};
exports.getAssetUtilizationRates = getAssetUtilizationRates;
