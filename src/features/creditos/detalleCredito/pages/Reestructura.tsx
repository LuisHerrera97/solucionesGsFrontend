import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog';
import StatusPanel from '../../../../shared/components/StatusPanel';
import { ReestructuraForm } from '../components/ReestructuraForm';
import { ReestructuraInfoCards } from '../components/ReestructuraInfoCards';
import { useReestructuraPage } from '../hooks/useReestructuraPage';

const Reestructura = () => {
  const {
    navigate,
    creditoQuery,
    credito,
    montoExtra,
    setMontoExtra,
    nuevoPlazo,
    setNuevoPlazo,
    confirmOpen,
    setConfirmOpen,
    reestructuraMutation,
    saldoPendiente,
    confirmMessage,
    handleSubmitIntent,
    aplicarReestructura,
  } = useReestructuraPage();

  if (creditoQuery.isLoading) {
    return <StatusPanel variant="loading" title="Cargando crédito" message="Consultando el servidor..." />;
  }

  if (creditoQuery.isError || !credito) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Crédito no encontrado</h1>
        <button className="btn btn-primary" onClick={() => navigate('/creditos')}>
          Volver a créditos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reestructura de crédito</h1>
          <p className="text-sm text-textMuted">
            Se toma el saldo pendiente (después de los abonos ya aplicados), se puede agregar monto extra y se genera un nuevo crédito con nuevo plazo.
          </p>
        </div>
        <button className="btn btn-light" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>

      <ReestructuraInfoCards credito={credito} saldoPendiente={saldoPendiente} />
      <ReestructuraForm
        saldoPendiente={saldoPendiente}
        montoExtra={montoExtra}
        plazo={nuevoPlazo}
        plazoFallback={credito.totalFichas}
        onChangeMontoExtra={setMontoExtra}
        onChangePlazo={setNuevoPlazo}
        onCancel={() => navigate(-1)}
        onSubmit={handleSubmitIntent}
        submitting={reestructuraMutation.isPending}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirmar reestructura"
        message={confirmMessage}
        confirmLabel="Sí, reestructurar"
        cancelLabel="Cancelar"
        type="warning"
        loading={reestructuraMutation.isPending}
        onConfirm={() => void aplicarReestructura()}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default Reestructura;
