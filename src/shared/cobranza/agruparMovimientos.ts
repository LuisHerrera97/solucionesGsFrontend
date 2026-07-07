import type { MovimientoCajaCobranzaDto } from '../../features/creditos/types/caja';
import type { CobranzaOperacionCardVm } from '../../features/cobranza/types/cobranza';

export const agruparMovimientosCobranza = (movimientos: MovimientoCajaCobranzaDto[]): CobranzaOperacionCardVm[] => {
  const groups = new Map<string, MovimientoCajaCobranzaDto[]>();
  for (const m of movimientos) {
    const key = m.operacionId ?? m.id;
    const arr = groups.get(key) ?? [];
    arr.push(m);
    groups.set(key, arr);
  }

  return Array.from(groups.entries()).map(([key, items]) => {
    const ordered = items
      .slice()
      .sort((a, b) => `${b.fecha} ${b.hora ?? ''}`.localeCompare(`${a.fecha} ${a.hora ?? ''}`));
    const principal = ordered[0];
    return {
      id: key,
      creditoId: principal.creditoId || '',
      creditoFolio: principal.creditoFolio || '',
      clienteNombre: principal.clienteNombre || '',
      fechaPago: principal.fecha,
      horaPago: principal.hora || '-',
      abono: ordered.reduce((s, x) => s + (x.abono ?? 0), 0),
      mora: ordered.reduce((s, x) => s + (x.mora ?? 0), 0),
      totalCobrado: ordered.reduce((s, x) => s + (x.total ?? 0), 0),
      tipo: principal.tipo,
      concepto: principal.concepto,
      revertido: principal.revertido,
      reversaDeId: principal.reversaDeId,
      detalles: ordered.map((x) => ({
        id: x.id,
        numFicha: x.numeroFicha ?? 0,
        fechaPago: x.fecha,
        horaPago: x.hora ?? '-',
        abono: x.abono ?? 0,
        mora: x.mora ?? 0,
        totalCobrado: x.total ?? 0,
      })),
    };
  });
};
