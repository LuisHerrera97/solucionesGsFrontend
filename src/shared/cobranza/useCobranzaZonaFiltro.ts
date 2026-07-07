import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import type { ZonaCobranzaDto } from '../../features/general/types/types';
import { useAuth } from '../../features/auth/context/useAuth';
import { useZonasCobranzaQuery } from '../../features/general/zonas/hooks/zonasHooks';

export const PERM_CREDITO_TODAS_ZONAS = 'CREDITO_TODAS_ZONAS';

export type UseCobranzaZonaFiltroResult = {
  puedeElegirZona: boolean;
  zonaFiltro: string;
  setZonaFiltro: (v: string) => void;
  /** Id de zona a enviar al API (omitir si undefined = todas las zonas) */
  zonaIdParam: string | undefined;
  zonas: ZonaCobranzaDto[];
  zonasLoading: boolean;
  esZonaDelUsuario: boolean;
};

export const useCobranzaZonaFiltro = (permiso = PERM_CREDITO_TODAS_ZONAS): UseCobranzaZonaFiltroResult => {
  const { user, canBoton } = useAuth();
  const puedeElegirZona = canBoton(permiso);
  const zonasQuery = useZonasCobranzaQuery();
  const zonas = useMemo(() => zonasQuery.data ?? [], [zonasQuery.data]);

  const defaultZonaUsuario = useMemo(() => {
    if (!puedeElegirZona || zonasQuery.isLoading || !user?.idZonaCobranza) return '';
    return zonas.find((z) => z.id === user.idZonaCobranza)?.id ?? '';
  }, [puedeElegirZona, zonasQuery.isLoading, user, zonas]);

  const [zonaFiltroExplicit, setZonaFiltroExplicit] = useState<string | undefined>(undefined);
  const [zonaUserId, setZonaUserId] = useState(user?.id);

  if (zonaUserId !== user?.id) {
    setZonaUserId(user?.id);
    setZonaFiltroExplicit(undefined);
  }

  const zonaFiltro = zonaFiltroExplicit !== undefined ? zonaFiltroExplicit : defaultZonaUsuario;

  const setZonaFiltro = useCallback(
    (value: string) => {
      if (value && zonas.length > 0 && !zonas.some((z) => z.id === value)) {
        toast.warning('La zona seleccionada no es válida.');
        setZonaFiltroExplicit('');
        return;
      }
      setZonaFiltroExplicit(value);
    },
    [zonas],
  );

  const zonaIdParam = useMemo(() => {
    if (!puedeElegirZona) return undefined;
    const t = zonaFiltro.trim();
    return t === '' ? undefined : t;
  }, [puedeElegirZona, zonaFiltro]);

  const zonaSeleccionada = useMemo(() => zonas.find((z) => z.id === zonaFiltro.trim()), [zonas, zonaFiltro]);
  const esZonaDelUsuario = Boolean(user?.idZonaCobranza && zonaSeleccionada?.id === user.idZonaCobranza);

  return {
    puedeElegirZona,
    zonaFiltro,
    setZonaFiltro,
    zonaIdParam,
    zonas,
    zonasLoading: zonasQuery.isLoading,
    esZonaDelUsuario,
  };
};
