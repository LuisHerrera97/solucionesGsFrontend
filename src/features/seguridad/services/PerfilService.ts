import { API_ENDPOINTS_SEGURIDAD } from '../../../core/config/apiEndpoints';
import { ApiService } from '../../../core/http/apiService';
import type { Guid, PerfilDto } from '../types/types';
import { withRouteParams } from '../../../shared/utils/url';
import type { ApiResponse } from '../../../core/http/types';
import { unwrapApiResponse } from '../../../core/http/unwrapApiResponse';

export const PerfilService = {
  getAll: async (): Promise<PerfilDto[]> => {
    const response = await ApiService.get({ url: API_ENDPOINTS_SEGURIDAD.PERFILES });
    return unwrapApiResponse(response.data as ApiResponse<PerfilDto[]>);
  },
  create: async (payload: PerfilDto): Promise<PerfilDto> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.PERFILES, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<PerfilDto>);
  },
  update: async (idPerfil: Guid, payload: PerfilDto): Promise<PerfilDto> => {
    const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.PERFILES}/{idPerfil}`, { idPerfil });
    const response = await ApiService.put({ url, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<PerfilDto>);
  },
  remove: async (idPerfil: Guid): Promise<void> => {
    const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.PERFILES}/{idPerfil}`, { idPerfil });
    const response = await ApiService.delete({ url });
    unwrapApiResponse(response.data as ApiResponse<boolean>);
  },
};
