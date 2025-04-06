
/**
 * Configuration settings types for the application
 */
export interface ConfigSettings {
  tenantId?: string;
  idx_api_key?: string;
  idx_api_version?: string; 
  idx_ancillary_key?: string;
  idx_output_type?: string;
  api_version?: string;
  ancillary_key?: string;
  airtable_api_key?: string;
  airtable_base_id?: string;
  airtable_agent_filter?: string;
  agent_filter?: string;
  api_key?: string;
  agent_name?: string;
  agent_bio?: string;
  agent_photo?: string;
  agent_phone?: string;
  agent_email?: string;
  agent_license?: string;
  // Email configuration
  smtp_host?: string;
  smtp_port?: string;
  smtp_user?: string;
  smtp_password?: string;
  smtp_from_email?: string;
  smtp_from_name?: string;
  smtp_secure?: string;
  contact_form_recipients?: string;
}
