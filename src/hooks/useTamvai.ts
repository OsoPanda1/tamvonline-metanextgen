import { useQuery, useMutation } from '@tanstack/react-query';
import { TAMVRuntime, TAMVOperation } from '@/lib/tamvai/runtime';

export const useTamvai = (userId: string) => {
  
  const getSystemStatus = useQuery({
    queryKey: ['tamv-status'],
    queryFn: () => TAMVRuntime.execute('system.status', {}, { userId, tier: 1, sig: 'FE_01' }),
    refetchInterval: 5000
  });

  const transfer = useMutation({
    mutationFn: (payload: { receiverId: string, amount: number }) => 
      TAMVRuntime.execute('economy.transfer', payload, { userId, tier: 1, sig: 'FE_01' })
  });

  const syncIdentity = useMutation({
    mutationFn: (payload: { newScore: number }) => 
      TAMVRuntime.execute('identity.sync', payload, { userId, tier: 1, sig: 'FE_01' })
  });

  const vote = useMutation({
    mutationFn: (payload: { proposalId: string, vote: 'yes' | 'no' }) => 
      TAMVRuntime.execute('governance.vote', payload, { userId, tier: 1, sig: 'FE_01' })
  });

  const statusData = getSystemStatus.data as Record<string, unknown> | undefined;

  return {
    status: statusData,
    isAlert: statusData?.threatLevel === 'ALERT',
    executeTransfer: transfer.mutateAsync,
    syncIdentity: syncIdentity.mutateAsync,
    vote: vote.mutateAsync
  };
};