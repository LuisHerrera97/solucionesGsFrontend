import { useQuery } from '@tanstack/react-query';
import { obtenerPendientes } from '../../api';

export const usePendientesQuery = (params: { busqueda?: string; page: number; pageSize: number; zonaId?: string }) => {
  return useQuery({
    queryKey: ['cobranza', 'pendientes', params.busqueda ?? '', params.page, params.pageSize, params.zonaId ?? ''],
    queryFn: () => obtenerPendientes(params),
    placeholderData: (prev) => prev,
  });
};
