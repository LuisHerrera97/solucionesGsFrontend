import { toast } from 'react-toastify';
import {
  useAbonarFichaCreditoMutation,
  useCondonarInteresMutation,
  usePenalizarFichaCreditoMutation,
} from './detalleCreditoHooks';
import { asNumber, type NumberInputValue } from '../../../../shared/utils/numberInput';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';
import { printTicket } from '../../../../shared/ticket/printTicket';
import { MedioPago } from '../../../../shared/constants/dominio';
import type { CreditoApi } from '../../api';
import type {
  DetalleCreditoConfirmDialogState,
  DetalleCreditoTicketModal,
} from './useDetalleCreditoModals';

type ModalPagoState = { numFicha: number; pendiente: number } | null;
type ModalType = 'pago' | 'abono' | 'penalizacion' | null;

export const useDetalleCreditoActions = (
  credito: CreditoApi | undefined,
  modalPago: ModalPagoState,
  modalType: ModalType,
  monto: NumberInputValue,
  mora: NumberInputValue,
  medioPago: MedioPago,
  montoEfectivo: NumberInputValue,
  montoTransferencia: NumberInputValue,
  setModalPago: (val: ModalPagoState) => void,
  setTicketModal: (val: DetalleCreditoTicketModal | null) => void,
  setConfirmDialog: (
    val: DetalleCreditoConfirmDialogState | ((prev: DetalleCreditoConfirmDialogState) => DetalleCreditoConfirmDialogState),
  ) => void,
) => {
  const abonarFichaMutation = useAbonarFichaCreditoMutation();
  const penalizarFichaMutation = usePenalizarFichaCreditoMutation();
  const condonarMutation = useCondonarInteresMutation();

  const handleRegistrarPago = async () => {
    if (!credito || !modalPago) return;

    const esPagoCompleto = modalType === 'pago';
    const montoAbono = asNumber(monto);

    if (esPagoCompleto) {
      if (modalPago.pendiente <= 0) return;
      if (medioPago === MedioPago.MIXTO) {
        const sum = asNumber(montoEfectivo) + asNumber(montoTransferencia);
        if (Math.abs(sum - modalPago.pendiente) > 0.01) {
          toast.error('La suma de efectivo y transferencia debe coincidir con el saldo informativo');
          return;
        }
      }
    } else {
      if (montoAbono <= 0) return;
      if (montoAbono >= modalPago.pendiente - 0.001) {
        toast.error('El abono debe ser menor al saldo de la ficha. Use Pagar Ficha para liquidar el saldo completo.');
        return;
      }
      if (medioPago === MedioPago.MIXTO) {
        const sum = asNumber(montoEfectivo) + asNumber(montoTransferencia);
        if (Math.abs(sum - montoAbono) > 0.01) {
          toast.error('La suma de efectivo y transferencia debe coincidir con el monto del abono');
          return;
        }
      }
    }

    try {
      if (esPagoCompleto) {
        await abonarFichaMutation.mutateAsync({
          creditoId: credito.id,
          numeroFicha: modalPago.numFicha,
          medio: medioPago,
          montoEfectivo: medioPago === MedioPago.MIXTO ? asNumber(montoEfectivo) : undefined,
          montoTransferencia: medioPago === MedioPago.MIXTO ? asNumber(montoTransferencia) : undefined,
        });
      } else {
        await abonarFichaMutation.mutateAsync({
          creditoId: credito.id,
          numeroFicha: modalPago.numFicha,
          montoAbono,
          medio: medioPago,
          montoEfectivo: medioPago === MedioPago.MIXTO ? asNumber(montoEfectivo) : undefined,
          montoTransferencia: medioPago === MedioPago.MIXTO ? asNumber(montoTransferencia) : undefined,
        });
      }
      toast.success(esPagoCompleto ? 'Pago registrado' : 'Abono registrado');
      setTicketModal({
        concepto: esPagoCompleto ? 'Pago de ficha' : 'Abono a ficha',
        total: esPagoCompleto ? modalPago.pendiente : montoAbono,
        numeroFicha: modalPago.numFicha,
      });
      setModalPago(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible registrar el movimiento'));
    }
  };

  const handlePenalizar = async () => {
    if (!credito || !modalPago) return;
    const montoMora = asNumber(mora);
    if (montoMora <= 0) return;

    try {
      await penalizarFichaMutation.mutateAsync({
        creditoId: credito.id,
        numeroFicha: modalPago.numFicha,
        monto: montoMora,
      });
      toast.success('Penalización aplicada');
      setModalPago(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible aplicar la penalización'));
    }
  };

  const handleCondonar = async (numFicha: number) => {
    if (!credito) return;
    setConfirmDialog({
      isOpen: true,
      title: 'Condonar interés',
      message: `¿Estás seguro de condonar el interés de la ficha #${numFicha}? Esta acción no se puede deshacer.`,
      type: 'warning',
      onConfirm: async () => {
        try {
          await condonarMutation.mutateAsync({ creditoId: credito.id, numeroFicha: numFicha });
          toast.success('Interés condonado');
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        } catch (err: unknown) {
          toast.error(getErrorMessage(err, 'No fue posible condonar el interés'));
        }
      },
    });
  };

  const handlePrintTicket = (ticketModal: DetalleCreditoTicketModal | null) => {
    if (!ticketModal || !credito) return;
    const now = new Date();
    printTicket({
      fecha: now.toLocaleDateString(),
      hora: now.toLocaleTimeString(),
      cliente: `${credito.clienteNombre} ${credito.clienteApellido}`,
      folio: credito.folio ?? '-',
      concepto: ticketModal.concepto,
      ficha: `#${ticketModal.numeroFicha}`,
      total: ticketModal.total,
    });
  };

  return {
    handleRegistrarPago,
    handlePenalizar,
    handleCondonar,
    handlePrintTicket,
    savingFicha: abonarFichaMutation.isPending || penalizarFichaMutation.isPending,
  };
};
