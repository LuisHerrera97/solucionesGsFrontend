import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/context/useAuth';
import { useCobranzaZonaFiltro } from '../../../../shared/cobranza/useCobranzaZonaFiltro';
import { usePaginationForFilters } from '../../../../shared/hooks/usePaginationForFilters';
import { useCreditosQuery } from '../hooks/creditosHooks';
import { usePagoFicha } from '../../../../shared/creditos/usePagoFicha';

const PERM_CREDITOS_TODAS_ZONAS = 'CREDITO_LISTA_TODAS_ZONAS';
const PAGE_SIZE = 50;

export const useCreditosPage = () => {
  const navigate = useNavigate();
  const { user, canBoton } = useAuth();
  const puedePagarFichasVigentesListado = canBoton('CREDITO_PAGAR_FICHA') || canBoton('CREDITO_ABONAR_FICHA');

  const [searchTerm, setSearchTerm] = useState('');

  const zonaCtx = useCobranzaZonaFiltro(PERM_CREDITOS_TODAS_ZONAS);
  const filterKey = `${searchTerm}|${zonaCtx.zonaIdParam ?? ''}`;
  const { page, setPage } = usePaginationForFilters(filterKey);

  const creditosQuery = useCreditosQuery({ searchTerm, page, pageSize: PAGE_SIZE, zonaId: zonaCtx.zonaIdParam });
  
  const pagoFichaHook = usePagoFicha();

  const creditos = creditosQuery.data ?? [];
  const canGoNext = useMemo(() => creditos.length === PAGE_SIZE, [creditos.length]);

  return {
    navigate,
    user,
    puedePagarFichasVigentesListado,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    zonaCtx,
    creditosQuery,
    pagoFichaHook,
    creditos,
    canGoNext,
  };
};
