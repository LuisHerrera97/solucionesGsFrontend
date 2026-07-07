import { useMemo, useState } from 'react';
import type { Guid } from '../../types/types';
import { useMenuPerfilQuery } from './permisosHooks';
import { usePerfilesQuery } from '../../perfiles/hooks/perfilesHooks';

export const usePermisosPage = () => {
  const perfilesQuery = usePerfilesQuery();
  const perfiles = useMemo(() => perfilesQuery.data ?? [], [perfilesQuery.data]);

  const [perfilId, setPerfilId] = useState<Guid | ''>('');
  const selectedPerfilId = (perfilId || perfiles[0]?.id || '') as Guid | '';

  const menuQuery = useMenuPerfilQuery(selectedPerfilId);

  return {
    perfilesQuery,
    perfiles,
    selectedPerfilId,
    setPerfilId,
    menuQuery,
  };
};
