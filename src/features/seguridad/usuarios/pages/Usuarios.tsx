import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog';
import StatusPanel from '../../../../shared/components/StatusPanel';
import { UsuarioModal } from '../components/UsuarioModal';
import { UsuariosHeader } from '../components/UsuariosHeader';
import { UsuariosTable } from '../components/UsuariosTable';
import { ResetPasswordModal } from '../components/ResetPasswordModal';
import { useUsuariosPage } from '../hooks/useUsuariosPage';

const Usuarios = () => {
  const {
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
  } = useUsuariosPage();

  return (
    <div className="space-y-6">
      <UsuariosHeader busqueda={busqueda} onChangeBusqueda={setBusqueda} onNuevo={abrirCrear} disableNuevo={perfiles.length === 0} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && <StatusPanel variant="loading" title="Cargando usuarios" message="Consultando el servidor..." className="m-4" />}
        {!loading && usuariosQuery.isError && <StatusPanel variant="error" title="No fue posible cargar usuarios" message="Intenta nuevamente." className="m-4" />}
        {!loading && !usuariosQuery.isError && usuariosFiltrados.length === 0 && (
          <StatusPanel variant="empty" title="Sin usuarios" message="Crea un usuario para empezar." className="m-4" />
        )}
        {!loading && !usuariosQuery.isError && usuariosFiltrados.length > 0 && (
          <UsuariosTable
            usuarios={usuariosFiltrados}
            eliminando={removeMutation.isPending}
            onEditar={abrirEditar}
            onResetPassword={(u) => setResetPasswordUsuario(u)}
            onEliminar={(u) => setConfirmDelete(u)}
          />
        )}
      </div>

      {modal && form && (
        <UsuarioModal
          mode={modal.mode}
          perfiles={perfiles}
          zonas={zonas}
          form={form}
          onChangeForm={(next) => setForm(next)}
          onClose={() => setModal(null)}
          onSubmit={submit}
          saving={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <ResetPasswordModal
        open={Boolean(resetPasswordUsuario)}
        usuario={resetPasswordUsuario}
        onClose={() => setResetPasswordUsuario(null)}
        onSuccess={() => setResetPasswordUsuario(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(confirmDelete)}
        title="Eliminar usuario"
        message={`¿Estás seguro de eliminar al usuario "${confirmDelete?.usuarioAcceso}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Usuarios;
