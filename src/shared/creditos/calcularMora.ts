import { parseCalendarDateFromApi } from '../date/calendarDate';
import type { ConfiguracionSistemaDto } from '../../features/general/types/types';
import type { Credito } from '../../features/creditos/types/types';

import { TipoCredito } from '../constants/dominio';

export const calcularMoraSugerida = (
  fechaFicha: string,
  credito: Credito | undefined,
  config: ConfiguracionSistemaDto | undefined
): number => {
  if (!config || !credito) return 0;
  const fecha0 = parseCalendarDateFromApi(fechaFicha);
  if (!fecha0) return 0;
  const hoy = new Date();
  const hoy0 = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const diasAtraso = Math.floor((hoy0.getTime() - fecha0.getTime()) / (1000 * 60 * 60 * 24));
  if (diasAtraso <= 0) return 0;

  if (credito.tipo === TipoCredito.DIARIO) {
    const gracia = Math.max(0, config.diasGraciaDiaria ?? 0);
    if (diasAtraso <= gracia) return 0;
    const diasSujetos = diasAtraso - gracia;
    const veces = (config.topeMoraDiaria ?? 0) > 0 ? Math.min(diasSujetos, config.topeMoraDiaria) : diasSujetos;
    return veces * config.moraDiaria;
  }
  if (credito.tipo === TipoCredito.SEMANAL) {
    const gracia = Math.max(0, config.diasGraciaSemanal ?? 0);
    if (diasAtraso <= gracia) return 0;
    const diasSujetos = diasAtraso - gracia;
    const veces = (config.topeMoraSemanal ?? 0) > 0 ? Math.min(diasSujetos, config.topeMoraSemanal) : diasSujetos;
    return veces * config.moraSemanal;
  }
  if (credito.tipo === TipoCredito.MENSUAL) {
    const gracia = Math.max(0, config.diasGraciaMensual ?? 0);
    if (diasAtraso <= gracia) return 0;
    const diasSujetos = diasAtraso - gracia;
    const veces = (config.topeMoraMensual ?? 0) > 0 ? Math.min(diasSujetos, config.topeMoraMensual) : diasSujetos;
    return veces * config.moraMensual;
  }
  return 0;
};
