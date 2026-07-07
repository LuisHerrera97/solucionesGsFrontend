import { API_ENDPOINTS_GENERAL } from '../../core/config/apiEndpoints';
import { ApiService } from '../../core/http/apiService';
import type { ApiResponse } from '../../core/http/types';
import { unwrapApiResponse } from '../../core/http/unwrapApiResponse';
import { withQueryParams, withRouteParams } from '../../shared/utils/url';
import type { AuditoriaEventoDto, AuditoriaFiltrosOpcionesDto } from './types/auditoria';
import type { FeriadoDto } from './types/feriados';
import type { ConfiguracionSistemaDto, Guid, ZonaCobranzaDto } from './types/types';

// Auditoría
export const obtenerAuditoria = async (params: {
  desdeUtc?: string;
  hastaUtc?: string;
  usuarioId?: string;
  accion?: string;
  entidadTipo?: string;
  entidadId?: string;
  page?: number;
  pageSize?: number;
}): Promise<AuditoriaEventoDto[]> => {
  const url = withQueryParams(API_ENDPOINTS_GENERAL.AUDITORIA, params);
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<AuditoriaEventoDto[]>);
};

export const obtenerAuditoriaFiltrosOpciones = async (params: {
  desdeUtc: string;
  hastaUtc: string;
}): Promise<AuditoriaFiltrosOpcionesDto> => {
  const url = withQueryParams(`${API_ENDPOINTS_GENERAL.AUDITORIA}/filtros`, params);
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<AuditoriaFiltrosOpcionesDto>);
};

// Configuración
export const obtenerConfiguracion = async (): Promise<ConfiguracionSistemaDto> => {
  const response = await ApiService.get({ url: API_ENDPOINTS_GENERAL.CONFIGURACION });
  return unwrapApiResponse(response.data as ApiResponse<ConfiguracionSistemaDto>);
};

export const actualizarConfiguracion = async (payload: ConfiguracionSistemaDto): Promise<ConfiguracionSistemaDto> => {
  const response = await ApiService.put({ url: API_ENDPOINTS_GENERAL.CONFIGURACION, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<ConfiguracionSistemaDto>);
};

// Feriados
export const obtenerFeriados = async (): Promise<FeriadoDto[]> => {
  const response = await ApiService.get({ url: API_ENDPOINTS_GENERAL.FERIADOS });
  return unwrapApiResponse(response.data as ApiResponse<FeriadoDto[]>);
};

export const crearFeriado = async (payload: Pick<FeriadoDto, 'fecha' | 'nombre' | 'activo'>): Promise<FeriadoDto> => {
  const response = await ApiService.post({ url: API_ENDPOINTS_GENERAL.FERIADOS, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<FeriadoDto>);
};

export const actualizarFeriado = async (
  id: string,
  payload: Pick<FeriadoDto, 'fecha' | 'nombre' | 'activo'>,
): Promise<FeriadoDto> => {
  const url = withRouteParams(`${API_ENDPOINTS_GENERAL.FERIADOS}/{id}`, { id });
  const response = await ApiService.put({ url, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<FeriadoDto>);
};

export const eliminarFeriado = async (id: string): Promise<void> => {
  const url = withRouteParams(`${API_ENDPOINTS_GENERAL.FERIADOS}/{id}`, { id });
  const response = await ApiService.delete({ url });
  unwrapApiResponse(response.data as ApiResponse<unknown>);
};

// Zonas
export const obtenerZonas = async (): Promise<ZonaCobranzaDto[]> => {
  const response = await ApiService.get({ url: API_ENDPOINTS_GENERAL.ZONAS });
  return unwrapApiResponse(response.data as ApiResponse<ZonaCobranzaDto[]>);
};

export const crearZona = async (payload: Pick<ZonaCobranzaDto, 'nombre' | 'orden'>): Promise<ZonaCobranzaDto> => {
  const response = await ApiService.post({ url: API_ENDPOINTS_GENERAL.ZONAS, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<ZonaCobranzaDto>);
};

export const actualizarZona = async (id: Guid, payload: ZonaCobranzaDto): Promise<ZonaCobranzaDto> => {
  const url = withRouteParams(`${API_ENDPOINTS_GENERAL.ZONAS}/{id}`, { id });
  const response = await ApiService.put({ url, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<ZonaCobranzaDto>);
};

export const eliminarZona = async (id: Guid): Promise<void> => {
  const url = withRouteParams(`${API_ENDPOINTS_GENERAL.ZONAS}/{id}`, { id });
  const response = await ApiService.delete({ url });
  unwrapApiResponse(response.data as ApiResponse<boolean>);
};
