
import { useQuery } from '@tanstack/react-query';
import { fetchIDXProperties } from '@/services/idxService';
import { useToast } from '@/hooks/use-toast';

export const useIdxProperties = () => {
  const { toast } = useToast();
  const idxApiKey = localStorage.getItem('idx_api_key');
  const isIdxEnabled = !!idxApiKey;

  return useQuery({
    queryKey: ['idxProperties'],
    queryFn: fetchIDXProperties,
    enabled: isIdxEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    meta: {
      onError: (error: Error) => {
        toast({
          title: 'Error Loading IDX Properties',
          description: error.message || 'Failed to load properties from IDX Broker.',
          variant: 'destructive',
        });
      }
    }
  });
};
