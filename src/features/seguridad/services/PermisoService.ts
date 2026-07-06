import { API_ENDPOINTS_SEGURIDAD } from '../../../core/config/apiEndpoints';
import { ApiService } from '../../../core/http/apiService';
import { withRouteParams } from '../../../shared/utils/url';
import type { AsignarPermisosRequestDto, Guid, ModuloDto } from '../types/types';
import type { ApiResponse } from '../../../core/http/types';
import { unwrapApiResponse } from '../../../core/http/unwrapApiResponse';

export const PermisoService = {
  getMenu: async (idPerfil: Guid): Promise<ModuloDto[]> => {
    const url = withRouteParams(API_ENDPOINTS_SEGURIDAD.PERFIL_MENU, { idPerfil });
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<ModuloDto[]>);
  },
  getPermisos: async (idPerfil: Guid): Promise<AsignarPermisosRequestDto> => {
    const url = withRouteParams(API_ENDPOINTS_SEGURIDAD.PERFIL_PERMISOS_GET, { idPerfil });
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<AsignarPermisosRequestDto>);
  },
  setPermisos: async (payload: AsignarPermisosRequestDto): Promise<void> => {
    const url = withRouteParams(API_ENDPOINTS_SEGURIDAD.PERFIL_PERMISOS_POST, { idPerfil: payload.idPerfil });
    const response = await ApiService.post({ url, data: payload });
    unwrapApiResponse(response.data as ApiResponse<boolean>);
  },
};
