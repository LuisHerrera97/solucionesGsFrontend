import { API_ENDPOINTS_SEGURIDAD } from '../../../core/config/apiEndpoints';
import { ApiService } from '../../../core/http/apiService';
import type {
  AutenticacionRequestDto,
  AutenticacionResponseDto,
  CambiarPasswordRequestDto,
  RefreshTokenRequestDto,
} from '../../seguridad/types/types';
import type { ApiResponse } from '../../../core/http/types';
import { unwrapApiResponse } from '../../../core/http/unwrapApiResponse';

export const AuthService = {
  login: async (payload: AutenticacionRequestDto): Promise<AutenticacionResponseDto> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.LOGIN, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<AutenticacionResponseDto>);
  },
  refresh: async (payload: RefreshTokenRequestDto): Promise<AutenticacionResponseDto> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.REFRESH, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<AutenticacionResponseDto>);
  },
  cambiarPassword: async (payload: CambiarPasswordRequestDto): Promise<void> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.CAMBIAR_PASSWORD, data: payload });
    unwrapApiResponse(response.data as ApiResponse<unknown>);
  },
};
