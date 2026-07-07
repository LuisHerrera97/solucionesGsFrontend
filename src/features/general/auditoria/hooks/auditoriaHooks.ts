import { useQuery } from '@tanstack/react-query';
import { obtenerAuditoria, obtenerAuditoriaFiltrosOpciones } from '../../api';

export const useAuditoriaQuery = (params: {
  desdeUtc?: string;
  hastaUtc?: string;
  usuarioId?: string;
  accion?: string;
  entidadTipo?: string;
  entidadId?: string;
  page?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: [
      'general',
      'auditoria',
      params.desdeUtc ?? '',
      params.hastaUtc ?? '',
      params.usuarioId ?? '',
      params.accion ?? '',
      params.entidadTipo ?? '',
      params.entidadId ?? '',
      params.page ?? 1,
      params.pageSize ?? 100,
    ],
    queryFn: () => obtenerAuditoria(params),
  });
};

export const useAuditoriaFiltrosOpcionesQuery = (params: { desdeUtc: string; hastaUtc: string }) => {
  return useQuery({
    queryKey: ['general', 'auditoria', 'filtros', params.desdeUtc, params.hastaUtc],
    queryFn: () => obtenerAuditoriaFiltrosOpciones(params),
  });
};
