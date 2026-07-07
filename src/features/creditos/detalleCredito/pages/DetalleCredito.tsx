import StatusPanel from '../../../../shared/components/StatusPanel';
import { CreditoInfoCards } from '../components/CreditoInfoCards';
import { FichasEstadoCuenta } from '../components/FichasEstadoCuenta';
import { HistorialPagos } from '../components/HistorialPagos';
import { PagoCuotaModal } from '../components/PagoCuotaModal';
import { PenalizacionModal } from '../components/PenalizacionModal';
import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog';
import { DetalleCreditoProvider } from '../context/DetalleCreditoContext';
import { useDetalleCreditoContext } from '../hooks/useDetalleCreditoContext';

const DetalleCreditoContent = () => {
  const {
    navigate,
    canBoton,
    creditoQuery,
    ticketModal,
    setTicketModal,
    confirmDialog,
    setConfirmDialog,
    credito,
    fichas,
    handlePrintTicket,
  } = useDetalleCreditoContext();

  if (creditoQuery.isLoading) {
    return <StatusPanel variant="loading" title="Cargando crédito" message="Consultando el servidor..." />;
  }

  if (creditoQuery.isError || !credito) {
    return (
      <div className="space-y-6">
        <StatusPanel variant="error" title="No fue posible cargar el crédito" message="Intenta nuevamente." />
        <button className="btn btn-primary" onClick={() => navigate('/creditos')}>
          Volver a créditos
        </button>
      </div>
    );
  }

  const cuotasPagadas = fichas.filter((f) => f.pagada).length;
  const cuotasTotales = fichas.length;
  const saldoPendiente = (credito.total ?? 0) - (credito.pagado ?? 0);
  const interesTotalPendiente = fichas
    .filter((f) => !f.pagada)
    .reduce((acc, f) => acc + (f.interes ?? 0), 0);
  const hayInteresPorCondonar = interesTotalPendiente > 0;
  const creditoVigente = credito.estatus === 'Activo';
  const canReestructurar = canBoton('CREDITO_REESTRUCTURAR') && creditoVigente;
  const canCondonarInteres = canBoton('CREDITO_CONDONAR_INTERES');

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Detalle del Crédito</h1>
          <p className="text-sm text-textMuted font-medium flex items-center gap-2 mt-1">
            Folio: <span className="text-primaryBlue font-bold">{credito.folio}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            Cliente: <span className="text-slate-600">{credito.clienteNombre} {credito.clienteApellido}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-light" onClick={() => navigate('/creditos')}>
            Volver
          </button>
          <button type="button" className="btn btn-light" onClick={() => navigate(`/creditos/${credito.id}/estado-cuenta`)}>
            Estado de cuenta
          </button>
          {hayInteresPorCondonar && canCondonarInteres && (
            <button type="button" className="btn btn-light" onClick={() => navigate(`/creditos/${credito.id}/condonacion`)}>
              Condonar interés
            </button>
          )}
          {canReestructurar && (
            <button type="button" className="btn btn-light" onClick={() => navigate(`/creditos/${credito.id}/reestructura`)}>
              Reestructurar
            </button>
          )}
        </div>
      </div>

      <CreditoInfoCards
        credito={credito}
        cuotasPagadas={cuotasPagadas}
        cuotasTotales={cuotasTotales}
        saldoPendiente={saldoPendiente}
      />

      <FichasEstadoCuenta fichas={fichas} />

      <HistorialPagos creditoId={credito.id} />

      <PagoCuotaModal />
      <PenalizacionModal />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      <ConfirmDialog
        isOpen={Boolean(ticketModal)}
        title="Operación exitosa"
        message={`Se ha registrado el movimiento correctamente. ¿Deseas imprimir el ticket?`}
        type="success"
        confirmLabel="Imprimir ticket"
        cancelLabel="Cerrar"
        onConfirm={handlePrintTicket}
        onCancel={() => setTicketModal(null)}
      />
    </div>
  );
};

const DetalleCredito = () => (
  <DetalleCreditoProvider>
    <DetalleCreditoContent />
  </DetalleCreditoProvider>
);

export default DetalleCredito;
