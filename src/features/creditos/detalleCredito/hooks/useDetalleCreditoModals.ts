import { useState } from 'react';
import type { NumberInputValue } from '../../../../shared/utils/numberInput';
import { MedioPago } from '../../../../shared/constants/dominio';

export type DetalleCreditoTicketModal = { concepto: string; total: number; numeroFicha: number };

export type DetalleCreditoConfirmDialogState = {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  onConfirm: () => void;
};

export const useDetalleCreditoModals = () => {
  const [modalPago, setModalPago] = useState<{ numFicha: number; pendiente: number } | null>(null);
  const [modalType, setModalType] = useState<'pago' | 'abono' | 'penalizacion' | null>(null);
  const [monto, setMonto] = useState<NumberInputValue>(0);
  const [mora, setMora] = useState<NumberInputValue>(0);
  const [medioPago, setMedioPago] = useState<MedioPago>(MedioPago.EFECTIVO);
  const [montoEfectivo, setMontoEfectivo] = useState<NumberInputValue>(0);
  const [montoTransferencia, setMontoTransferencia] = useState<NumberInputValue>(0);
  const [ticketModal, setTicketModal] = useState<DetalleCreditoTicketModal | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<DetalleCreditoConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {},
  });

  return {
    modalPago,
    setModalPago,
    modalType,
    setModalType,
    monto,
    setMonto,
    mora,
    setMora,
    medioPago,
    setMedioPago,
    montoEfectivo,
    setMontoEfectivo,
    montoTransferencia,
    setMontoTransferencia,
    ticketModal,
    setTicketModal,
    confirmDialog,
    setConfirmDialog,
  };
};
