import { API_ENDPOINTS_COBRANZA } from '../../core/config/apiEndpoints';
import { ApiService } from '../../core/http/apiService';
import type { ApiResponse } from '../../core/http/types';
import { unwrapApiResponse } from '../../core/http/unwrapApiResponse';
import { withQueryParams } from '../../shared/utils/url';
import type { MovimientoCobranzaDto } from './types/cobranza';
import type { PendientesListadoDto } from './types/pendientes';

export const obtenerCobranza = async (params: {
  fechaInicio?: string;
  fechaFin?: string;
  busqueda?: string;
  zonaId?: string;
}): Promise<MovimientoCobranzaDto[]> => {
  const url = withQueryParams(API_ENDPOINTS_COBRANZA.COBRANZA, params);
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<MovimientoCobranzaDto[]>);
};

export const obtenerPendientes = async (params: {
  busqueda?: string;
  page?: number;
  pageSize?: number;
  zonaId?: string;
}): Promise<PendientesListadoDto> => {
  const url = withQueryParams(API_ENDPOINTS_COBRANZA.PENDIENTES, {
    busqueda: params.busqueda,
    page: params.page,
    pageSize: params.pageSize,
    zonaId: params.zonaId,
  });
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<PendientesListadoDto>);
};
