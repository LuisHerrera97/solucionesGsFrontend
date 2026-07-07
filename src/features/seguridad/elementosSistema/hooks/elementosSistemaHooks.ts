import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BotonDto, Guid, ModuloDto, PaginaDto } from '../../types/types';
import {
  actualizarBoton,
  actualizarModulo,
  actualizarPagina,
  crearBoton,
  crearModulo,
  crearPagina,
  eliminarBoton,
  eliminarModulo,
  eliminarPagina,
  obtenerBotones,
  obtenerModulos,
  obtenerPaginas,
} from '../../api';

export const useModulosQuery = () => {
  return useQuery({
    queryKey: ['seguridad', 'modulos'],
    queryFn: obtenerModulos,
  });
};

export const usePaginasQuery = (params?: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ['seguridad', 'paginas', params?.page ?? '', params?.pageSize ?? ''],
    queryFn: () => obtenerPaginas(params),
  });
};

export const useBotonesQuery = (params?: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ['seguridad', 'botones', params?.page ?? '', params?.pageSize ?? ''],
    queryFn: () => obtenerBotones(params),
  });
};

export const useCrearModuloMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ModuloDto) => crearModulo(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'modulos'] });
    },
  });
};

export const useActualizarModuloMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Guid; payload: ModuloDto }) => actualizarModulo(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'modulos'] });
    },
  });
};

export const useEliminarModuloMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: Guid) => eliminarModulo(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'modulos'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'paginas'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'botones'] });
    },
  });
};

export const useCrearPaginaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PaginaDto) => crearPagina(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'paginas'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'modulos'] });
    },
  });
};

export const useActualizarPaginaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Guid; payload: PaginaDto }) => actualizarPagina(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'paginas'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'modulos'] });
    },
  });
};

export const useEliminarPaginaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: Guid) => eliminarPagina(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'paginas'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'botones'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'modulos'] });
    },
  });
};

export const useCrearBotonMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BotonDto) => crearBoton(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'botones'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'paginas'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'modulos'] });
    },
  });
};

export const useActualizarBotonMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Guid; payload: BotonDto }) => actualizarBoton(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'botones'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'paginas'] });
    },
  });
};

export const useEliminarBotonMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: Guid) => eliminarBoton(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'botones'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'paginas'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'modulos'] });
    },
  });
};
