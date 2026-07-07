import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { asNumber, type NumberInputValue } from '../utils/numberInput';
import { useAbonarFichaCreditoMutation, useCreditoByIdQuery } from '../../features/creditos/creditos/hooks/creditosHooks';
import {
  fichasPendientesVigentes,
  primeraFichaPendienteAtrasada,
  primeraFichaPendienteVigente,
  saldoPendienteFicha,
} from './fichasPagoOrden';
import { getErrorMessage } from '../utils/getErrorMessage';
import { MedioPago, type MedioPago as MedioPagoType } from '../constants/dominio';
import type { Ficha } from '../../features/creditos/types/types';

export type TipoPagoFicha = 'vigente' | 'atrasada';

export type PagoFichaResult = {
  folio: string;
  numeroFicha: number;
  total: number;
  tipo: TipoPagoFicha;
};

export const usePagoFicha = (onSuccess?: (result: PagoFichaResult) => void) => {
  const [creditoPagoSeleccionado, setCreditoPagoSeleccionado] = useState<{ id: string; folio: string } | null>(null);
  const [tipoPago, setTipoPago] = useState<TipoPagoFicha | null>(null);
  const [confirmacionAtrasadaAceptada, setConfirmacionAtrasadaAceptada] = useState(false);
  const [medioPago, setMedioPago] = useState<MedioPagoType>(MedioPago.EFECTIVO);
  const [montoEfectivo, setMontoEfectivo] = useState<NumberInputValue>(0);
  const [montoTransferencia, setMontoTransferencia] = useState<NumberInputValue>(0);

  const creditoPagoDetalleQuery = useCreditoByIdQuery(creditoPagoSeleccionado?.id);
  const abonarFichaMutation = useAbonarFichaCreditoMutation();

  const fichas = useMemo(() => creditoPagoDetalleQuery.data?.fichas ?? [], [creditoPagoDetalleQuery.data?.fichas]);

  const fichaObjetivo = useMemo((): Ficha | undefined => {
    if (!tipoPago) return undefined;
    return tipoPago === 'vigente' ? primeraFichaPendienteVigente(fichas) : primeraFichaPendienteAtrasada(fichas);
  }, [fichas, tipoPago]);

  const montoPagoCalculado = fichaObjetivo ? saldoPendienteFicha(fichaObjetivo) : 0;
  const vigentesPendientes = useMemo(() => fichasPendientesVigentes(fichas), [fichas]);
  const hayVigentesPendientes = vigentesPendientes.length > 0;

  const requiereConfirmacionAtrasada =
    tipoPago === 'atrasada' && hayVigentesPendientes && !confirmacionAtrasadaAceptada && Boolean(fichaObjetivo);

  const totalMedioMixto = asNumber(montoEfectivo) + asNumber(montoTransferencia);
  const medioValido = medioPago !== MedioPago.MIXTO || Math.abs(totalMedioMixto - montoPagoCalculado) <= 0.01;

  const puedeConfirmarPago =
    Boolean(creditoPagoSeleccionado) &&
    Boolean(fichaObjetivo) &&
    !requiereConfirmacionAtrasada &&
    !abonarFichaMutation.isPending &&
    montoPagoCalculado > 0 &&
    medioValido;

  const resetMedioPago = () => {
    setMedioPago(MedioPago.EFECTIVO);
    setMontoEfectivo(0);
    setMontoTransferencia(0);
  };

  const abrirModalPagoFicha = (creditoId: string, folio: string, tipo: TipoPagoFicha) => {
    setCreditoPagoSeleccionado({ id: creditoId, folio });
    setTipoPago(tipo);
    setConfirmacionAtrasadaAceptada(tipo === 'vigente');
    resetMedioPago();
  };

  const seleccionarMedioPago = (medio: MedioPagoType) => {
    setMedioPago(medio);
    if (medio === MedioPago.MIXTO) {
      setMontoEfectivo(montoPagoCalculado);
      setMontoTransferencia(0);
    }
  };

  const cerrarModalPagoFicha = () => {
    setCreditoPagoSeleccionado(null);
    setTipoPago(null);
    setConfirmacionAtrasadaAceptada(false);
    resetMedioPago();
  };

  const confirmarCobroAtrasadaConVigentes = () => {
    setConfirmacionAtrasadaAceptada(true);
  };

  const cancelarCobroAtrasada = () => {
    cerrarModalPagoFicha();
  };

  const handlePagarFicha = async (): Promise<PagoFichaResult | undefined> => {
    if (!creditoPagoSeleccionado || !fichaObjetivo || !tipoPago || !puedeConfirmarPago) return;
    try {
      await abonarFichaMutation.mutateAsync({
        creditoId: creditoPagoSeleccionado.id,
        numeroFicha: fichaObjetivo.num,
        medio: medioPago,
        montoEfectivo: medioPago === MedioPago.MIXTO ? asNumber(montoEfectivo) : undefined,
        montoTransferencia: medioPago === MedioPago.MIXTO ? asNumber(montoTransferencia) : undefined,
      });
      toast.success('Pago de ficha registrado');
      const result: PagoFichaResult = {
        folio: creditoPagoSeleccionado.folio,
        numeroFicha: fichaObjetivo.num,
        total: montoPagoCalculado,
        tipo: tipoPago,
      };
      cerrarModalPagoFicha();
      onSuccess?.(result);
      return result;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible registrar el pago de la ficha'));
    }
  };

  return {
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
    hayVigentesPendientes,
    requiereConfirmacionAtrasada,
    puedeConfirmarPago,
    abrirModalPagoFicha,
    seleccionarMedioPago,
    cerrarModalPagoFicha,
    confirmarCobroAtrasadaConVigentes,
    cancelarCobroAtrasada,
    handlePagarFicha,
    isPending: abonarFichaMutation.isPending,
  };
};
