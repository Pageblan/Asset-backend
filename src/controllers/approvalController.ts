import { Request, Response } from 'express';
import * as approvalService from '../services/approvalService';

export const getAllApprovals = async (req: Request, res: Response) => {
  try {
    const approvals = await approvalService.getAllApprovals();
    res.status(200).json(approvals);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};