import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  useActualizarClienteMutation,
  useCrearClienteMutation,
  useEliminarClienteMutation,
} from './clientesHooks';
import { useZonasCobranzaQuery } from '../../../general/zonas/hooks/zonasHooks';
import type { Cliente } from '../../types/types';
import type { ClienteDraft } from '../components/ClienteModal';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';
import { EstatusCliente } from '../../../../shared/constants/dominio';

const clienteDraftVacio = (): ClienteDraft => ({
  nombre: '',
  apellido: '',
  direccion: '',
  negocio: '',
  zona: '',
  estatus: EstatusCliente.ACTIVO,
});

export const useClientesCrud = (onSuccess?: () => void) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteDraft, setClienteDraft] = useState<ClienteDraft>(clienteDraftVacio);
  const [confirmDelete, setConfirmDelete] = useState<Cliente | null>(null);

  const createMutation = useCrearClienteMutation();
  const updateMutation = useActualizarClienteMutation();
  const deleteMutation = useEliminarClienteMutation();
  const zonasCobranzaQuery = useZonasCobranzaQuery();

  const zonasCobranza = useMemo(() => {
    const zonas = zonasCobranzaQuery.data ?? [];
    return zonas
      .filter((z) => z.activo)
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .map((z) => z.nombre);
  }, [zonasCobranzaQuery.data]);

  const abrirNuevoCliente = () => {
    setClienteDraft(clienteDraftVacio());
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setClienteDraft(clienteDraftVacio());
  };

  const handleGuardarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !clienteDraft.nombre.trim() ||
      !clienteDraft.apellido.trim() ||
      !clienteDraft.direccion.trim() ||
      !clienteDraft.negocio.trim() ||
      !clienteDraft.zona.trim()
    ) {
      return;
    }
    const zonaTrim = clienteDraft.zona.trim();
    const zonaNormalizada = zonasCobranza.find((zona) => zona.toLowerCase() === zonaTrim.toLowerCase());
    if (zonasCobranza.length > 0 && !zonaNormalizada) {
      toast.error('Selecciona una zona válida');
      return;
    }

    const payload: Omit<Cliente, 'id'> = {
      nombre: clienteDraft.nombre.trim(),
      apellido: clienteDraft.apellido.trim(),
      direccion: clienteDraft.direccion.trim(),
      negocio: clienteDraft.negocio.trim(),
      zona: zonaNormalizada ?? zonaTrim,
      estatus: clienteDraft.estatus,
    };

    try {
      if (clienteDraft.id) {
        await updateMutation.mutateAsync({ id: clienteDraft.id, payload });
        toast.success('Cliente actualizado');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Cliente creado');
      }
      cerrarModal();
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, clienteDraft.id ? 'No fue posible actualizar el cliente' : 'No fue posible crear el cliente'));
    }
  };

  const handleEliminarCliente = async () => {
    if (!confirmDelete) return;
    try {
      await deleteMutation.mutateAsync(confirmDelete.id);
      toast.success('Cliente eliminado');
      setConfirmDelete(null);
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible eliminar el cliente'));
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    clienteDraft,
    setClienteDraft,
    confirmDelete,
    setConfirmDelete,
    zonasCobranza,
    abrirNuevoCliente,
    cerrarModal,
    handleGuardarCliente,
    handleEliminarCliente,
    guardandoCliente: createMutation.isPending || updateMutation.isPending,
  };
};
