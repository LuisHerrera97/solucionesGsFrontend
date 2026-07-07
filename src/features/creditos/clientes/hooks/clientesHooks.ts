import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Cliente } from '../../types/types';
import {
  actualizarCliente,
  crearCliente,
  eliminarCliente,
  obtenerClientes,
  obtenerCreditosDeCliente,
} from '../../api';

export const useClientesQuery = (params?: { page?: number; pageSize?: number; buscar?: string; zonaId?: string }) => {
  return useQuery({
    queryKey: ['creditos', 'clientes', params?.page ?? '', params?.pageSize ?? '', params?.buscar ?? '', params?.zonaId ?? ''],
    queryFn: () => obtenerClientes(params),
  });
};

export const useCrearClienteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Cliente, 'id'>) => crearCliente(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'clientes'] });
    },
  });
};

export const useActualizarClienteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; payload: Omit<Cliente, 'id'> }) => actualizarCliente(args.id, args.payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'clientes'] });
    },
  });
};

export const useEliminarClienteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eliminarCliente(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'clientes'] });
    },
  });
};

export const useClientesCreditosQuery = (clienteId?: string) => {
  return useQuery({
    queryKey: ['creditos', 'clientes', clienteId, 'creditos'],
    queryFn: () => obtenerCreditosDeCliente(clienteId as string),
    enabled: Boolean(clienteId),
  });
};
