import { NuevaZonaForm } from '../components/NuevaZonaForm';
import { ZonasCobranzaTable } from '../components/ZonasCobranzaTable';
import { useZonasCobranzaPage } from '../hooks/useZonasCobranzaPage';

const ZonasCobranza = () => {
  const {
    zonasQuery,
    zonas,
    nombre,
    setNombre,
    orden,
    setOrden,
    createMutation,
    updateMutation,
    deleteMutation,
    handleCreate,
    handleToggleActivo,
    handleUpdateOrden,
    handleDelete,
  } = useZonasCobranzaPage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Zonas de Cobranza</h1>
        <p className="text-sm text-textMuted mt-1">Administra colonias o zonas para asignación de clientes.</p>
      </div>

      <NuevaZonaForm
        nombre={nombre}
        orden={orden}
        loading={createMutation.isPending}
        onChangeNombre={setNombre}
        onChangeOrden={setOrden}
        onSubmit={handleCreate}
      />

      <ZonasCobranzaTable
        zonas={zonas}
        isLoading={zonasQuery.isLoading}
        isError={zonasQuery.isError}
        isMutating={updateMutation.isPending}
        isDeleting={deleteMutation.isPending}
        onToggleActivo={handleToggleActivo}
        onUpdateOrden={handleUpdateOrden}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ZonasCobranza;
