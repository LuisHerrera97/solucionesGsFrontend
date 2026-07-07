import { ModalShell } from '../components/ModalShell';
import StatusPanel from '../components/StatusPanel';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { numberInputDisplay, parseNumberInput, asNumber } from '../utils/numberInput';
import { formatCalendarDateFromApi } from '../date/calendarDate';
import type { usePagoFicha } from './usePagoFicha';
import { MedioPago } from '../constants/dominio';

type PagoFichaModalProps = {
  pagoHook: ReturnType<typeof usePagoFicha>;
  titleId?: string;
};

export const PagoFichaModal = ({ pagoHook, titleId = 'pago-ficha-modal-titulo' }: PagoFichaModalProps) => {
  const {
    creditoPagoSeleccionado,
    tipoPago,
    medioPago,
    montoEfectivo,
    setMontoEfectivo,
    montoTransferencia,
    setMontoTransferencia,
    creditoPagoDetalleQuery,
    fichaObjetivo,
    montoPagoCalculado,
    vigentesPendientes,
    requiereConfirmacionAtrasada,
    puedeConfirmarPago,
    seleccionarMedioPago,
    cerrarModalPagoFicha,
    confirmarCobroAtrasadaConVigentes,
    cancelarCobroAtrasada,
    handlePagarFicha,
    isPending,
  } = pagoHook;

  if (!creditoPagoSeleccionado || !tipoPago) return null;

  const tituloTipo = tipoPago === 'vigente' ? 'vigente' : 'atrasada';
  const titulo = fichaObjetivo
    ? `Pagar ficha ${tituloTipo} #${fichaObjetivo.num}`
    : `Pagar ficha ${tituloTipo}`;

  return (
    <>
      <ConfirmDialog
        isOpen={requiereConfirmacionAtrasada}
        title="Cobro de ficha atrasada"
        message={`Este crédito aún tiene ${vigentesPendientes.length} ficha(s) vigente(s) pendiente(s). Estás cobrando la ficha atrasada #${fichaObjetivo?.num ?? '—'} por excepción operativa.`}
        type="warning"
        confirmLabel="Confirmar cobro atrasado"
        cancelLabel="Cancelar"
        onConfirm={confirmarCobroAtrasadaConVigentes}
        onCancel={cancelarCobroAtrasada}
      />

      <ModalShell
        open
        onClose={cerrarModalPagoFicha}
        title={titulo}
        subtitle={creditoPagoSeleccionado.folio}
        maxWidthClassName="max-w-md"
        titleId={titleId}
      >
        <div className="space-y-4">
          {creditoPagoDetalleQuery.isLoading && (
            <StatusPanel variant="loading" title="Cargando crédito" message="Obteniendo información de la ficha..." />
          )}
          {creditoPagoDetalleQuery.isError && (
            <StatusPanel variant="error" title="No fue posible cargar el crédito" message="Intenta nuevamente." />
          )}

          {!creditoPagoDetalleQuery.isLoading && !creditoPagoDetalleQuery.isError && !fichaObjetivo && (
            <StatusPanel
              variant="empty"
              title={`Sin fichas ${tituloTipo}s pendientes`}
              message={`No hay fichas ${tituloTipo}s por cobrar en este crédito.`}
            />
          )}

          {!creditoPagoDetalleQuery.isLoading && !creditoPagoDetalleQuery.isError && fichaObjetivo && !requiereConfirmacionAtrasada && (
            <>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-sm text-textMuted">
                <p>
                  Vencimiento:{' '}
                  <span className="font-semibold text-textDark">{formatCalendarDateFromApi(fichaObjetivo.fecha)}</span>
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Saldo a pagar (informativo)</p>
                <p className="text-2xl font-bold text-textDark">${montoPagoCalculado.toLocaleString()}</p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-textDark">Medio de pago</label>
                <div className="grid grid-cols-3 gap-2">
                  {([MedioPago.EFECTIVO, MedioPago.TRANSFERENCIA, MedioPago.MIXTO] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`btn py-2 text-sm font-semibold transition-all ${
                        medioPago === m
                          ? 'bg-primaryBlue text-white shadow-md shadow-primaryBlue/20'
                          : 'bg-white border border-gray-200 text-textMuted hover:bg-gray-50'
                      }`}
                      onClick={() => seleccionarMedioPago(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {medioPago === MedioPago.MIXTO && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-textMuted">Efectivo</label>
                      <input
                        type="number"
                        className="form-input py-2 text-sm"
                        value={numberInputDisplay(montoEfectivo)}
                        onChange={(e) => setMontoEfectivo(parseNumberInput(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-textMuted">Transferencia</label>
                      <input
                        type="number"
                        className="form-input py-2 text-sm"
                        value={numberInputDisplay(montoTransferencia)}
                        onChange={(e) => setMontoTransferencia(parseNumberInput(e.target.value))}
                      />
                    </div>
                    <p
                      className={`col-span-2 text-[10px] text-center font-bold uppercase tracking-widest ${
                        Math.abs(asNumber(montoEfectivo) + asNumber(montoTransferencia) - montoPagoCalculado) <= 0.01
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      Total mixto: ${(asNumber(montoEfectivo) + asNumber(montoTransferencia)).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  className="btn btn-primary w-full py-3 text-base font-bold shadow-lg shadow-primaryBlue/20"
                  disabled={!puedeConfirmarPago || isPending}
                  onClick={handlePagarFicha}
                >
                  {isPending ? 'Registrando...' : 'Confirmar pago'}
                </button>
              </div>
            </>
          )}
        </div>
      </ModalShell>
    </>
  );
};
