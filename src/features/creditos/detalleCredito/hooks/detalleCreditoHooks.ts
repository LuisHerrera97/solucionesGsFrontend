import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PenalizarFichaCreditoRequest } from '../../types/types';
import {
  actualizarObservacion,
  condonarInteres,
  condonarInteresMonto,
  obtenerMovimientosCredito,
  penalizarFicha,
  reestructurarCredito,
  reversarMovimiento,
} from '../../api';
import { useAbonarFichaCreditoMutation } from '../../creditos/hooks/creditosHooks';

export { useAbonarFichaCreditoMutation };

const invalidateTrasFichaCredito = async (queryClient: ReturnType<typeof useQueryClient>, creditoId: string) => {
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos'] });
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos', creditoId] });
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos', creditoId, 'movimientos'] });
  await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'dashboard', 'movimientos'] });
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'dashboard', 'movimientos-cobranza'] });
};

export const useMovimientosByCreditoQuery = (id?: string) => {
  return useQuery({
    queryKey: ['creditos', 'creditos', id, 'movimientos'],
    queryFn: () => obtenerMovimientosCredito(id as string),
    enabled: Boolean(id),
  });
};

export const usePenalizarFichaCreditoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PenalizarFichaCreditoRequest) => penalizarFicha(payload),
    onSuccess: async (_data, variables) => {
      await invalidateTrasFichaCredito(queryClient, variables.creditoId);
    },
  });
};

export const useReversarMovimientoCreditoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { creditoId: string; movimientoId: string }) => reversarMovimiento(payload),
    onSuccess: async (_data, variables) => {
      await invalidateTrasFichaCredito(queryClient, variables.creditoId);
    },
  });
};

export const useReestructurarCreditoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { creditoId: string; nuevoMonto: number; nuevoPlazo: number; tipo: 'diario' | 'semanal' | 'mensual' }) =>
      reestructurarCredito(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'reportes'] });
    },
  });
};

export const useCondonarInteresMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { creditoId: string; numeroFicha: number }) => condonarInteres(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos', variables.creditoId] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
    },
  });
};

export const useCondonarInteresMontoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { creditoId: string; monto: number }) => condonarInteresMonto(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos', variables.creditoId] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
    },
  });
};

export const useActualizarObservacionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { creditoId: string; observacion: string }) => actualizarObservacion(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos', variables.creditoId] });
    },
  });
};
