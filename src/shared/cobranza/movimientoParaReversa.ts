import type { MovimientoCajaCobranzaDto } from '../../features/creditos/types/caja';
import type { CobranzaOperacionCardVm } from '../../features/cobranza/types/cobranza';

export const movimientoParaReversa = (item: CobranzaOperacionCardVm): MovimientoCajaCobranzaDto | null => {
  const det = item.detalles[0];
  if (!det?.id) return null;
  return {
    id: det.id,
    tipo: item.tipo ?? 'Ficha',
    concepto: item.concepto,
    total: item.totalCobrado,
    abono: item.abono,
    mora: item.mora,
    creditoId: item.creditoId,
    creditoFolio: item.creditoFolio,
    clienteNombre: item.clienteNombre,
    numeroFicha: det.numFicha,
    fecha: item.fechaPago,
    hora: item.horaPago,
    revertido: item.revertido,
    reversaDeId: item.reversaDeId,
  };
};
