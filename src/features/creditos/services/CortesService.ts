import { API_ENDPOINTS_CREDITOS } from '../../../core/config/apiEndpoints';
import { ApiService } from '../../../core/http/apiService';
import { withQueryParams } from '../../../shared/utils/url';
import type { CorteCajaDto } from '../types/cortes';
import type { ApiResponse } from '../../../core/http/types';
import { unwrapApiResponse } from '../../../core/http/unwrapApiResponse';

export const CortesService = {
  getAll: async (params: { fechaInicio?: string; fechaFin?: string }): Promise<CorteCajaDto[]> => {
    const url = withQueryParams(API_ENDPOINTS_CREDITOS.CORTES, params);
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<CorteCajaDto[]>);
  },
};
