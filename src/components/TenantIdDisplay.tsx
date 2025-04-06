
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getConfigValue } from '@/services/config';

const TenantIdDisplay = () => {
  const tenantId = getConfigValue('tenantId') || 'Not set';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="tenantId">Tenant ID</Label>
          <Input 
            id="tenantId" 
            value={tenantId} 
            className="font-mono" 
            readOnly 
          />
          <p className="text-sm text-muted-foreground mt-1">
            This is the unique identifier for this deployment. It's set when the application is deployed via URL parameters.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantIdDisplay;
