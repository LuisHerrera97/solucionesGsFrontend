import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/context/useAuth';
import { useDebouncedValue } from '../../../../shared/hooks/useDebouncedValue';
import { usePaginationForFilters } from '../../../../shared/hooks/usePaginationForFilters';
import { useCobranzaZonaFiltro } from '../../../../shared/cobranza/useCobranzaZonaFiltro';
import type { PendienteCobroDto } from '../../types/pendientes';
import { usePendientesQuery } from './pendientesHooks';

const PAGE_SIZE = 25;

export const usePendientesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const zonaCtx = useCobranzaZonaFiltro('PENDIENTES_TODAS_ZONAS');

  const [busqueda, setBusqueda] = useState('');
  const busquedaDebounced = useDebouncedValue(busqueda);
  const filterKey = `${busquedaDebounced}|${zonaCtx.zonaFiltro}`;
  const { page, setPage } = usePaginationForFilters(filterKey);

  const pendientesQuery = usePendientesQuery({
    busqueda: busquedaDebounced || undefined,
    page,
    pageSize: PAGE_SIZE,
    zonaId: zonaCtx.zonaIdParam,
  });

  const listado = pendientesQuery.data;
  const pendientes = useMemo(() => listado?.items ?? [], [listado?.items]);
  const totalCount = listado?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const irAlCredito = useCallback(
    (item: PendienteCobroDto) => {
      navigate(`/creditos/${item.creditoId}`);
    },
    [navigate],
  );

  return {
    user,
    zonaCtx,
    busqueda,
    setBusqueda,
    page,
    setPage,
    pendientesQuery,
    pendientes,
    totalCount,
    totalPages,
    pageSize: PAGE_SIZE,
    irAlCredito,
  };
};
