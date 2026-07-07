import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';
import {
  useActualizarBotonMutation,
  useActualizarModuloMutation,
  useActualizarPaginaMutation,
  useBotonesQuery,
  useCrearBotonMutation,
  useCrearModuloMutation,
  useCrearPaginaMutation,
  useEliminarBotonMutation,
  useEliminarModuloMutation,
  useEliminarPaginaMutation,
  useModulosQuery,
  usePaginasQuery,
} from '../hooks/elementosSistemaHooks';
import type { BotonDto, ModuloDto, PaginaDto } from '../../types/types';

type Tab = 'modulos' | 'paginas' | 'botones';

export const useElementosSistemaPage = () => {
  const [tab, setTab] = useState<Tab>('modulos');

  const modulosQuery = useModulosQuery();
  const paginasQuery = usePaginasQuery();
  const botonesQuery = useBotonesQuery();

  const modulos = useMemo(() => modulosQuery.data ?? [], [modulosQuery.data]);
  const paginas = useMemo(() => paginasQuery.data ?? [], [paginasQuery.data]);
  const botones = useMemo(() => botonesQuery.data ?? [], [botonesQuery.data]);

  const [modal, setModal] = useState<
    | { tipo: 'modulo'; mode: 'create' | 'edit'; item?: ModuloDto }
    | { tipo: 'pagina'; mode: 'create' | 'edit'; item?: PaginaDto }
    | { tipo: 'boton'; mode: 'create' | 'edit'; item?: BotonDto }
    | null
  >(null);

  const createModuloMutation = useCrearModuloMutation();
  const updateModuloMutation = useActualizarModuloMutation();
  const removeModuloMutation = useEliminarModuloMutation();
  const createPaginaMutation = useCrearPaginaMutation();
  const updatePaginaMutation = useActualizarPaginaMutation();
  const removePaginaMutation = useEliminarPaginaMutation();
  const createBotonMutation = useCrearBotonMutation();
  const updateBotonMutation = useActualizarBotonMutation();
  const removeBotonMutation = useEliminarBotonMutation();

  const abrirNuevo = () => {
    if (tab === 'modulos') setModal({ tipo: 'modulo', mode: 'create' });
    if (tab === 'paginas') setModal({ tipo: 'pagina', mode: 'create' });
    if (tab === 'botones') setModal({ tipo: 'boton', mode: 'create' });
  };

  const titulo = useMemo(() => {
    if (tab === 'modulos') return 'Módulos';
    if (tab === 'paginas') return 'Páginas';
    return 'Botones';
  }, [tab]);

  const ordenadoModulos = useMemo(() => modulos.slice().sort((a, b) => a.orden - b.orden), [modulos]);
  const ordenadoPaginas = useMemo(() => paginas.slice().sort((a, b) => a.orden - b.orden), [paginas]);
  const ordenadoBotones = useMemo(() => botones.slice().sort((a, b) => a.orden - b.orden), [botones]);

  const [confirmDelete, setConfirmDelete] = useState<{
    tipo: 'modulo' | 'pagina' | 'boton';
    id: string;
    nombre: string;
  } | null>(null);

  const busy =
    modulosQuery.isLoading ||
    paginasQuery.isLoading ||
    botonesQuery.isLoading ||
    createModuloMutation.isPending ||
    updateModuloMutation.isPending ||
    removeModuloMutation.isPending ||
    createPaginaMutation.isPending ||
    updatePaginaMutation.isPending ||
    removePaginaMutation.isPending ||
    createBotonMutation.isPending ||
    updateBotonMutation.isPending ||
    removeBotonMutation.isPending;

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;

    try {
      if (confirmDelete.tipo === 'modulo') {
        await removeModuloMutation.mutateAsync(confirmDelete.id);
        toast.success('Módulo eliminado');
      } else if (confirmDelete.tipo === 'pagina') {
        await removePaginaMutation.mutateAsync(confirmDelete.id);
        toast.success('Página eliminada');
      } else if (confirmDelete.tipo === 'boton') {
        await removeBotonMutation.mutateAsync(confirmDelete.id);
        toast.success('Botón eliminado');
      }
      setConfirmDelete(null);
    } catch (err: unknown) {
      const msgMap = {
        modulo: 'No fue posible eliminar el módulo',
        pagina: 'No fue posible eliminar la página',
        boton: 'No fue posible eliminar el botón',
      };
      toast.error(getErrorMessage(err, msgMap[confirmDelete.tipo]));
    }
  };

  const handleSubmitModulo = async (payload: ModuloDto) => {
    if (!modal || modal.tipo !== 'modulo') return;

    try {
      if (modal.mode === 'create') {
        await createModuloMutation.mutateAsync(payload);
        toast.success('Módulo creado');
      } else {
        await updateModuloMutation.mutateAsync({ id: payload.id, payload });
        toast.success('Módulo actualizado');
      }
      setModal(null);
    } catch (err: unknown) {
      toast.error(
        getErrorMessage(err, modal.mode === 'create' ? 'No fue posible crear el módulo' : 'No fue posible actualizar el módulo'),
      );
    }
  };

  const handleSubmitPagina = async (payload: PaginaDto) => {
    if (!modal || modal.tipo !== 'pagina') return;

    try {
      if (modal.mode === 'create') {
        await createPaginaMutation.mutateAsync(payload);
        toast.success('Página creada');
      } else {
        await updatePaginaMutation.mutateAsync({ id: payload.id, payload });
        toast.success('Página actualizada');
      }
      setModal(null);
    } catch (err: unknown) {
      toast.error(
        getErrorMessage(err, modal.mode === 'create' ? 'No fue posible crear la página' : 'No fue posible actualizar la página'),
      );
    }
  };

  const handleSubmitBoton = async (payload: BotonDto) => {
    if (!modal || modal.tipo !== 'boton') return;

    try {
      if (modal.mode === 'create') {
        await createBotonMutation.mutateAsync(payload);
        toast.success('Botón creado');
      } else {
        await updateBotonMutation.mutateAsync({ id: payload.id, payload });
        toast.success('Botón actualizado');
      }
      setModal(null);
    } catch (err: unknown) {
      toast.error(
        getErrorMessage(err, modal.mode === 'create' ? 'No fue posible crear el botón' : 'No fue posible actualizar el botón'),
      );
    }
  };

  return {
    tab,
    setTab,
    modulosQuery,
    paginasQuery,
    botonesQuery,
    modal,
    setModal,
    abrirNuevo,
    titulo,
    ordenadoModulos,
    ordenadoPaginas,
    ordenadoBotones,
    confirmDelete,
    setConfirmDelete,
    busy,
    handleConfirmDelete,
    handleSubmitModulo,
    handleSubmitPagina,
    handleSubmitBoton,
  };
};
