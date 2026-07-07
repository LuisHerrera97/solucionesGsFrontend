import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ConfiguracionSistemaDto } from '../../types/types';
import { actualizarConfiguracion, obtenerConfiguracion } from '../../api';

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
