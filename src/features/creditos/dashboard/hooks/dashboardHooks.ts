import { useQuery } from '@tanstack/react-query';
import { obtenerDashboardResumen, obtenerMovimientosCobranzaEnRango, obtenerMovimientosEnRango } from '../../api';

export const useDashboardMovimientosRangoQuery = (params: {
  fechaDesde: string;
  fechaHasta: string;
  zonaId?: string;
  cobradorId?: string;
  creditoFolio?: string;
  clienteNombre?: string;
}) => {
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

export const useCobranzaMovimientosRangoQuery = (params: {
  fechaDesde: string;
  fechaHasta: string;
  zonaId?: string;
  cobradorId?: string;
  creditoFolio?: string;
  clienteNombre?: string;
}) => {
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

export const useDashboardResumenQuery = (params?: { zonaId?: string }) => {
  return useQuery({
    queryKey: ['creditos', 'dashboard', 'resumen', params?.zonaId],
    queryFn: () => obtenerDashboardResumen(params),
  });
};
