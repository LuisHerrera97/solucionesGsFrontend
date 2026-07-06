import { type QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AbonarFichaCreditoRequest, Cliente, PenalizarFichaCreditoRequest } from '../types/types';
import {
  obtenerClientes,
  obtenerCreditosDeCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  obtenerCreditos,
  obtenerCreditoPorId,
  obtenerMovimientosCredito,
  crearCredito,
  abonarFicha,
  abonarFichasVigentes,
  penalizarFicha,
  reversarMovimiento,
  reestructurarCredito,
  condonarInteres,
  condonarInteresMonto,
  actualizarObservacion,
  aplicarMora,
  obtenerDashboardResumen,
  obtenerMovimientosEnRango,
  obtenerMovimientosCobranzaEnRango,
  obtenerCortes,
} from '../api';

export const useClientesQuery = (params?: { page?: number; pageSize?: number; buscar?: string; zonaId?: string }) => {
  return useQuery({
    queryKey: ['creditos', 'clientes', params?.page ?? '', params?.pageSize ?? '', params?.buscar ?? '', params?.zonaId ?? ''],
    queryFn: () => obtenerClientes(params),
  });
};

export const useCrearClienteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Cliente, 'id'>) => crearCliente(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'clientes'] });
    },
  });
};

export const useActualizarClienteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; payload: Omit<Cliente, 'id'> }) => actualizarCliente(args.id, args.payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'clientes'] });
    },
  });
};

export const useEliminarClienteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eliminarCliente(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'clientes'] });
    },
  });
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

export const useClientesCreditosQuery = (clienteId?: string) => {
  return useQuery({
    queryKey: ['creditos', 'clientes', clienteId, 'creditos'],
    queryFn: () => obtenerCreditosDeCliente(clienteId as string),
    enabled: Boolean(clienteId),
  });
};

export const useMovimientosByCreditoQuery = (id?: string) => {
  return useQuery({
    queryKey: ['creditos', 'creditos', id, 'movimientos'],
    queryFn: () => obtenerMovimientosCredito(id as string),
    enabled: Boolean(id),
  });
};

export const useCrearCreditoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { clienteId: string; monto: number; plazo: number; tipo: 'diario' | 'semanal' | 'mensual'; permitirDomingo?: boolean; aplicarFeriados?: boolean; tasaManual?: number; observacion?: string }) =>
      crearCredito(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'reportes'] });
    },
  });
};

const invalidateTrasFichaCredito = async (queryClient: QueryClient, creditoId: string) => {
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos'] });
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos', creditoId] });
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos', creditoId, 'movimientos'] });
  await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'dashboard', 'movimientos'] });
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'dashboard', 'movimientos-cobranza'] });
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

export const useAbonarFichasVigentesCreditoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { creditoId: string; cantidadFichas: number; montoAbono: number; medio: 'Efectivo' | 'Transferencia' | 'Mixto'; montoEfectivo?: number; montoTransferencia?: number; idempotencyKey?: string }) =>
      abonarFichasVigentes(payload),
    onSuccess: async (_data, variables) => {
      await invalidateTrasFichaCredito(queryClient, variables.creditoId);
    },
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

export const useDashboardMovimientosRangoQuery = (params: { fechaDesde: string; fechaHasta: string; zonaId?: string; cobradorId?: string; creditoFolio?: string; clienteNombre?: string }) => {
  return useQuery({
    queryKey: [
      'creditos',
      'dashboard',
      'movimientos',
      params.fechaDesde,
      params.fechaHasta,
      params.zonaId ?? '',
      params.cobradorId ?? '',
      params.creditoFolio ?? '',
      params.clienteNombre ?? '',
    ],
    queryFn: () => obtenerMovimientosEnRango(params),
  });
};

export const useCobranzaMovimientosRangoQuery = (params: { fechaDesde: string; fechaHasta: string; zonaId?: string; cobradorId?: string; creditoFolio?: string; clienteNombre?: string }) => {
  return useQuery({
    queryKey: [
      'creditos',
      'dashboard',
      'movimientos-cobranza',
      params.fechaDesde,
      params.fechaHasta,
      params.zonaId ?? '',
      params.cobradorId ?? '',
      params.creditoFolio ?? '',
      params.clienteNombre ?? '',
    ],
    queryFn: () => obtenerMovimientosCobranzaEnRango(params),
  });
};

export const useCortesQuery = (params: { fechaInicio?: string; fechaFin?: string }) => {
  return useQuery({
    queryKey: ['creditos', 'cortes', params.fechaInicio ?? '', params.fechaFin ?? ''],
    queryFn: () => obtenerCortes(params),
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

export const useDashboardResumenQuery = (params?: { zonaId?: string }) => {
  return useQuery({
    queryKey: ['creditos', 'dashboard', 'resumen', params?.zonaId],
    queryFn: () => obtenerDashboardResumen(params),
  });
};
