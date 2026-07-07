import { API_ENDPOINTS_SEGURIDAD } from '../../core/config/apiEndpoints';
import { ApiService } from '../../core/http/apiService';
import type { ApiResponse } from '../../core/http/types';
import { unwrapApiResponse } from '../../core/http/unwrapApiResponse';
import type {
  AutenticacionRequestDto,
  AutenticacionResponseDto,
  CambiarPasswordRequestDto,
  RefreshTokenRequestDto,
} from '../seguridad/types/types';

export const login = async (payload: AutenticacionRequestDto): Promise<AutenticacionResponseDto> => {
  const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.LOGIN, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<AutenticacionResponseDto>);
};

export const refresh = async (payload: RefreshTokenRequestDto): Promise<AutenticacionResponseDto> => {
  const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.REFRESH, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<AutenticacionResponseDto>);
};

export const cambiarPassword = async (payload: CambiarPasswordRequestDto): Promise<void> => {
  const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.CAMBIAR_PASSWORD, data: payload });
  unwrapApiResponse(response.data as ApiResponse<unknown>);
};
