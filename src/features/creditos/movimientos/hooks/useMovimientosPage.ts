import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../auth/context/useAuth';
import { useDashboardMovimientosRangoQuery } from '../../dashboard/hooks/dashboardHooks';
import { useReversarMovimientoCreditoMutation } from '../../detalleCredito/hooks/detalleCreditoHooks';
import { formatCalendarDateFromApi, localCalendarDayKey } from '../../../../shared/date/calendarDate';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';
import { printTicket } from '../../../../shared/ticket/printTicket';

export const useMovimientosPage = () => {
  const { canBoton } = useAuth();
  const puedeReversarMovimiento = canBoton('CREDITO_REVERSAR');
  const hoy = localCalendarDayKey();

  const [fechaDesde, setFechaDesde] = useState(hoy);
  const [fechaHasta, setFechaHasta] = useState(hoy);
  const [creditoFolio, setCreditoFolio] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');

  const movimientosQuery = useDashboardMovimientosRangoQuery({
    fechaDesde,
    fechaHasta,
    creditoFolio: creditoFolio.trim() || undefined,
    clienteNombre: clienteNombre.trim() || undefined,
  });
  const reversarMutation = useReversarMovimientoCreditoMutation();

  const movimientos = useMemo(() => movimientosQuery.data ?? [], [movimientosQuery.data]);

  const handlePrintTicket = useCallback(
    (id: string) => {
      const m = movimientos.find((x) => x.id === id);
      if (!m) return;
      printTicket({
        fecha: formatCalendarDateFromApi(m.fecha),
        hora: m.hora ?? '-',
        cliente: m.clienteNombre ?? '-',
        folio: m.creditoFolio ?? '-',
        concepto: m.concepto ?? m.tipo,
        ficha: m.numeroFicha ? `#${m.numeroFicha}` : '-',
        total: m.total,
      });
    },
    [movimientos],
  );

  const handleDesaplicar = useCallback(
    async (id: string, creditoId?: string | null) => {
      if (!creditoId) return;
      try {
        await reversarMutation.mutateAsync({ creditoId, movimientoId: id });
        toast.success('Operación desaplicada');
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, 'No fue posible desaplicar la operación'));
      }
    },
    [reversarMutation],
  );

  return {
    puedeReversarMovimiento,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    creditoFolio,
    setCreditoFolio,
    clienteNombre,
    setClienteNombre,
    movimientosQuery,
    movimientos,
    handlePrintTicket,
    handleDesaplicar,
  };
};
