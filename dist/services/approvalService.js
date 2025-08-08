"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllApprovals = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllApprovals = async () => {
    return prisma.approval.findMany();
};
exports.getAllApprovals = getAllApprovals;
