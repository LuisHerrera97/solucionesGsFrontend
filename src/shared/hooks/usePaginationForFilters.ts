import { useCallback, useState } from 'react';

/**
 * Paginación que se reinicia a `initialPage` cuando cambia `filterKey`
 * (p. ej. búsqueda, fechas o zona), sin useEffect.
 */
export const usePaginationForFilters = (filterKey: string, initialPage = 1) => {
  const [pagination, setPagination] = useState({ filterKey, page: initialPage });

  const page = pagination.filterKey === filterKey ? pagination.page : initialPage;

  const setPage = useCallback(
    (next: number | ((prev: number) => number)) => {
      setPagination((prev) => {
        const currentPage = prev.filterKey === filterKey ? prev.page : initialPage;
        const resolved = typeof next === 'function' ? next(currentPage) : next;
        return { filterKey, page: resolved };
      });
    },
    [filterKey, initialPage],
  );

  return { page, setPage };
};
