// src/services/notificationService.ts
import { Maintenance } from '../entities/Maintenance';
import { AppDataSource } from '../config/database';
import { Asset } from '../entities/Asset';
import { Department } from '../entities/Department';
import { Assignment } from '../entities/Assignment';
import nodemailer from 'nodemailer';

// Configure email transport
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST     || 'smtp.example.com',
  port:   parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE   === 'true',
  auth: {
    user: process.env.SMTP_USER     || 'user@example.com',
    pass: process.env.SMTP_PASSWORD || 'password',
  },
});

/**
 * Send maintenance notifications for upcoming maintenance
 * @param maintenanceList List of upcoming maintenance
 */
export const sendMaintenanceNotifications = async (
  maintenanceList: Maintenance[]
): Promise<void> => {
  const assetRepo      = AppDataSource.getRepository(Asset);
  const deptRepo       = AppDataSource.getRepository(Department);
  const assignmentRepo = AppDataSource.getRepository(Assignment);

  for (const maintenance of maintenanceList) {
    try {
      // 1) Get the related asset
      const asset = await assetRepo.findOneBy({ id: maintenance.asset_id });
      if (!asset) continue;

      // 2) Find the *current* assignment that is NOT yet acknowledged
      const assignment = await assignmentRepo.findOne({
        where: {
          asset_id:        asset.id,
          is_acknowledged: false,
        },
        relations: ['department'],
      });
      if (!assignment) continue;

      // 3) Get department info
      const department = await deptRepo.findOneBy({
        id: assignment.department_id,
      });
      if (!department) continue;

      // 4) Format the date
      const maintenanceDate = new Date(
        maintenance.scheduled_date
      ).toLocaleDateString();

      // 5) Send the email
      await transporter.sendMail({
        from: `"Asset Management" <${
          process.env.SMTP_FROM || 'noreply@example.com'
        }>`,
        to: department.email,
        subject: `Upcoming Maintenance: ${asset.name} (${asset.asset_id})`,
        html: `
          <h2>Upcoming Maintenance Notification</h2>
          <p>This is a reminder that the following asset is scheduled for maintenance:</p>
          <ul>
            <li><strong>Asset:</strong> ${asset.name}</li>
            <li><strong>Asset ID:</strong> ${asset.asset_id}</li>
            <li><strong>Model:</strong> ${asset.model}</li>
            <li><strong>Serial Number:</strong> ${asset.serial_number}</li>
            <li><strong>Department:</strong> ${department.name}</li>
            <li><strong>Maintenance Type:</strong> ${
              maintenance.maintenance_type
            }</li>
            <li><strong>Scheduled Date:</strong> ${maintenanceDate}</li>
            <li><strong>Description:</strong> ${
              maintenance.description || 'N/A'
            }</li>
          </ul>
          <p>Please ensure the asset is available for maintenance on the scheduled date.</p>
          <p>Thank you,<br> Asset Management System</p>
        `,
      });

      console.log(
        `Maintenance notification sent for asset ${asset.asset_id} to ${department.email}`
      );
    } catch (err) {
      console.error(
        `Error sending maintenance notification for maintenance ID ${maintenance.id}:`,
        err
      );
    }
  }
};

/**
 * Send assignment notification
 * @param assignment The new assignment record
 */
export const sendAssignmentNotification = async (
  assignment: Assignment
): Promise<void> => {
  try {
    const assetRepo = AppDataSource.getRepository(Asset);
    const deptRepo  = AppDataSource.getRepository(Department);

    // 1) Fetch asset
    const asset = await assetRepo.findOneBy({ id: assignment.asset_id });
    if (!asset) return;

    // 2) Fetch department
    const department = await deptRepo.findOneBy({
      id: assignment.department_id,
    });
    if (!department) return;

    // 3) Send the email
    await transporter.sendMail({
      from: `"Asset Management" <${
        process.env.SMTP_FROM || 'noreply@example.com'
      }>`,
      to: department.email,
      subject: `New Asset Assignment: ${asset.name} (${asset.asset_id})`,
      html: `
        <h2>New Asset Assignment</h2>
        <p>A new asset has been assigned to your department:</p>
        <ul>
          <li><strong>Asset:</strong> ${asset.name}</li>
          <li><strong>Asset ID:</strong> ${asset.asset_id}</li>
          <li><strong>Model:</strong> ${asset.model}</li>
          <li><strong>Serial Number:</strong> ${asset.serial_number}</li>
          <li><strong>Department:</strong> ${department.name}</li>
          <li><strong>Assigned By:</strong> ${assignment.assigned_by}</li>
          <li><strong>Assigned At:</strong> ${new Date(
            assignment.assigned_at
          ).toLocaleString()}</li>
        </ul>
        <p>Please acknowledge receipt of this asset in the Asset Management System.</p>
        <p>Thank you,<br> Asset Management System</p>
      `,
    });

    console.log(
      `Assignment notification sent for asset ${asset.asset_id} to ${department.email}`
    );
  } catch (err) {
    console.error(
      `Error sending assignment notification for assignment ID ${assignment.id}:`,
      err
    );
  }
};

/**
 * Send disposal notification
 * @param asset The asset being disposed
 * @param disposalDate Date of disposal
 * @param notes Additional notes about disposal
 */
export const sendDisposalNotification = async (
  asset: Asset,
  disposalDate: Date,
  notes?: string
): Promise<void> => {
  try {
    const assignmentRepo = AppDataSource.getRepository(Assignment);
    const deptRepo = AppDataSource.getRepository(Department);
    
    // Find the last department that had this asset
    const lastAssignment = await assignmentRepo.findOne({
      where: { asset_id: asset.id },
      order: { assigned_at: 'DESC' },
      relations: ['department']
    });
    
    if (!lastAssignment) return;
    
    // Get department info
    const department = await deptRepo.findOneBy({
      id: lastAssignment.department_id,
    });
    if (!department) return;
    
    // Format the date
    const formattedDisposalDate = new Date(disposalDate).toLocaleDateString();
    
    // Send the email
    await transporter.sendMail({
      from: `" Asset Management" <${
        process.env.SMTP_FROM || 'noreply@example.com'
      }>`,
      to: department.email,
      subject: `Asset Disposal: ${asset.name} (${asset.asset_id})`,
      html: `
        <h2>Asset Disposal Notification</h2>
        <p>The following asset has been marked for disposal:</p>
        <ul>
          <li><strong>Asset:</strong> ${asset.name}</li>
          <li><strong>Asset ID:</strong> ${asset.asset_id}</li>
          <li><strong>Model:</strong> ${asset.model}</li>
          <li><strong>Serial Number:</strong> ${asset.serial_number}</li>
          <li><strong>Department:</strong> ${department.name}</li>
          <li><strong>Disposal Date:</strong> ${formattedDisposalDate}</li>
          <li><strong>Reason:</strong> ${notes || 'Not specified'}</li>
        </ul>
        <p>If you have any questions regarding this disposal, please contact the asset management team.</p>
        <p>Thank you,<br> Asset Management System</p>
      `,
    });

    console.log(
      `Disposal notification sent for asset ${asset.asset_id} to ${department.email}`
    );
  } catch (err) {
    console.error(
      `Error sending disposal notification for asset ID ${asset.id}:`,
      err
    );
  }
};
