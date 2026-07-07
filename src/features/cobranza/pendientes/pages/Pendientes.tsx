import StatusPanel from '../../../../shared/components/StatusPanel';
import { CobranzaZonaFiltroPanel } from '../../../../shared/cobranza/CobranzaZonaFiltroPanel';
import { PendienteCard } from '../components/PendienteCard';
import { PendientesHeader } from '../components/PendientesHeader';
import { usePendientesPage } from '../hooks/usePendientesPage';

const Pendientes = () => {
  const {
    user,
    zonaCtx,
    busqueda,
    setBusqueda,
    page,
    setPage,
    pendientesQuery,
    pendientes,
    totalCount,
    totalPages,
    pageSize,
    irAlCredito,
  } = usePendientesPage();

  return (
    <div className="space-y-6">
      <PendientesHeader busqueda={busqueda} onChangeBusqueda={setBusqueda} />

      <CobranzaZonaFiltroPanel
        user={user}
        puedeElegirZona={zonaCtx.puedeElegirZona}
        zonas={zonaCtx.zonas}
        zonasLoading={zonaCtx.zonasLoading}
        zonaFiltro={zonaCtx.zonaFiltro}
        onChangeZona={zonaCtx.setZonaFiltro}
        esZonaDelUsuario={zonaCtx.esZonaDelUsuario}
      />

      <div className="space-y-3">
        {pendientesQuery.isLoading && <StatusPanel variant="loading" title="Cargando pendientes" message="Consultando el servidor..." />}
        {pendientesQuery.isError && <StatusPanel variant="error" title="No fue posible cargar pendientes" message="Intenta nuevamente." />}
        {!pendientesQuery.isLoading && !pendientesQuery.isError && pendientes.length === 0 && (
          <StatusPanel variant="empty" title="Sin pendientes" message="No hay fichas pendientes para mostrar." />
        )}
        {pendientes.map((item) => (
          <PendienteCard key={`${item.creditoId}-${item.numFicha}`} item={item} onIrAlCredito={irAlCredito} />
        ))}
      </div>

      {totalCount > pageSize && (
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between border-t border-gray-100 pt-4">
          <p className="text-xs text-textMuted">
            Mostrando {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} de {totalCount}
          </p>
          <div className="flex gap-2">
            <button type="button" className="btn btn-light text-sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Anterior
            </button>
            <button
              type="button"
              className="btn btn-light text-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pendientes;
