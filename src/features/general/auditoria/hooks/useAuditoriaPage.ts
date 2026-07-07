import { useMemo, useState } from 'react';
import { useAuditoriaFiltrosOpcionesQuery, useAuditoriaQuery } from '../hooks/auditoriaHooks';
import { usePaginationForFilters } from '../../../../shared/hooks/usePaginationForFilters';

const PAGE_SIZE = 50;

export const useAuditoriaPage = () => {
  const [desde, setDesde] = useState(() => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [hasta, setHasta] = useState(() => new Date().toISOString().slice(0, 10));
  const [accion, setAccion] = useState('');
  const [entidadTipo, setEntidadTipo] = useState('');
  const filterKey = `${desde}|${hasta}|${accion}|${entidadTipo}`;
  const { page, setPage } = usePaginationForFilters(filterKey);

  const rangoUtc = useMemo(() => {
    const desdeUtc = new Date(`${desde}T00:00:00.000Z`).toISOString();
    const hastaUtc = new Date(`${hasta}T23:59:59.999Z`).toISOString();
    return { desdeUtc, hastaUtc };
  }, [desde, hasta]);

  const filtrosOpcionesQuery = useAuditoriaFiltrosOpcionesQuery(rangoUtc);

  const accionParam = useMemo(() => {
    const t = accion.trim();
    if (!t) return '';
    const data = filtrosOpcionesQuery.data;
    if (!data) return t;
    return data.acciones.some((a) => a.valor === t) ? t : '';
  }, [accion, filtrosOpcionesQuery.data]);

  const entidadTipoParam = useMemo(() => {
    const t = entidadTipo.trim();
    if (!t) return '';
    const data = filtrosOpcionesQuery.data;
    if (!data) return t;
    return data.entidadesTipo.some((a) => a.valor === t) ? t : '';
  }, [entidadTipo, filtrosOpcionesQuery.data]);

  const params = useMemo(
    () => ({
      ...rangoUtc,
      accion: accionParam || undefined,
      entidadTipo: entidadTipoParam || undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    [rangoUtc, accionParam, entidadTipoParam, page],
  );

  const auditoriaQuery = useAuditoriaQuery(params);
  const eventos = auditoriaQuery.data ?? [];
  const haySiguiente = eventos.length === PAGE_SIZE;

  const etiquetaAccion = useMemo(() => {
    const m = new Map<string, string>();
    filtrosOpcionesQuery.data?.acciones.forEach((o) => m.set(o.valor, o.etiqueta));
    return m;
  }, [filtrosOpcionesQuery.data]);

  const etiquetaEntidadTipo = useMemo(() => {
    const m = new Map<string, string>();
    filtrosOpcionesQuery.data?.entidadesTipo.forEach((o) => m.set(o.valor, o.etiqueta));
    return m;
  }, [filtrosOpcionesQuery.data]);

  const opcionesAccion = filtrosOpcionesQuery.data?.acciones ?? [];
  const opcionesEntidad = filtrosOpcionesQuery.data?.entidadesTipo ?? [];
  const filtrosCargando = filtrosOpcionesQuery.isLoading;

  return {
    desde,
    setDesde,
    hasta,
    setHasta,
    accion,
    setAccion,
    entidadTipo,
    setEntidadTipo,
    page,
    setPage,
    filtrosOpcionesQuery,
    auditoriaQuery,
    eventos,
    haySiguiente,
    etiquetaAccion,
    etiquetaEntidadTipo,
    opcionesAccion,
    opcionesEntidad,
    filtrosCargando,
    PAGE_SIZE,
  };
};
