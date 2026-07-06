import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ConfiguracionSistemaDto, Guid, ZonaCobranzaDto } from '../types/types';
import type { FeriadoDto } from '../types/feriados';
import {
  obtenerConfiguracion,
  actualizarConfiguracion,
  obtenerZonas,
  crearZona,
  actualizarZona,
  eliminarZona,
  obtenerAuditoria,
  obtenerAuditoriaFiltrosOpciones,
  obtenerFeriados,
  crearFeriado,
  actualizarFeriado,
  eliminarFeriado,
} from '../api';

export const useConfiguracionSistemaQuery = () => {
  return useQuery({
    queryKey: ['general', 'configuracion'],
    queryFn: obtenerConfiguracion,
  });
};

export const useActualizarConfiguracionSistemaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConfiguracionSistemaDto) => actualizarConfiguracion(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['general', 'configuracion'] });
    },
  });
};

export const useZonasCobranzaQuery = () => {
  return useQuery({
    queryKey: ['general', 'zonas'],
    queryFn: obtenerZonas,
  });
};

export const useCrearZonaCobranzaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Pick<ZonaCobranzaDto, 'nombre' | 'orden'>) => crearZona(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['general', 'zonas'] });
    },
  });
};

export const useActualizarZonaCobranzaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Guid; payload: ZonaCobranzaDto }) => actualizarZona(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['general', 'zonas'] });
    },
  });
};

export const useEliminarZonaCobranzaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: Guid) => eliminarZona(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['general', 'zonas'] });
    },
  });
};

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

export const useFeriadosQuery = () => {
  return useQuery({
    queryKey: ['general', 'feriados'],
    queryFn: obtenerFeriados,
  });
};

export const useCrearFeriadoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Pick<FeriadoDto, 'fecha' | 'nombre' | 'activo'>) => crearFeriado(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['general', 'feriados'] });
    },
  });
};

export const useActualizarFeriadoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Guid; payload: Pick<FeriadoDto, 'fecha' | 'nombre' | 'activo'> }) => actualizarFeriado(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['general', 'feriados'] });
    },
  });
};

export const useEliminarFeriadoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: Guid) => eliminarFeriado(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['general', 'feriados'] });
    },
  });
};
