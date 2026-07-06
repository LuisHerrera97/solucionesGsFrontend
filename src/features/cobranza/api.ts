import { CobranzaService } from './services/CobranzaService';
import { PendientesService } from './services/PendientesService';

export const obtenerCobranza = CobranzaService.getAll;
export const obtenerPendientes = PendientesService.getPage;
