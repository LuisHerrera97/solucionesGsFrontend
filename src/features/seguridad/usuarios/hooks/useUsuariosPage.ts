import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';
import {
  useActualizarUsuarioMutation,
  useCrearUsuarioMutation,
  useEliminarUsuarioMutation,
  useUsuariosQuery,
} from '../hooks/usuariosHooks';
import { usePerfilesQuery } from '../../perfiles/hooks/perfilesHooks';
import { useZonasCobranzaQuery } from '../../../general/zonas/hooks/zonasHooks';
import type { Guid, UsuarioDto } from '../../types/types';

export type UsuarioFormState = {
  id?: Guid;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  usuarioAcceso: string;
  contrasena: string;
  activo: boolean;
  idPerfil: Guid;
  idZonaCobranza?: Guid | '';
};

export const useUsuariosPage = () => {
  const [busqueda, setBusqueda] = useState('');
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; usuarioId?: Guid } | null>(null);
  const [resetPasswordUsuario, setResetPasswordUsuario] = useState<UsuarioDto | null>(null);
  const [form, setForm] = useState<UsuarioFormState | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<UsuarioDto | null>(null);

  const perfilesQuery = usePerfilesQuery();
  const usuariosQuery = useUsuariosQuery();
  const zonasQuery = useZonasCobranzaQuery();

  const perfiles = useMemo(() => perfilesQuery.data ?? [], [perfilesQuery.data]);
  const usuarios = useMemo(() => usuariosQuery.data ?? [], [usuariosQuery.data]);
  const zonas = useMemo(() => zonasQuery.data ?? [], [zonasQuery.data]);

  const usuariosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return usuarios;
    return usuarios.filter((u) => {
      const full = `${u.nombre} ${u.apellidoPaterno} ${u.apellidoMaterno}`.toLowerCase();
      return (
        u.usuarioAcceso.toLowerCase().includes(q) ||
        u.nombre.toLowerCase().includes(q) ||
        u.apellidoPaterno.toLowerCase().includes(q) ||
        u.apellidoMaterno.toLowerCase().includes(q) ||
        full.includes(q) ||
        (u.nombrePerfil ?? '').toLowerCase().includes(q)
      );
    });
  }, [usuarios, busqueda]);

  const createMutation = useCrearUsuarioMutation();
  const updateMutation = useActualizarUsuarioMutation();
  const removeMutation = useEliminarUsuarioMutation();

  const abrirCrear = () => {
    const primerPerfil = perfiles[0]?.id ?? ('' as Guid);
    setForm({
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      usuarioAcceso: '',
      contrasena: '',
      activo: true,
      idPerfil: primerPerfil,
      idZonaCobranza: '',
    });
    setModal({ mode: 'create' });
  };

  const abrirEditar = (u: UsuarioDto) => {
    setForm({
      id: u.id,
      nombre: u.nombre,
      apellidoPaterno: u.apellidoPaterno,
      apellidoMaterno: u.apellidoMaterno,
      usuarioAcceso: u.usuarioAcceso,
      contrasena: '',
      activo: u.activo,
      idPerfil: u.idPerfil,
      idZonaCobranza: u.idZonaCobranza ?? '',
    });
    setModal({ mode: 'edit', usuarioId: u.id });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    try {
      await removeMutation.mutateAsync(confirmDelete.id);
      toast.success('Usuario eliminado');
      setConfirmDelete(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible eliminar el usuario'));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (!form.nombre.trim() || !form.apellidoPaterno.trim() || !form.usuarioAcceso.trim() || !form.idPerfil) return;
    if (modal?.mode === 'create' && !form.contrasena.trim()) return;

    if (modal?.mode === 'create') {
      try {
        await createMutation.mutateAsync({
          id: '00000000-0000-0000-0000-000000000000',
          nombre: form.nombre.trim(),
          apellidoPaterno: form.apellidoPaterno.trim(),
          apellidoMaterno: form.apellidoMaterno.trim(),
          usuarioAcceso: form.usuarioAcceso.trim(),
          contrasena: form.contrasena.trim(),
          activo: form.activo,
          fechaCreacion: new Date().toISOString(),
          ultimoAcceso: null,
          idPerfil: form.idPerfil,
          nombrePerfil: '',
          idZonaCobranza: form.idZonaCobranza ? (form.idZonaCobranza as Guid) : null,
          nombreZonaCobranza: '',
        });
        toast.success('Usuario creado');
        setModal(null);
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, 'No fue posible crear el usuario'));
      }
      return;
    }

    const usuarioActual = usuarios.find((u) => u.id === form.id);
    if (!usuarioActual || !form.id) return;
    try {
      await updateMutation.mutateAsync({
        id: form.id,
        payload: {
          ...usuarioActual,
          nombre: form.nombre.trim(),
          apellidoPaterno: form.apellidoPaterno.trim(),
          apellidoMaterno: form.apellidoMaterno.trim(),
          usuarioAcceso: form.usuarioAcceso.trim(),
          activo: form.activo,
          idPerfil: form.idPerfil,
          idZonaCobranza: form.idZonaCobranza ? (form.idZonaCobranza as Guid) : null,
        },
      });
      toast.success('Usuario actualizado');
      setModal(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible actualizar el usuario'));
    }
  };

  const loading = perfilesQuery.isLoading || usuariosQuery.isLoading || zonasQuery.isLoading;

  return {
    busqueda,
    setBusqueda,
    modal,
    setModal,
    resetPasswordUsuario,
    setResetPasswordUsuario,
    form,
    setForm,
    confirmDelete,
    setConfirmDelete,
    perfiles,
    usuarios,
    zonas,
    usuariosFiltrados,
    abrirCrear,
    abrirEditar,
    submit,
    handleConfirmDelete,
    loading,
    usuariosQuery,
    removeMutation,
    createMutation,
    updateMutation,
  };
};
