import { API_ENDPOINTS_GENERAL } from '../../../core/config/apiEndpoints';
import { ApiService } from '../../../core/http/apiService';
import type { ApiResponse } from '../../../core/http/types';
import { unwrapApiResponse } from '../../../core/http/unwrapApiResponse';
import type { FeriadoDto } from '../types/feriados';
import { withRouteParams } from '../../../shared/utils/url';

export const FeriadosService = {
  getAll: async (): Promise<FeriadoDto[]> => {
    const response = await ApiService.get({ url: API_ENDPOINTS_GENERAL.FERIADOS });
    return unwrapApiResponse(response.data as ApiResponse<FeriadoDto[]>);
  },
  create: async (payload: Pick<FeriadoDto, 'fecha' | 'nombre' | 'activo'>): Promise<FeriadoDto> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_GENERAL.FERIADOS, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<FeriadoDto>);
  },
  update: async (id: string, payload: Pick<FeriadoDto, 'fecha' | 'nombre' | 'activo'>): Promise<FeriadoDto> => {
    const url = withRouteParams(`${API_ENDPOINTS_GENERAL.FERIADOS}/{id}`, { id });
    const response = await ApiService.put({ url, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<FeriadoDto>);
  },
  remove: async (id: string): Promise<void> => {
    const url = withRouteParams(`${API_ENDPOINTS_GENERAL.FERIADOS}/{id}`, { id });
    const response = await ApiService.delete({ url });
    unwrapApiResponse(response.data as ApiResponse<unknown>);
  },
};

