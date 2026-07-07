import { type QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { abonarFicha, aplicarMora, obtenerCreditoPorId, obtenerCreditos } from '../../api';
import type { AbonarFichaCreditoRequest } from '../../types/types';

const invalidateTrasFichaCredito = async (queryClient: QueryClient, creditoId: string) => {
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos'] });
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos', creditoId] });
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos', creditoId, 'movimientos'] });
  await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'dashboard', 'movimientos'] });
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'dashboard', 'movimientos-cobranza'] });
};

export const useCreditosQuery = (params?: { searchTerm?: string; page?: number; pageSize?: number; zonaId?: string }) => {
  return useQuery({
    queryKey: ['creditos', 'creditos', params?.searchTerm ?? '', params?.page ?? '', params?.pageSize ?? '', params?.zonaId ?? ''],
    queryFn: () => obtenerCreditos(params),
  });
};

export const useCreditoByIdQuery = (id?: string) => {
  return useQuery({
    queryKey: ['creditos', 'creditos', id],
    queryFn: () => obtenerCreditoPorId(id as string),
    enabled: Boolean(id),
  });
};

export const useAbonarFichaCreditoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AbonarFichaCreditoRequest) => abonarFicha(payload),
    onSuccess: async (_data, variables) => {
      await invalidateTrasFichaCredito(queryClient, variables.creditoId);
    },
  });
};

export const useAplicarMoraMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => aplicarMora(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
    },
  });
};
