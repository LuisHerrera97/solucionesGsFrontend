import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AsignarPermisosRequestDto, Guid } from '../../types/types';
import { guardarPermisos, obtenerMenu } from '../../api';

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
