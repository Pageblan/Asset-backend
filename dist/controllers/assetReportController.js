"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetsByStatusReport = void 0;
const assetReportService_1 = require("../services/assetReportService");
const getAssetsByStatusReport = async (req, res) => {
    try {
        const data = await (0, assetReportService_1.getAssetsByStatus)();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAssetsByStatusReport = getAssetsByStatusReport;
// ... existing code ...
