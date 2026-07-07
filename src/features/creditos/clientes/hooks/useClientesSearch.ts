import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedValue } from '../../../../shared/hooks/useDebouncedValue';
import { usePaginationForFilters } from '../../../../shared/hooks/usePaginationForFilters';
import { useCobranzaZonaFiltro } from '../../../../shared/cobranza/useCobranzaZonaFiltro';

const BUSCAR_DEBOUNCE_MS = 300;
const PERM_CLIENTE_TODAS_ZONAS = 'CLIENTE_TODAS_ZONAS';

export const useClientesSearch = () => {
  const [searchParams] = useSearchParams();
  const qFromUrl = searchParams.get('q')?.trim() ?? '';
  const [searchTerm, setSearchTerm] = useState(qFromUrl);
  const [searchUserId, setSearchUserId] = useState(qFromUrl);

  const zonaCtx = useCobranzaZonaFiltro(PERM_CLIENTE_TODAS_ZONAS);

  if (searchUserId !== qFromUrl) {
    setSearchUserId(qFromUrl);
    setSearchTerm(qFromUrl);
  }

  const buscarDebounced = useDebouncedValue(searchTerm, BUSCAR_DEBOUNCE_MS);
  const buscarApi = buscarDebounced.trim() === '' ? undefined : buscarDebounced.trim();
  const filterKey = `${buscarApi ?? ''}|${qFromUrl}|${zonaCtx.zonaIdParam ?? ''}`;
  const { page, setPage } = usePaginationForFilters(filterKey);

  return {
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    zonaCtx,
    buscarApi,
  };
};
