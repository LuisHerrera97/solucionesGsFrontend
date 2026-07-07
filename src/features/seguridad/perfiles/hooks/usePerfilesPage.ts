import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';
import { asNumber, type NumberInputValue } from '../../../../shared/utils/numberInput';
import {
  useActualizarPerfilMutation,
  useCrearPerfilMutation,
  useEliminarPerfilMutation,
  usePerfilesQuery,
} from '../hooks/perfilesHooks';
import type { Guid, PerfilDto } from '../../types/types';

export type PerfilFormState = {
  id?: Guid;
  nombre: string;
  clave: string;
  orden: NumberInputValue;
  activo: boolean;
};

export const usePerfilesPage = () => {
  const [busqueda, setBusqueda] = useState('');
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; id?: Guid } | null>(null);
  const [form, setForm] = useState<PerfilFormState | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<PerfilDto | null>(null);

  const perfilesQuery = usePerfilesQuery();

  const perfiles = useMemo(() => perfilesQuery.data ?? [], [perfilesQuery.data]);
  const perfilesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return perfiles.slice().sort((a, b) => a.orden - b.orden);
    return perfiles
      .filter((p) => p.nombre.toLowerCase().includes(q) || p.clave.toLowerCase().includes(q))
      .sort((a, b) => a.orden - b.orden);
  }, [perfiles, busqueda]);

  const createMutation = useCrearPerfilMutation();
  const updateMutation = useActualizarPerfilMutation();
  const removeMutation = useEliminarPerfilMutation();

  const abrirCrear = () => {
    setForm({ nombre: '', clave: '', orden: perfiles.length + 1, activo: true });
    setModal({ mode: 'create' });
  };

  const abrirEditar = (p: PerfilDto) => {
    setForm({ id: p.id, nombre: p.nombre, clave: p.clave, orden: p.orden, activo: p.activo });
    setModal({ mode: 'edit', id: p.id });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal || !form) return;
    if (!form.nombre.trim() || !form.clave.trim() || form.orden === '' || asNumber(form.orden) <= 0) return;

    if (modal.mode === 'create') {
      try {
        await createMutation.mutateAsync({
          id: '00000000-0000-0000-0000-000000000000',
          nombre: form.nombre.trim(),
          clave: form.clave.trim(),
          orden: asNumber(form.orden),
          activo: form.activo,
          fechaCreacion: new Date().toISOString(),
        });
        toast.success('Perfil creado');
        setModal(null);
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, 'No fue posible crear el perfil'));
      }
      return;
    }

    const perfilActual = perfiles.find((p) => p.id === form.id);
    if (!perfilActual || !form.id) return;
    try {
      await updateMutation.mutateAsync({
        id: form.id,
        payload: { ...perfilActual, nombre: form.nombre.trim(), clave: form.clave.trim(), orden: asNumber(form.orden), activo: form.activo },
      });
      toast.success('Perfil actualizado');
      setModal(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible actualizar el perfil'));
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    try {
      await removeMutation.mutateAsync(confirmDelete.id);
      toast.success('Perfil eliminado');
      setConfirmDelete(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible eliminar el perfil'));
    }
  };

  return {
    busqueda,
    setBusqueda,
    modal,
    setModal,
    form,
    setForm,
    confirmDelete,
    setConfirmDelete,
    perfilesQuery,
    perfilesFiltrados,
    createMutation,
    updateMutation,
    removeMutation,
    abrirCrear,
    abrirEditar,
    submit,
    handleConfirmDelete,
  };
};
