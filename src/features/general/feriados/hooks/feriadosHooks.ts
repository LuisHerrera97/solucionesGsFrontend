import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Guid } from '../../types/types';
import type { FeriadoDto } from '../../types/feriados';
import { actualizarFeriado, crearFeriado, eliminarFeriado, obtenerFeriados } from '../../api';

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
    mutationFn: ({ id, payload }: { id: Guid; payload: Pick<FeriadoDto, 'fecha' | 'nombre' | 'activo'> }) =>
      actualizarFeriado(id, payload),
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
