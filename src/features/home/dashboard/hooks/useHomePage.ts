import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientesQuery } from '../../../creditos/clientes/hooks/clientesHooks';
import { useCreditosQuery } from '../../../creditos/creditos/hooks/creditosHooks';
import { useDashboardMovimientosRangoQuery, useDashboardResumenQuery } from '../../../creditos/dashboard/hooks/dashboardHooks';
import { calendarDayKeyFromApi, formatCalendarDateFromApi, localCalendarDayKey, parseCalendarDateFromApi } from '../../../../shared/date/calendarDate';
import type { MovimientoCajaDto } from '../../../creditos/types/caja';

import { EstatusCliente, MedioPago } from '../../../../shared/constants/dominio';

const today = () => localCalendarDayKey();

export const useHomePage = () => {
  const navigate = useNavigate();
  const [fechaDesde, setFechaDesde] = useState(today());
  const [fechaHasta, setFechaHasta] = useState(today());

  const clientesQuery = useClientesQuery({ page: 1, pageSize: 1 });
  const dashboardResumenQuery = useDashboardResumenQuery();
  const creditosQuery = useCreditosQuery();
  const movimientosQuery = useDashboardMovimientosRangoQuery({ fechaDesde, fechaHasta });

  const creditos = useMemo(() => creditosQuery.data ?? [], [creditosQuery.data]);
  const movimientosRango = useMemo<MovimientoCajaDto[]>(() => movimientosQuery.data ?? [], [movimientosQuery.data]);

  const resumen = dashboardResumenQuery.data;
  const totalClientes = resumen?.totalClientes ?? clientesQuery.data?.totalCount ?? 0;
  const creditosActivos = resumen?.creditosActivos ?? creditos.filter(c => c.estatus === EstatusCliente.ACTIVO).length;
  const totalVencido = resumen?.totalVencido ?? 0;

  const cobradoPeriodo = useMemo(() => 
    movimientosRango
      .filter(m => (m.tipo === 'Ficha' || m.tipo === 'Ingreso') && m.total > 0)
      .reduce((acc, curr) => acc + curr.total, 0),
    [movimientosRango]
  );
  
  const ingresoPeriodo = cobradoPeriodo;

  const chartCobradoVencido = useMemo(() => [
    { name: 'Cobrado (período)', monto: cobradoPeriodo, fill: '#22c55e' },
    { name: 'Vencido (pendiente)', monto: totalVencido, fill: '#f59e0b' },
  ], [cobradoPeriodo, totalVencido]);

  const chartPorMedio = useMemo(() => {
    const efectivo = movimientosRango
      .filter(m => m.total > 0)
      .reduce((a, m) => a + (m.montoEfectivo ?? (m.medio === MedioPago.EFECTIVO ? m.total : 0)), 0);
    const transferencia = movimientosRango
      .filter(m => m.total > 0)
      .reduce((a, m) => a + (m.montoTransferencia ?? (m.medio === MedioPago.TRANSFERENCIA ? m.total : 0)), 0);
    
    return [
      { name: 'Efectivo', value: efectivo, color: '#10b981' },
      { name: 'Transferencia', value: transferencia, color: '#3b82f6' },
    ].filter(d => d.value > 0);
  }, [movimientosRango]);

  const cobradoPorDia = useMemo(() => {
    const map = new Map<string, number>();
    const desde = parseCalendarDateFromApi(fechaDesde);
    const hasta = parseCalendarDateFromApi(fechaHasta);
    if (!desde || !hasta) return [];
    for (let d = new Date(desde); d <= hasta; d.setDate(d.getDate() + 1)) {
      map.set(localCalendarDayKey(d), 0);
    }
    movimientosRango.forEach(m => {
      if (m.total <= 0) return;
      const key = calendarDayKeyFromApi(m.fecha);
      if (!key) return;
      const prev = map.get(key) ?? 0;
      map.set(key, prev + m.total);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fecha, cobrado]) => ({
        fecha: formatCalendarDateFromApi(fecha, { day: '2-digit', month: 'short', year: 'numeric' }),
        cobrado,
      }));
  }, [movimientosRango, fechaDesde, fechaHasta]);

  return {
    navigate,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    totalClientes,
    creditosActivos,
    totalVencido,
    ingresoPeriodo,
    chartCobradoVencido,
    chartPorMedio,
    cobradoPorDia,
    movimientosRango,
    movimientosQuery,
    dashboardResumenQuery,
    isLoading: dashboardResumenQuery.isLoading || movimientosQuery.isLoading,
    isError: dashboardResumenQuery.isError || movimientosQuery.isError,
  };
};
