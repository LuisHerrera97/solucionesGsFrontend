import { API_ENDPOINTS_GENERAL } from '../../../core/config/apiEndpoints';
import { ApiService } from '../../../core/http/apiService';
import type { Guid, ZonaCobranzaDto } from '../types/types';
import { withRouteParams } from '../../../shared/utils/url';
import type { ApiResponse } from '../../../core/http/types';
import { unwrapApiResponse } from '../../../core/http/unwrapApiResponse';

export const ZonasCobranzaService = {
  getAll: async (): Promise<ZonaCobranzaDto[]> => {
    const response = await ApiService.get({ url: API_ENDPOINTS_GENERAL.ZONAS });
    return unwrapApiResponse(response.data as ApiResponse<ZonaCobranzaDto[]>);
  },
  create: async (payload: Pick<ZonaCobranzaDto, 'nombre' | 'orden'>): Promise<ZonaCobranzaDto> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_GENERAL.ZONAS, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<ZonaCobranzaDto>);
  },
  update: async (id: Guid, payload: ZonaCobranzaDto): Promise<ZonaCobranzaDto> => {
    const url = withRouteParams(`${API_ENDPOINTS_GENERAL.ZONAS}/{id}`, { id });
    const response = await ApiService.put({ url, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<ZonaCobranzaDto>);
  },
  remove: async (id: Guid): Promise<void> => {
    const url = withRouteParams(`${API_ENDPOINTS_GENERAL.ZONAS}/{id}`, { id });
    const response = await ApiService.delete({ url });
    unwrapApiResponse(response.data as ApiResponse<boolean>);
  },
};
