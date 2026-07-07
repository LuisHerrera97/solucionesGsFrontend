import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/context/useAuth';
import {
  useClientesQuery,
  useClientesCreditosQuery,
} from './clientesHooks';
import type { Cliente } from '../../types/types';
import type { ClienteDraft } from '../components/ClienteModal';
import { useClientesSearch } from './useClientesSearch';
import { useClientesCrud } from './useClientesCrud';
import { useClientesActions } from './useClientesActions';

const PAGE_SIZE = 12;

const clienteADraft = (c: Cliente): ClienteDraft => ({
  id: c.id,
  nombre: c.nombre,
  apellido: c.apellido,
  direccion: c.direccion,
  negocio: c.negocio,
  zona: c.zona,
  estatus: c.estatus,
});

export const useClientesPage = () => {
  const navigate = useNavigate();
  const { user, canBoton } = useAuth();
  const puedeEditar = canBoton('CLIENTE_EDITAR') || canBoton('CLIENTE_CREAR');
  const puedeEliminar = canBoton('CLIENTE_ELIMINAR') || canBoton('CLIENTE_CREAR');
  const puedePagarFichasVigentesCliente = canBoton('CREDITO_PAGAR_FICHA') || canBoton('CREDITO_ABONAR_FICHA');

  const { searchTerm, setSearchTerm, page, setPage, zonaCtx, buscarApi } = useClientesSearch();
  
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  const clientesQuery = useClientesQuery({ page, pageSize: PAGE_SIZE, buscar: buscarApi, zonaId: zonaCtx.zonaIdParam });
  const creditosClienteQuery = useClientesCreditosQuery(clienteSeleccionado?.id);

  const {
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
    guardandoCliente,
  } = useClientesCrud(() => {
    clientesQuery.refetch();
  });

  const {
    ticketPagoFicha,
    setTicketPagoFicha,
    pagoFichaHook,
    handleImprimirTicket,
  } = useClientesActions(clienteSeleccionado, () => {
    creditosClienteQuery.refetch();
  });

  const clientes = useMemo(() => clientesQuery.data?.items ?? [], [clientesQuery.data?.items]);
  const totalCount = clientesQuery.data?.totalCount ?? 0;
  const maxPage = useMemo(() => Math.max(1, Math.ceil(totalCount / PAGE_SIZE) || 1), [totalCount]);
  const displayPage = Math.min(page, maxPage);
  const canGoNext = useMemo(() => displayPage * PAGE_SIZE < totalCount, [displayPage, totalCount]);

  useEffect(() => {
    if (clientesQuery.isLoading || clientesQuery.isError) return;
    if (totalCount === 0) {
      if (page !== 1) setPage(1);
      return;
    }
    if (page > maxPage) setPage(maxPage);
  }, [clientesQuery.isLoading, clientesQuery.isError, page, totalCount, maxPage, setPage]);

  const rangoDesde = totalCount === 0 ? 0 : (displayPage - 1) * PAGE_SIZE + 1;
  const rangoHasta = Math.min(displayPage * PAGE_SIZE, totalCount);

  return {
    navigate,
    user,
    puedeEditar,
    puedeEliminar,
    puedePagarFichasVigentesCliente,
    searchTerm,
    setSearchTerm,
    page: displayPage,
    setPage,
    zonaCtx,
    isModalOpen,
    setIsModalOpen,
    clienteDraft,
    setClienteDraft,
    clienteSeleccionado,
    setClienteSeleccionado,
    confirmDelete,
    setConfirmDelete,
    ticketPagoFicha,
    setTicketPagoFicha,
    clientesQuery,
    creditosClienteQuery,
    pagoFichaHook,
    zonasCobranza,
    abrirNuevoCliente,
    cerrarModal,
    handleGuardarCliente,
    handleEliminarCliente,
    handleImprimirTicket,
    clientes,
    totalCount,
    canGoNext,
    rangoDesde,
    rangoHasta,
    guardandoCliente,
    buscarApi,
    clienteADraft,
  };
};
