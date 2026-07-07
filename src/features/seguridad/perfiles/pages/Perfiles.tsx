import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog';
import StatusPanel from '../../../../shared/components/StatusPanel';
import { PerfilModal } from '../components/PerfilModal';
import { PerfilesHeader } from '../components/PerfilesHeader';
import { PerfilesTable } from '../components/PerfilesTable';
import { usePerfilesPage } from '../hooks/usePerfilesPage';

const Perfiles = () => {
  const {
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
  } = usePerfilesPage();

  return (
    <div className="space-y-6">
      <PerfilesHeader busqueda={busqueda} onChangeBusqueda={setBusqueda} onNuevo={abrirCrear} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {perfilesQuery.isLoading && <StatusPanel variant="loading" title="Cargando perfiles" message="Consultando el servidor..." className="m-4" />}
        {perfilesQuery.isError && <StatusPanel variant="error" title="No fue posible cargar perfiles" message="Intenta nuevamente." className="m-4" />}
        {!perfilesQuery.isLoading && !perfilesQuery.isError && perfilesFiltrados.length === 0 && (
          <StatusPanel variant="empty" title="Sin perfiles" message="Crea un perfil para empezar." className="m-4" />
        )}
        {!perfilesQuery.isLoading && !perfilesQuery.isError && perfilesFiltrados.length > 0 && (
          <PerfilesTable
            perfiles={perfilesFiltrados}
            eliminando={removeMutation.isPending}
            onEditar={abrirEditar}
            onEliminar={(p) => setConfirmDelete(p)}
          />
        )}
      </div>

      {modal && form && (
        <PerfilModal
          mode={modal.mode}
          form={form}
          onChangeForm={(next) => setForm(next)}
          onClose={() => setModal(null)}
          onSubmit={submit}
          saving={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(confirmDelete)}
        title="Eliminar perfil"
        message={`¿Estás seguro de eliminar el perfil "${confirmDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        type="danger"
        loading={removeMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Perfiles;
