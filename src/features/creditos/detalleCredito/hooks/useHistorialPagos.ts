import { toast } from 'react-toastify';
import { useAuth } from '../../../auth/context/useAuth';
import { useMovimientosByCreditoQuery, useReversarMovimientoCreditoMutation } from '../hooks/detalleCreditoHooks';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';
import { printTicket } from '../../../../shared/ticket/printTicket';
import { formatCalendarDateFromApi } from '../../../../shared/date/calendarDate';

export const useHistorialPagos = (creditoId: string) => {
  const { canBoton } = useAuth();
  const puedeReversarMovimiento = canBoton('CREDITO_REVERSAR');
  const movimientosQuery = useMovimientosByCreditoQuery(creditoId);
  const reversarMutation = useReversarMovimientoCreditoMutation();

  const movimientos = movimientosQuery.data ?? [];

  const handlePrintTicket = (mId: string) => {
    const movimiento = movimientos.find((m) => m.id === mId);
    if (!movimiento) return;
    printTicket({
      fecha: formatCalendarDateFromApi(movimiento.fecha),
      hora: movimiento.hora ?? '-',
      cliente: movimiento.clienteNombre ?? '-',
      folio: movimiento.creditoFolio ?? '-',
      concepto: movimiento.concepto ?? movimiento.tipo,
      ficha: movimiento.numeroFicha ? `#${movimiento.numeroFicha}` : '-',
      total: movimiento.total,
    });
  };

  const handleReversa = async (movimientoId: string) => {
    try {
      await reversarMutation.mutateAsync({ creditoId, movimientoId });
      toast.success('Operación desaplicada');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible desaplicar la operación'));
    }
  };

  return {
    movimientos,
    movimientosQuery,
    puedeReversarMovimiento,
    handlePrintTicket,
    handleReversa,
    reversando: reversarMutation.isPending,
  };
};
