import StatusPanel from '../../../../shared/components/StatusPanel';
import { formatCalendarDateFromApi } from '../../../../shared/date/calendarDate';
import { useMovimientosPage } from '../hooks/useMovimientosPage';

const Movimientos = () => {
  const {
    puedeReversarMovimiento,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    creditoFolio,
    setCreditoFolio,
    clienteNombre,
    setClienteNombre,
    movimientosQuery,
    movimientos,
    handlePrintTicket,
    handleDesaplicar,
  } = useMovimientosPage();

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold text-textDark">Movimientos</h1>
        <p className="text-sm text-textMuted">Consulta histórica por rango de fechas, folio y cliente.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-4">
        <div>
          <label className="form-label">Desde</label>
          <input type="date" className="form-input" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
        </div>
        <div>
          <label className="form-label">Hasta</label>
          <input type="date" className="form-input" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
        </div>
        <div>
          <label className="form-label">Folio crédito</label>
          <input className="form-input" value={creditoFolio} onChange={(e) => setCreditoFolio(e.target.value)} placeholder="CRE1234" />
        </div>
        <div>
          <label className="form-label">Cliente</label>
          <input className="form-input" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} placeholder="Nombre o apellido" />
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        {movimientosQuery.isLoading && <StatusPanel variant="loading" title="Cargando movimientos" message="Consultando el servidor..." />}
        {movimientosQuery.isError && <StatusPanel variant="error" title="No fue posible cargar movimientos" message="Intenta nuevamente." />}
        {!movimientosQuery.isLoading && !movimientosQuery.isError && movimientos.length === 0 && (
          <StatusPanel variant="empty" title="Sin movimientos" message="No hay resultados para los filtros seleccionados." />
        )}
        {!movimientosQuery.isLoading && !movimientosQuery.isError && movimientos.length > 0 && (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-2 text-left">Fecha</th>
                  <th className="p-2 text-left">Hora</th>
                  <th className="p-2 text-left">Folio</th>
                  <th className="p-2 text-left">Cliente</th>
                  <th className="p-2 text-left">Concepto</th>
                  <th className="p-2 text-left">Ficha</th>
                  <th className="p-2 text-right">Total</th>
                  <th className="p-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((m) => (
                  <tr key={m.id} className="border-t border-gray-100">
                    <td className="p-2">{formatCalendarDateFromApi(m.fecha, { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                    <td className="p-2">{m.hora ?? '-'}</td>
                    <td className="p-2">{m.creditoFolio ?? '-'}</td>
                    <td className="p-2">{m.clienteNombre ?? '-'}</td>
                    <td className="p-2">{m.concepto ?? m.tipo}</td>
                    <td className="p-2">{m.numeroFicha ? `#${m.numeroFicha}` : '-'}</td>
                    <td className="p-2 text-right font-semibold">${m.total.toLocaleString()}</td>
                    <td className="p-2">
                      <div className="flex justify-end gap-2">
                        <button type="button" className="btn btn-light px-2 py-1 text-[10px]" onClick={() => handlePrintTicket(m.id)}>
                          Reimprimir
                        </button>
                        {puedeReversarMovimiento && !m.revertido && !m.reversaDeId && (m.tipo === 'Ficha' || m.tipo === 'Penalizacion') && (
                          <button type="button" className="btn btn-light px-2 py-1 text-[10px]" onClick={() => handleDesaplicar(m.id, m.creditoId)}>
                            Desaplicar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movimientos;
