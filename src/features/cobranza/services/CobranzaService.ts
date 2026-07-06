import { API_ENDPOINTS_COBRANZA } from '../../../core/config/apiEndpoints';
import { ApiService } from '../../../core/http/apiService';
import { withQueryParams } from '../../../shared/utils/url';
import type { MovimientoCobranzaDto } from '../types/cobranza';
import type { ApiResponse } from '../../../core/http/types';
import { unwrapApiResponse } from '../../../core/http/unwrapApiResponse';

export const CobranzaService = {
  getAll: async (params: { fechaInicio?: string; fechaFin?: string; busqueda?: string; zonaId?: string }): Promise<MovimientoCobranzaDto[]> => {
    const url = withQueryParams(API_ENDPOINTS_COBRANZA.COBRANZA, params);
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<MovimientoCobranzaDto[]>);
  },
};
