import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { abonarFichasVigentes, aplicarMora, obtenerCreditoPorId, obtenerCreditos } from '../../api';

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

export const useAbonarFichasVigentesCreditoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      creditoId: string;
      cantidadFichas: number;
      montoAbono: number;
      medio: 'Efectivo' | 'Transferencia' | 'Mixto';
      montoEfectivo?: number;
      montoTransferencia?: number;
      idempotencyKey?: string;
    }) => abonarFichasVigentes(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos', variables.creditoId] });
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos', variables.creditoId, 'movimientos'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'dashboard', 'movimientos'] });
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'dashboard', 'movimientos-cobranza'] });
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
