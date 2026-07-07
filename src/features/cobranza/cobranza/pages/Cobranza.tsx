import StatusPanel from '../../../../shared/components/StatusPanel';
import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog';
import { CobranzaFilters } from '../components/CobranzaFilters';
import { CobranzaMovimientoCard } from '../components/CobranzaMovimientoCard';
import { CobranzaSummary } from '../components/CobranzaSummary';
import { CobranzaZonaFiltroPanel } from '../../../../shared/cobranza/CobranzaZonaFiltroPanel';
import { useCobranzaPage } from '../hooks/useCobranzaPage';

const Cobranza = () => {
  const {
    user,
    puedeReversarMovimiento,
    zonaCtx,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    busqueda,
    setBusqueda,
    page,
    setPage,
    cobranzaQuery,
    movimientoPendienteReversa,
    setMovimientoPendienteReversa,
    expandedKeys,
    setExpandedKeys,
    totalCobrado,
    totalPages,
    movimientosPagina,
    handlePrintTicket,
    handleDesaplicar,
    handleSolicitarReversa,
  } = useCobranzaPage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cobranza</h1>
          <p className="text-sm text-textMuted">Registro por rango de fechas de pagos de fichas, penalizaciones y abonos.</p>
        </div>
      </div>

      <CobranzaZonaFiltroPanel
        user={user}
        puedeElegirZona={zonaCtx.puedeElegirZona}
        zonas={zonaCtx.zonas}
        zonasLoading={zonaCtx.zonasLoading}
        zonaFiltro={zonaCtx.zonaFiltro}
        onChangeZona={zonaCtx.setZonaFiltro}
        esZonaDelUsuario={zonaCtx.esZonaDelUsuario}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
        <CobranzaFilters
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          busqueda={busqueda}
          onChangeFechaInicio={setFechaInicio}
          onChangeFechaFin={setFechaFin}
          onChangeBusqueda={setBusqueda}
        />

        <CobranzaSummary totalCobrado={totalCobrado} movimientos={movimientosPagina.length} />
      </div>

      <div className="space-y-4">
        {cobranzaQuery.isLoading && <StatusPanel variant="loading" title="Cargando cobranza" message="Consultando el servidor..." />}
        {cobranzaQuery.isError && <StatusPanel variant="error" title="No fue posible cargar cobranza" message="Intenta nuevamente." />}
        {movimientosPagina.map((item) => (
          <CobranzaMovimientoCard
            key={item.id}
            item={item}
            expanded={expandedKeys[item.id]}
            onToggleExpanded={() => setExpandedKeys((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
            onReimprimir={() => handlePrintTicket(item)}
            onDesaplicar={puedeReversarMovimiento ? () => handleSolicitarReversa(item) : undefined}
          />
        ))}
        {!cobranzaQuery.isLoading && !cobranzaQuery.isError && movimientosPagina.length === 0 && (
          <StatusPanel variant="empty" title="Sin movimientos" message="No se encontraron movimientos en este rango." />
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button type="button" className="btn btn-light" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Anterior
          </button>
          <span className="text-sm text-textMuted">
            Página <strong>{page}</strong> de {totalPages}
          </span>
          <button type="button" className="btn btn-light" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Siguiente
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(movimientoPendienteReversa)}
        title="Desaplicar operación"
        message={`¿Estás seguro de desaplicar el movimiento de la ficha #${movimientoPendienteReversa?.numeroFicha}? Esta acción afectará el saldo del crédito y la caja.`}
        type="danger"
        onConfirm={() => movimientoPendienteReversa && handleDesaplicar(movimientoPendienteReversa)}
        onCancel={() => setMovimientoPendienteReversa(null)}
      />
    </div>
  );
};

export default Cobranza;
