import { API_ENDPOINTS_GENERAL } from '../../../core/config/apiEndpoints';
import { ApiService } from '../../../core/http/apiService';
import type { ApiResponse } from '../../../core/http/types';
import { unwrapApiResponse } from '../../../core/http/unwrapApiResponse';
import type { AuditoriaEventoDto, AuditoriaFiltrosOpcionesDto } from '../types/auditoria';
import { withQueryParams } from '../../../shared/utils/url';

export const AuditoriaService = {
  get: async (params: {
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
  },

  getFiltrosOpciones: async (params: { desdeUtc: string; hastaUtc: string }): Promise<AuditoriaFiltrosOpcionesDto> => {
    const url = withQueryParams(`${API_ENDPOINTS_GENERAL.AUDITORIA}/filtros`, params);
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<AuditoriaFiltrosOpcionesDto>);
  },
};

