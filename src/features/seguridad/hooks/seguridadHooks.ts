import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AsignarPermisosRequestDto, BotonDto, Guid, ModuloDto, PaginaDto, PerfilDto, UsuarioDto, UsuarioCrearDto } from '../types/types';
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerPerfiles,
  crearPerfil,
  actualizarPerfil,
  eliminarPerfil,
  obtenerMenu,
  guardarPermisos,
  obtenerModulos,
  obtenerPaginas,
  obtenerBotones,
  crearModulo,
  actualizarModulo,
  eliminarModulo,
  crearPagina,
  actualizarPagina,
  eliminarPagina,
  crearBoton,
  actualizarBoton,
  eliminarBoton
} from '../api';

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

export const useMenuPerfilQuery = (idPerfil?: Guid | '') => {
  return useQuery({
    queryKey: ['seguridad', 'perfiles', idPerfil ?? '', 'menu'],
    queryFn: () => obtenerMenu(idPerfil as Guid),
    enabled: Boolean(idPerfil),
  });
};

export const useSetPermisosMutation = (perfilId: Guid) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AsignarPermisosRequestDto) => guardarPermisos(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'perfiles', perfilId, 'menu'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'perfiles', perfilId, 'permisos'] });
    },
  });
};

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
