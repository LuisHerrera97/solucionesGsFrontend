import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearCredito } from '../../api';

export const useCrearCreditoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      clienteId: string;
      monto: number;
      plazo: number;
      tipo: 'diario' | 'semanal' | 'mensual';
      permitirDomingo?: boolean;
      aplicarFeriados?: boolean;
      tasaManual?: number;
      observacion?: string;
    }) => crearCredito(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'reportes'] });
    },
  });
};
