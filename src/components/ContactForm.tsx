
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { sendEmail, getContactFormRecipients } from '@/services/emailService';

interface ContactFormProps {
  propertyId?: string;
  propertyAddress?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ propertyId, propertyAddress }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: propertyAddress 
      ? `I am interested in ${propertyAddress}.` 
      : 'I would like more information about properties in this area.',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const recipients = getContactFormRecipients();
      
      if (recipients.length === 0) {
        toast.error('No recipient emails configured. Please set up contact form recipients in Settings > Email');
        setIsSubmitting(false);
        return;
      }
      
      // Format the email content
      const subject = propertyId 
        ? `Property Inquiry: ${propertyAddress || propertyId}`
        : 'New Contact Form Submission';
        
      const body = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
        ${propertyId ? `<p><strong>Property ID:</strong> ${propertyId}</p>` : ''}
        ${propertyAddress ? `<p><strong>Property Address:</strong> ${propertyAddress}</p>` : ''}
        <hr>
        <p><small>This email was sent from the contact form on your website.</small></p>
      `.trim().replace(/\n\s+/g, '\n');
      
      const emailSent = await sendEmail({
        to: recipients,
        subject,
        body,
        replyTo: formData.email
      });
      
      if (emailSent) {
        toast.success('Your message has been sent!');
        // Reset form except for property address if it exists
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: propertyAddress 
            ? `I am interested in ${propertyAddress}.` 
            : 'I would like more information about properties in this area.',
        });
      } else {
        toast.error('Failed to send message. Please try again later.');
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your email address"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Your phone number"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message"
          rows={4}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
};

export default ContactForm;
