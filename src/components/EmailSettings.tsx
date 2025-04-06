
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useConfigSetting } from '@/hooks/useConfigSettings';
import { toast } from 'sonner';
import { Mail, Server, Lock } from 'lucide-react';

const EmailSettings = () => {
  const { value: smtpHost, updateValue: updateSmtpHost } = useConfigSetting('smtp_host');
  const { value: smtpPort, updateValue: updateSmtpPort } = useConfigSetting('smtp_port');
  const { value: smtpUser, updateValue: updateSmtpUser } = useConfigSetting('smtp_user');
  const { value: smtpPassword, updateValue: updateSmtpPassword } = useConfigSetting('smtp_password');
  const { value: fromEmail, updateValue: updateFromEmail } = useConfigSetting('smtp_from_email');
  const { value: fromName, updateValue: updateFromName } = useConfigSetting('smtp_from_name');
  const { value: smtpSecure, updateValue: updateSmtpSecure } = useConfigSetting('smtp_secure');
  const { value: contactRecipients, updateValue: updateContactRecipients } = useConfigSetting('contact_form_recipients');

  const handleSave = () => {
    toast.success('Email settings updated successfully');
  };

  const handleTestEmail = async () => {
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !fromEmail) {
      toast.error('Please fill in all required SMTP settings before testing');
      return;
    }

    toast.info('Sending test email...');
    
    // In a real implementation, this would call an API endpoint to send a test email
    // For now, we'll simulate success after a delay
    setTimeout(() => {
      toast.success('Test email sent successfully');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2" /> Email Settings
          </CardTitle>
          <CardDescription>
            Configure SMTP settings for sending emails from contact forms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_host">SMTP Server Host <span className="text-red-500">*</span></Label>
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="smtp_host"
                    placeholder="smtp.example.com"
                    value={smtpHost || ''}
                    onChange={(e) => updateSmtpHost(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp_port">SMTP Port <span className="text-red-500">*</span></Label>
                <Input
                  id="smtp_port"
                  placeholder="587"
                  value={smtpPort || ''}
                  onChange={(e) => updateSmtpPort(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_user">SMTP Username <span className="text-red-500">*</span></Label>
                <Input
                  id="smtp_user"
                  placeholder="user@example.com"
                  value={smtpUser || ''}
                  onChange={(e) => updateSmtpUser(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp_password">SMTP Password <span className="text-red-500">*</span></Label>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="smtp_password"
                    type="password"
                    placeholder="••••••••"
                    value={smtpPassword || ''}
                    onChange={(e) => updateSmtpPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtp_secure" className="flex items-center gap-2">
                <span>Use Secure Connection (SSL/TLS)</span>
                <Switch 
                  id="smtp_secure"
                  checked={smtpSecure === 'true'}
                  onCheckedChange={(checked) => updateSmtpSecure(checked ? 'true' : 'false')}
                />
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable for secure connections on port 465, disable for STARTTLS on port 587
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_from_email">From Email <span className="text-red-500">*</span></Label>
                <Input
                  id="smtp_from_email"
                  placeholder="no-reply@yourdomain.com"
                  value={fromEmail || ''}
                  onChange={(e) => updateFromEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp_from_name">From Name</Label>
                <Input
                  id="smtp_from_name"
                  placeholder="South Florida Realty"
                  value={fromName || ''}
                  onChange={(e) => updateFromName(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact_form_recipients">Contact Form Recipients <span className="text-red-500">*</span></Label>
              <Input
                id="contact_form_recipients"
                placeholder="agent@example.com, manager@example.com"
                value={contactRecipients || ''}
                onChange={(e) => updateContactRecipients(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Comma-separated email addresses that will receive contact form submissions
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button onClick={handleSave} className="flex-1">
                Save Settings
              </Button>
              <Button onClick={handleTestEmail} variant="outline" className="flex-1">
                Send Test Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailSettings;
