import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Guid, PerfilDto } from '../../types/types';
import { actualizarPerfil, crearPerfil, eliminarPerfil, obtenerPerfiles } from '../../api';

export const usePerfilesQuery = () => {
  return useQuery({
    queryKey: ['seguridad', 'perfiles'],
    queryFn: obtenerPerfiles,
  });
};

export const useCrearPerfilMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PerfilDto) => crearPerfil(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'perfiles'] });
    },
  });
};

export const useActualizarPerfilMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Guid; payload: PerfilDto }) => actualizarPerfil(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'perfiles'] });
    },
  });
};

export const useEliminarPerfilMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: Guid) => eliminarPerfil(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'perfiles'] });
    },
  });
};
