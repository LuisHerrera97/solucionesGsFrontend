import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog';
import StatusPanel from '../../../../shared/components/StatusPanel';
import { FeriadoForm } from '../components/FeriadoForm';
import { FeriadosTable } from '../components/FeriadosTable';
import { useFeriadosPage } from '../hooks/useFeriadosPage';

const Feriados = () => {
  const {
    feriadosQuery,
    crearMutation,
    actualizarMutation,
    eliminarMutation,
    fecha,
    setFecha,
    nombre,
    setNombre,
    activo,
    setActivo,
    feriados,
    confirmDeleteId,
    setConfirmDeleteId,
    handleCrear,
    handleToggleActivo,
    handleConfirmEliminar,
  } = useFeriadosPage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Feriados</h1>
        <p className="text-sm text-textMuted">Catálogo de fechas que el sistema puede considerar inhábiles.</p>
      </div>

      <FeriadoForm
        fecha={fecha}
        nombre={nombre}
        activo={activo}
        saving={crearMutation.isPending}
        onChangeFecha={setFecha}
        onChangeNombre={setNombre}
        onChangeActivo={setActivo}
        onSubmit={() => void handleCrear()}
      />

      {feriadosQuery.isLoading && <StatusPanel variant="loading" title="Cargando feriados" message="Consultando el servidor..." />}
      {feriadosQuery.isError && <StatusPanel variant="error" title="No fue posible cargar feriados" message="Intenta nuevamente." />}

      {!feriadosQuery.isLoading && !feriadosQuery.isError && (
        <FeriadosTable
          feriados={feriados}
          updating={actualizarMutation.isPending}
          deleting={eliminarMutation.isPending}
          onToggleActivo={(f) => void handleToggleActivo(f)}
          onEliminar={setConfirmDeleteId}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(confirmDeleteId)}
        title="Eliminar feriado"
        message="¿Estás seguro de eliminar este feriado? Esta acción no se puede deshacer."
        type="danger"
        loading={eliminarMutation.isPending}
        onConfirm={() => void handleConfirmEliminar()}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

export default Feriados;
