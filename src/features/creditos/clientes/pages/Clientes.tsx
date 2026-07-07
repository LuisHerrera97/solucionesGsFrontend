import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog';
import StatusPanel from '../../../../shared/components/StatusPanel';
import { ClienteCard } from '../components/ClienteCard';
import { ClienteModal } from '../components/ClienteModal';
import { ClientesHeader } from '../components/ClientesHeader';
import { ClientesSearchBar } from '../components/ClientesSearchBar';
import { CobranzaZonaFiltroPanel } from '../../../../shared/cobranza/CobranzaZonaFiltroPanel';
import { useClientesPage } from '../hooks/useClientesPage';
import { ClienteDetalleModal } from '../components/ClienteDetalleModal';
import { PagoFichaModal } from '../../../../shared/creditos/PagoFichaModal';

const Clientes = () => {
  const {
    user,
    puedeEditar,
    puedeEliminar,
    puedePagarFichasVigentesCliente,
    searchTerm,
    setSearchTerm,
    page,
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
    clienteADraft,
    guardandoCliente,
    buscarApi,
  } = useClientesPage();

  return (
    <div className="space-y-6">
      <ClientesHeader onNuevo={abrirNuevoCliente} />

      <ClientesSearchBar value={searchTerm} onChange={setSearchTerm} />

      <CobranzaZonaFiltroPanel
        user={user}
        puedeElegirZona={zonaCtx.puedeElegirZona}
        zonas={zonaCtx.zonas}
        zonasLoading={zonaCtx.zonasLoading}
        zonaFiltro={zonaCtx.zonaFiltro}
        onChangeZona={zonaCtx.setZonaFiltro}
        esZonaDelUsuario={zonaCtx.esZonaDelUsuario}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="text-sm text-textMuted">
          {clientesQuery.isLoading ? (
            <>Cargando…</>
          ) : totalCount > 0 ? (
            <>
              Mostrando <span className="font-semibold text-textDark">{rangoDesde}</span>–
              <span className="font-semibold text-textDark">{rangoHasta}</span> de{' '}
              <span className="font-semibold text-textDark">{totalCount}</span>
              <span className="mx-2 text-gray-300">·</span>
              Página <span className="font-semibold text-textDark">{page}</span>
            </>
          ) : (
            <>Sin resultados</>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-light" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || clientesQuery.isLoading}>
            Anterior
          </button>
          <button type="button" className="btn btn-light" onClick={() => setPage((p) => p + 1)} disabled={!canGoNext || clientesQuery.isLoading}>
            Siguiente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clientesQuery.isLoading && <StatusPanel variant="loading" title="Cargando clientes" message="Consultando el servidor..." />}
        {clientesQuery.isError && <StatusPanel variant="error" title="No fue posible cargar clientes" message="Intenta nuevamente." />}
        {clientes.map((cliente) => (
          <div key={cliente.id} className="space-y-2">
            <ClienteCard
              cliente={cliente}
              puedeEditar={puedeEditar}
              puedeEliminar={puedeEliminar}
              onEditar={() => {
                setClienteDraft(clienteADraft(cliente));
                setIsModalOpen(true);
              }}
              onEliminar={() => setConfirmDelete(cliente)}
            />
            <button type="button" className="btn btn-light w-full" onClick={() => setClienteSeleccionado(cliente)}>
              Ver créditos
            </button>
          </div>
        ))}
        {!clientesQuery.isLoading && !clientesQuery.isError && clientes.length === 0 && (
          <StatusPanel
            variant="empty"
            title={buscarApi ? 'Sin coincidencias' : 'Sin clientes'}
            message={buscarApi ? 'Prueba con otro término de búsqueda.' : 'Crea tu primer cliente para empezar.'}
          />
        )}
      </div>

      <ClienteDetalleModal
        cliente={clienteSeleccionado}
        onClose={() => setClienteSeleccionado(null)}
        creditosQuery={creditosClienteQuery}
        puedePagarFichas={puedePagarFichasVigentesCliente}
        onPagarFichaVigente={(creditoId, folio) => pagoFichaHook.abrirModalPagoFicha(creditoId, folio, 'vigente')}
        onPagarFichaAtrasada={(creditoId, folio) => pagoFichaHook.abrirModalPagoFicha(creditoId, folio, 'atrasada')}
      />

      <ClienteModal
        open={isModalOpen}
        value={clienteDraft}
        saving={guardandoCliente}
        zonas={zonasCobranza}
        zonasLoading={false} // Ya cargadas en el hook
        onChange={setClienteDraft}
        onClose={cerrarModal}
        onSubmit={handleGuardarCliente}
      />

      <ConfirmDialog
        isOpen={Boolean(confirmDelete)}
        title="Eliminar cliente"
        message={`¿Estás seguro de eliminar a ${confirmDelete?.nombre} ${confirmDelete?.apellido}? Esta acción no se puede deshacer.`}
        type="danger"
        onConfirm={handleEliminarCliente}
        onCancel={() => setConfirmDelete(null)}
      />

      <PagoFichaModal pagoHook={pagoFichaHook} titleId="clientes-pago-ficha-modal-titulo" />

      <ConfirmDialog
        isOpen={Boolean(ticketPagoFicha)}
        title="Pago registrado"
        message={`Se ha registrado el pago de la ficha #${ticketPagoFicha?.numeroFicha} por $${ticketPagoFicha?.total.toLocaleString()}. ¿Deseas imprimir el ticket?`}
        type="success"
        confirmLabel="Imprimir ticket"
        cancelLabel="Cerrar"
        onConfirm={handleImprimirTicket}
        onCancel={() => setTicketPagoFicha(null)}
      />
    </div>
  );
};

export default Clientes;
