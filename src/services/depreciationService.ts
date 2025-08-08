import { AppDataSource } from '../config/database';
import { Asset } from '../entities/Asset';
import { IsNull } from 'typeorm';  // ← import IsNull

/**
 * Calculate depreciation for an asset using straight-line method
 */
export const calculateStraightLineDepreciation = async (asset: Asset): Promise<Asset> => {
  const repo = AppDataSource.getRepository(Asset);

  // Skip if asset is disposed
  if (asset.date_disposed) {
    return asset;
  }

  const today            = new Date();
  const receivedDate     = new Date(asset.date_received);
  const yearsSince       = (today.getTime() - receivedDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  const rate             = 1 / asset.depreciation_years;
  const totalDepreciation = Math.min(yearsSince * rate, 1);

  asset.current_value = asset.initial_value * (1 - totalDepreciation);

  return await repo.save(asset);
};

/**
 * Calculate depreciation for an asset using declining balance method
 */
export const calculateDecliningBalanceDepreciation = async (
  asset: Asset,
  rate: number = 2
): Promise<Asset> => {
  const repo = AppDataSource.getRepository(Asset);

  // Skip if asset is disposed
  if (asset.date_disposed) {
    return asset;
  }

  const today        = new Date();
  const receivedDate = new Date(asset.date_received);
  const yearsSince   = (today.getTime() - receivedDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

  const annualRate = rate / asset.depreciation_years;
  let currentValue = asset.initial_value;

  // Full years
  for (let i = 0; i < Math.floor(yearsSince); i++) {
    currentValue *= (1 - annualRate);
  }

  // Partial year
  const partial = yearsSince - Math.floor(yearsSince);
  if (partial > 0) {
    currentValue *= (1 - annualRate * partial);
  }

  const salvage = asset.salvage_value ?? (asset.initial_value * 0.1);
  asset.current_value = Math.max(currentValue, salvage);

  return await repo.save(asset);
};

/**
 * Dispatch to the correct depreciation method
 */
export const calculateDepreciation = async (asset: Asset): Promise<Asset> => {
  if (asset.depreciation_method === 'declining-balance') {
    return calculateDecliningBalanceDepreciation(asset);
  }
  return calculateStraightLineDepreciation(asset);
};

/**
 * Run depreciation calculation for all assets.
 * Should be scheduled e.g. via cron or a job runner.
 */
export const runDepreciationJob = async (): Promise<void> => {
  const repo = AppDataSource.getRepository(Asset);

  // Now uses IsNull() for the nullable date_disposed field
  const assets = await repo.find({
    where: {
      status: 'available',
      date_disposed: IsNull()
    }
  });

  for (const asset of assets) {
    await calculateDepreciation(asset);
  }

  console.log(`Depreciation calculated for ${assets.length} assets`);
};
