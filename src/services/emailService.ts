
import { getConfigValue } from './config';
import { toast } from 'sonner';

/**
 * Send an email using the configured SMTP settings
 */
export interface EmailData {
  to: string | string[];
  subject: string;
  body: string;
  replyTo?: string;
}

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  const smtpHost = getConfigValue('smtp_host');
  const smtpPort = getConfigValue('smtp_port');
  const smtpUser = getConfigValue('smtp_user');
  const smtpPassword = getConfigValue('smtp_password');
  const fromEmail = getConfigValue('smtp_from_email');
  const fromName = getConfigValue('smtp_from_name');
  
  // Check if SMTP is configured
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !fromEmail) {
    console.error('SMTP not configured properly');
    toast.error('Email configuration is incomplete. Please check Settings > Email');
    return false;
  }
  
  // In a real implementation, you would make an API call to a backend service
  // that would handle the actual email sending using nodemailer or similar
  
  // For now, we'll simulate a successful email send
  console.log('Sending email:', {
    from: fromName ? `${fromName} <${fromEmail}>` : fromEmail,
    to: Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to,
    subject: emailData.subject,
    body: emailData.body,
    replyTo: emailData.replyTo
  });
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In production, this would return based on the actual email sending result
  return true;
};

/**
 * Get comma-separated contact form recipients as an array
 */
export const getContactFormRecipients = (): string[] => {
  const recipients = getConfigValue('contact_form_recipients');
  if (!recipients) return [];
  
  return recipients.split(',').map(email => email.trim()).filter(Boolean);
};
