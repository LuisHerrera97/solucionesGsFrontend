import { AuditoriaService } from './services/AuditoriaService';
import { ConfiguracionSistemaService } from './services/ConfiguracionSistemaService';
import { FeriadosService } from './services/FeriadosService';
import { ZonasCobranzaService } from './services/ZonasCobranzaService';

// Auditoria
export const obtenerAuditoria = AuditoriaService.get;
export const obtenerAuditoriaFiltrosOpciones = AuditoriaService.getFiltrosOpciones;

// Configuracion
export const obtenerConfiguracion = ConfiguracionSistemaService.get;
export const actualizarConfiguracion = ConfiguracionSistemaService.update;

// Feriados
export const obtenerFeriados = FeriadosService.getAll;
export const crearFeriado = FeriadosService.create;
export const actualizarFeriado = FeriadosService.update;
export const eliminarFeriado = FeriadosService.remove;

// Zonas
export const obtenerZonas = ZonasCobranzaService.getAll;
export const crearZona = ZonasCobranzaService.create;
export const actualizarZona = ZonasCobranzaService.update;
export const eliminarZona = ZonasCobranzaService.remove;
