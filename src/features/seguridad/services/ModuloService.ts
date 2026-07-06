import { API_ENDPOINTS_SEGURIDAD } from '../../../core/config/apiEndpoints';
import { ApiService } from '../../../core/http/apiService';
import { withRouteParams } from '../../../shared/utils/url';
import type { Guid, ModuloDto } from '../types/types';
import type { ApiResponse } from '../../../core/http/types';
import { unwrapApiResponse } from '../../../core/http/unwrapApiResponse';

export const ModuloService = {
  getAll: async (): Promise<ModuloDto[]> => {
    const response = await ApiService.get({ url: API_ENDPOINTS_SEGURIDAD.MODULOS });
    return unwrapApiResponse(response.data as ApiResponse<ModuloDto[]>);
  },
  create: async (payload: ModuloDto): Promise<ModuloDto> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.MODULOS, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<ModuloDto>);
  },
  update: async (idModulo: Guid, payload: ModuloDto): Promise<ModuloDto> => {
    const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.MODULOS}/{idModulo}`, { idModulo });
    const response = await ApiService.put({ url, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<ModuloDto>);
  },
  remove: async (idModulo: Guid): Promise<void> => {
    const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.MODULOS}/{idModulo}`, { idModulo });
    const response = await ApiService.delete({ url });
    unwrapApiResponse(response.data as ApiResponse<boolean>);
  },
};
