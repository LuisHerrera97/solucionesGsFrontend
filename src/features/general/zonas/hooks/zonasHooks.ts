import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Guid, ZonaCobranzaDto } from '../../types/types';
import { actualizarZona, crearZona, eliminarZona, obtenerZonas } from '../../api';

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
