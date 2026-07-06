import { API_ENDPOINTS_GENERAL } from '../../../core/config/apiEndpoints';
import { ApiService } from '../../../core/http/apiService';
import type { ConfiguracionSistemaDto } from '../types/types';
import type { ApiResponse } from '../../../core/http/types';
import { unwrapApiResponse } from '../../../core/http/unwrapApiResponse';

export const ConfiguracionSistemaService = {
  get: async (): Promise<ConfiguracionSistemaDto> => {
    const response = await ApiService.get({ url: API_ENDPOINTS_GENERAL.CONFIGURACION });
    return unwrapApiResponse(response.data as ApiResponse<ConfiguracionSistemaDto>);
  },
  update: async (payload: ConfiguracionSistemaDto): Promise<ConfiguracionSistemaDto> => {
    const response = await ApiService.put({ url: API_ENDPOINTS_GENERAL.CONFIGURACION, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<ConfiguracionSistemaDto>);
  },
};
