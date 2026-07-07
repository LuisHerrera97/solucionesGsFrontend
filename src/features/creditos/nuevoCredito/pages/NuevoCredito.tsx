import { ConfirmarNuevoCreditoModal } from '../components/ConfirmarNuevoCreditoModal';
import { NuevoCreditoForm } from '../components/NuevoCreditoForm';
import { NuevoCreditoResumen } from '../components/NuevoCreditoResumen';
import { useNuevoCreditoPage } from '../hooks/useNuevoCreditoPage';

const NUEVO_CREDITO_FORM_ID = 'nuevo-credito-form';

const NuevoCredito = () => {
  const {
    navigate,
    canCrear,
    clienteId,
    setClienteId,
    clienteNombre,
    setClienteNombre,
    monto,
    setMonto,
    plazo,
    setPlazo,
    tipo,
    setTipo,
    permitirDomingoValue,
    setPermitirDomingo,
    aplicarFeriadosValue,
    setAplicarFeriados,
    tasaManual,
    setTasaManual,
    observacion,
    setObservacion,
    confirmarOpen,
    setConfirmarOpen,
    crearMutation,
    tasaDefault,
    tasa,
    interesTotal,
    total,
    cuota,
    ejecutarCreacion,
    handleSubmit,
  } = useNuevoCreditoPage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nuevo Crédito</h1>
          <p className="text-sm text-textMuted">
            Registra un nuevo crédito para un cliente existente.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
        <NuevoCreditoForm
          formId={NUEVO_CREDITO_FORM_ID}
          selectedClienteId={clienteId}
          monto={monto}
          plazo={plazo}
          tipo={tipo}
          permitirDomingo={permitirDomingoValue}
          aplicarFeriados={aplicarFeriadosValue}
          onChangeClienteId={setClienteId}
          onClienteEtiqueta={setClienteNombre}
          onChangeMonto={setMonto}
          onChangePlazo={setPlazo}
          onChangeTipo={setTipo}
          onChangePermitirDomingo={(v: boolean) => setPermitirDomingo(v)}
          onChangeAplicarFeriados={(v: boolean) => setAplicarFeriados(v)}
          onSubmit={handleSubmit}
          submitting={crearMutation.isPending}
          tasaManual={tasaManual}
          tasaDefault={tasaDefault}
          observacion={observacion}
          onChangeTasaManual={setTasaManual}
          onChangeObservacion={setObservacion}
        />

        <div className="flex flex-col gap-4">
          <NuevoCreditoResumen tipo={tipo} monto={monto} tasa={tasa} interesTotal={interesTotal} total={total} cuota={cuota} />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/creditos')} className="btn btn-light">
              Cancelar
            </button>
            <button
              type="submit"
              form={NUEVO_CREDITO_FORM_ID}
              className="btn btn-primary"
              disabled={!canCrear || crearMutation.isPending || !clienteId}
            >
              {crearMutation.isPending ? 'Creando...' : 'Crear Crédito'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmarNuevoCreditoModal
        open={confirmarOpen}
        clienteNombre={clienteNombre}
        tipo={tipo}
        monto={monto}
        plazo={plazo}
        tasa={tasa}
        interesTotal={interesTotal}
        total={total}
        cuota={cuota}
        saving={crearMutation.isPending}
        onClose={() => setConfirmarOpen(false)}
        onConfirm={ejecutarCreacion}
      />
    </div>
  );
};

export default NuevoCredito;
