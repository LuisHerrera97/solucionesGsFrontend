import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Guid, UsuarioCrearDto, UsuarioDto } from '../../types/types';
import { actualizarUsuario, crearUsuario, eliminarUsuario, obtenerUsuarios } from '../../api';

export const useUsuariosQuery = () => {
  return useQuery({
    queryKey: ['seguridad', 'usuarios'],
    queryFn: obtenerUsuarios,
  });
};

export const useCrearUsuarioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UsuarioCrearDto) => crearUsuario(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'usuarios'] });
    },
  });
};

export const useActualizarUsuarioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Guid; payload: UsuarioDto }) => actualizarUsuario(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'usuarios'] });
    },
  });
};

export const useEliminarUsuarioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: Guid) => eliminarUsuario(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'usuarios'] });
    },
  });
};
