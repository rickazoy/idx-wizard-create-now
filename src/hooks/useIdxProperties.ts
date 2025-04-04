
import { useQuery } from '@tanstack/react-query';
import { fetchIDXProperties } from '@/services/idxService';

export const useIdxProperties = () => {
  const idxApiKey = localStorage.getItem('idx_api_key');
  const isIdxEnabled = !!idxApiKey;

  return useQuery({
    queryKey: ['idxProperties'],
    queryFn: fetchIDXProperties,
    enabled: isIdxEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
