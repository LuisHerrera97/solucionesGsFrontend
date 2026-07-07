import { ArrowRightLeft, Banknote, CreditCard, X } from 'lucide-react';
import { asNumber, numberInputDisplay, parseNumberInput } from '../../../../shared/utils/numberInput';
import { useDetalleCreditoContext } from '../hooks/useDetalleCreditoContext';
import { MedioPago } from '../../../../shared/constants/dominio';

export const PagoCuotaModal = () => {
  const {
    modalPago,
    setModalPago,
    modalType,
    monto,
    setMonto,
    medioPago,
    setMedioPago,
    montoEfectivo,
    setMontoEfectivo,
    montoTransferencia,
    setMontoTransferencia,
    savingFicha,
    handleRegistrarPago,
  } = useDetalleCreditoContext();

  if (!modalPago || (modalType !== 'pago' && modalType !== 'abono')) return null;

  const esPagoCompleto = modalType === 'pago';
  const saldoInformativo = modalPago.pendiente;
  const montoN = asNumber(monto);
  const efN = asNumber(montoEfectivo);
  const trN = asNumber(montoTransferencia);

  const montoReferenciaMixto = esPagoCompleto ? saldoInformativo : montoN;
  const isCajaValid =
    medioPago !== MedioPago.MIXTO || Math.abs(efN + trN - montoReferenciaMixto) <= 0.01;

  const abonoValido = montoN > 0 && montoN < saldoInformativo - 0.001;
  const abonoExcedeSaldo = !esPagoCompleto && montoN >= saldoInformativo - 0.001 && montoN > 0;
  const abonoSinMonto = !esPagoCompleto && montoN <= 0;

  const canConfirm = esPagoCompleto
    ? saldoInformativo > 0 && isCajaValid && !savingFicha
    : abonoValido && isCajaValid && !savingFicha;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full max-w-[400px] overflow-hidden border border-gray-100/50 animate-in zoom-in-95 slide-in-from-bottom-2 duration-500 my-auto">
        <div className="relative pt-8 px-8 pb-4">
          <button
            onClick={() => setModalPago(null)}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-all hover:rotate-90 active:scale-90"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
              {esPagoCompleto ? 'Pago de ficha' : 'Abono a ficha'}
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ficha #{modalPago.numFicha}</h2>
          </div>
        </div>

        <div className="px-8 pb-8 space-y-5">
          <div
            className={`p-5 rounded-2xl border flex flex-col items-center text-center transition-colors ${
              abonoExcedeSaldo ? 'bg-rose-50 border-rose-200' : 'bg-blue-50/50 border-blue-100'
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${
                abonoExcedeSaldo ? 'text-rose-500' : 'text-blue-400'
              }`}
            >
              {esPagoCompleto ? 'Saldo a pagar (informativo)' : 'Monto del adelanto'}
            </span>
            {esPagoCompleto ? (
              <p className="text-4xl font-black font-mono tracking-tighter text-blue-700">
                ${saldoInformativo.toLocaleString()}
              </p>
            ) : (
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-black font-mono ${abonoExcedeSaldo ? 'text-rose-400' : 'text-blue-400'}`}>
                  $
                </span>
                <input
                  type="number"
                  className={`bg-transparent text-4xl font-black font-mono tracking-tighter w-full text-center outline-none border-b-2 transition-colors ${
                    abonoExcedeSaldo
                      ? 'text-rose-700 border-rose-200 focus:border-rose-500'
                      : 'text-blue-700 border-blue-200 focus:border-blue-500'
                  }`}
                  value={numberInputDisplay(monto)}
                  onChange={(e) => setMonto(parseNumberInput(e.target.value))}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            )}
            {esPagoCompleto ? (
              <span className="text-[9px] font-black uppercase mt-2 tracking-widest text-blue-400/60">
                El cobro se registrará por el saldo real de la ficha
              </span>
            ) : (
              <span
                className={`text-[9px] font-black uppercase mt-2 tracking-widest ${
                  abonoExcedeSaldo ? 'text-rose-500 animate-bounce' : 'text-blue-400/60'
                }`}
              >
                {abonoExcedeSaldo
                  ? 'Use Pagar Ficha para liquidar el saldo completo'
                  : abonoSinMonto
                    ? `Saldo pendiente: $${saldoInformativo.toLocaleString()}`
                    : `Debe ser menor a $${saldoInformativo.toLocaleString()}`}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-px bg-slate-100 flex-1" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Forma de pago</span>
              <div className="h-px bg-slate-100 flex-1" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {([MedioPago.EFECTIVO, MedioPago.TRANSFERENCIA, MedioPago.MIXTO] as const).map((m) => {
                const isActive = medioPago === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMedioPago(m);
                      if (m === MedioPago.MIXTO) {
                        if (esPagoCompleto) {
                          setMontoEfectivo(saldoInformativo);
                          setMontoTransferencia(0);
                        } else if (montoN > 0) {
                          setMontoEfectivo(montoN);
                          setMontoTransferencia(0);
                        }
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 ${
                      isActive
                        ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105'
                        : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200 hover:bg-white active:scale-95'
                    }`}
                  >
                    {m === MedioPago.EFECTIVO && <Banknote size={18} />}
                    {m === MedioPago.TRANSFERENCIA && <ArrowRightLeft size={18} />}
                    {m === MedioPago.MIXTO && <CreditCard size={18} />}
                    <span className="text-[9px] font-black uppercase mt-1.5 tracking-tighter">{m}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {medioPago === MedioPago.MIXTO && (
            <div className="p-5 bg-blue-50/30 rounded-2xl border border-dashed border-blue-200 animate-in zoom-in-95 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-blue-600/50 uppercase text-center block tracking-widest">
                    Efectivo
                  </span>
                  <input
                    type="number"
                    className="w-full text-center font-black text-sm bg-white rounded-xl py-2.5 border border-blue-100 focus:border-blue-500 outline-none text-blue-900"
                    value={numberInputDisplay(montoEfectivo)}
                    onChange={(e) => setMontoEfectivo(parseNumberInput(e.target.value))}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-blue-600/50 uppercase text-center block tracking-widest">
                    Transferencia
                  </span>
                  <input
                    type="number"
                    className="w-full text-center font-black text-sm bg-white rounded-xl py-2.5 border border-blue-100 focus:border-blue-500 outline-none text-blue-900"
                    value={numberInputDisplay(montoTransferencia)}
                    onChange={(e) => setMontoTransferencia(parseNumberInput(e.target.value))}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              </div>
              <div
                className={`mt-3 text-[10px] text-center font-black uppercase tracking-widest transition-colors ${
                  isCajaValid ? 'text-emerald-600' : 'text-rose-600 animate-pulse'
                }`}
              >
                {isCajaValid
                  ? `Validado: $${(efN + trN).toLocaleString()}`
                  : `Diferencia: $${(montoReferenciaMixto - (efN + trN)).toLocaleString()}`}
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-8 pt-6">
          <button
            type="button"
            className="w-full py-4 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 disabled:opacity-30 active:scale-[0.98] group relative overflow-hidden"
            disabled={!canConfirm}
            onClick={handleRegistrarPago}
          >
            <span className="relative z-10">
              {savingFicha ? 'Procesando...' : esPagoCompleto ? 'Confirmar pago' : 'Confirmar abono'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>

          <button
            type="button"
            className="w-full py-1 mt-3 text-[10px] font-black text-slate-300 hover:text-slate-500 transition-colors uppercase tracking-[0.3em]"
            onClick={() => setModalPago(null)}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
