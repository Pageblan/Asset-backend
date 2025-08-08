import { Request, Response } from 'express';
import { Not } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Department } from '../entities/Department';

/**
 * Get all departments
 * @param req Request
 * @param res Response
 */
export const getAllDepartments = async (req: Request, res: Response): Promise<void> => {
    try {
        const departmentRepository = AppDataSource.getRepository(Department);
        const departments = await departmentRepository.find({
            where: { is_active: true },
            order: { name: 'ASC' }
        });
        
        res.status(200).json(departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ message: 'Failed to fetch departments' });
    }
};

/**
 * Get department by ID
 * @param req Request
 * @param res Response
 */
export const getDepartmentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const departmentRepository = AppDataSource.getRepository(Department);
        const department = await departmentRepository.findOneBy({ id });
        
        if (!department) {
            res.status(404).json({ message: 'Department not found' });
            return;
        }
        
        res.status(200).json(department);
    } catch (error) {
        console.error('Error fetching department:', error);
        res.status(500).json({ message: 'Failed to fetch department' });
    }
};

/**
 * Create new department
 * @param req Request
 * @param res Response
 */
export const createDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, code, email, description, location } = req.body;
        
        const departmentRepository = AppDataSource.getRepository(Department);
        
        // Check if department with same name, code, or email exists
        const existingDepartment = await departmentRepository.findOne({
            where: [{ name }, { code }, { email }]
        });
        
        if (existingDepartment) {
            res.status(400).json({ message: 'Department with this name, code, or email already exists' });
            return;
        }
        
        const department = new Department();
        department.name = name;
        department.code = code;
        department.email = email;
        department.description = description;
        department.location = location;
        
        await departmentRepository.save(department);
        
        res.status(201).json(department);
    } catch (error) {
        console.error('Error creating department:', error);
        res.status(500).json({ message: 'Failed to create department' });
    }
};

/**
 * Update department
 * @param req Request
 * @param res Response
 */
export const updateDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, code, email, description, location, is_active } = req.body;
        
        const departmentRepository = AppDataSource.getRepository(Department);
        const department = await departmentRepository.findOneBy({ id });
        
        if (!department) {
            res.status(404).json({ message: 'Department not found' });
            return;
        }
        
        // Check if updated name, code, or email conflicts with existing departments
        if (name !== department.name || code !== department.code || email !== department.email) {
            const existingDepartment = await departmentRepository.findOne({
                where: [
                    { name, id: Not(id) },
                    { code, id: Not(id) },
                    { email, id: Not(id) }
                ]
            });
            
            if (existingDepartment) {
                res.status(400).json({ message: 'Department with this name, code, or email already exists' });
                return;
            }
        }
        
        department.name = name || department.name;
        department.code = code || department.code;
        department.email = email || department.email;
        department.description = description !== undefined ? description : department.description;
        department.location = location !== undefined ? location : department.location;
        department.is_active = is_active !== undefined ? is_active : department.is_active;
        
        await departmentRepository.save(department);
        
        res.status(200).json(department);
    } catch (error) {
        console.error('Error updating department:', error);
        res.status(500).json({ message: 'Failed to update department' });
    }
};

/**
 * Delete department
 * @param req Request
 * @param res Response
 */
export const deleteDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        const departmentRepository = AppDataSource.getRepository(Department);
        const department = await departmentRepository.findOneBy({ id });
        
        if (!department) {
            res.status(404).json({ message: 'Department not found' });
            return;
        }
        
        // Soft delete by setting is_active to false
        department.is_active = false;
        await departmentRepository.save(department);
        
        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        console.error('Error deleting department:', error);
        res.status(500).json({ message: 'Failed to delete department' });
    }
};