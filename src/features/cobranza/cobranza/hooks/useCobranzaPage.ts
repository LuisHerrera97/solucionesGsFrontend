import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../auth/context/useAuth';
import { useCobranzaZonaFiltro } from '../../../../shared/cobranza/useCobranzaZonaFiltro';
import { useDebouncedValue } from '../../../../shared/hooks/useDebouncedValue';
import { usePaginationForFilters } from '../../../../shared/hooks/usePaginationForFilters';
import { useCobranzaMovimientosRangoQuery } from '../../../creditos/dashboard/hooks/dashboardHooks';
import { useReversarMovimientoCreditoMutation } from '../../../creditos/detalleCredito/hooks/detalleCreditoHooks';
import { agruparMovimientosCobranza } from '../../../../shared/cobranza/agruparMovimientos';
import { movimientoParaReversa } from '../../../../shared/cobranza/movimientoParaReversa';
import { printTicket } from '../../../../shared/ticket/printTicket';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';
import type { MovimientoCajaCobranzaDto } from '../../../creditos/types/caja';
import type { CobranzaOperacionCardVm } from '../../types/cobranza';

const PAGE_SIZE = 10;

export const useCobranzaPage = () => {
  const { user, canBoton } = useAuth();
  const puedeReversarMovimiento = canBoton('CREDITO_REVERSAR');
  const zonaCtx = useCobranzaZonaFiltro('COBRANZA_TODAS_ZONAS');

  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [fechaFin, setFechaFin] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [busqueda, setBusqueda] = useState('');
  const busquedaDebounced = useDebouncedValue(busqueda);
  const filterKey = `${fechaInicio}|${fechaFin}|${busquedaDebounced}|${zonaCtx.zonaIdParam ?? ''}`;
  const { page, setPage } = usePaginationForFilters(filterKey);

  const cobranzaQuery = useCobranzaMovimientosRangoQuery({
    fechaDesde: fechaInicio,
    fechaHasta: fechaFin,
    clienteNombre: busquedaDebounced || undefined,
    zonaId: zonaCtx.zonaIdParam,
  });

  const movimientos = useMemo(() => cobranzaQuery.data ?? [], [cobranzaQuery.data]);
  const reversarMutation = useReversarMovimientoCreditoMutation();
  const [movimientoPendienteReversa, setMovimientoPendienteReversa] = useState<MovimientoCajaCobranzaDto | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const movimientosAgrupados = useMemo(() => agruparMovimientosCobranza(movimientos), [movimientos]);

  const totalCobrado = useMemo(() => movimientosAgrupados.reduce((sum, item) => sum + item.totalCobrado, 0), [movimientosAgrupados]);
  const totalPages = Math.max(1, Math.ceil(movimientosAgrupados.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const movimientosPagina = useMemo(() => movimientosAgrupados.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE), [movimientosAgrupados, pageSafe]);

  const handlePrintTicket = (item: CobranzaOperacionCardVm) => {
    printTicket({
      fecha: item.fechaPago,
      hora: item.horaPago ?? '-',
      cliente: item.clienteNombre ?? '-',
      folio: item.creditoFolio ?? '-',
      concepto: item.concepto ?? item.tipo ?? 'Movimiento',
      ficha: item.detalles.map((d) => `#${d.numFicha}`).join(', '),
      total: item.totalCobrado,
    });
  };

  const handleDesaplicar = async (mov: MovimientoCajaCobranzaDto) => {
    if (!mov.creditoId || !mov.id) return;
    try {
      await reversarMutation.mutateAsync({ creditoId: mov.creditoId, movimientoId: mov.id });
      toast.success('Operación desaplicada');
      setMovimientoPendienteReversa(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible desaplicar la operación'));
    }
  };

  const handleSolicitarReversa = (item: CobranzaOperacionCardVm) => {
    const mov = movimientoParaReversa(item);
    if (mov) setMovimientoPendienteReversa(mov);
  };

  return {
    user,
    puedeReversarMovimiento,
    zonaCtx,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    busqueda,
    setBusqueda,
    page,
    setPage,
    cobranzaQuery,
    movimientoPendienteReversa,
    setMovimientoPendienteReversa,
    expandedKeys,
    setExpandedKeys,
    movimientosAgrupados,
    totalCobrado,
    totalPages,
    movimientosPagina,
    handlePrintTicket,
    handleDesaplicar,
    handleSolicitarReversa,
  };
};
