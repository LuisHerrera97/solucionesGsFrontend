import type { AutenticacionResponseDto, UsuarioDto } from '../../domain/seguridad/types';
import { REFRESH_KEY, TOKEN_KEY, USER_KEY } from './storageKeys';

export const sessionStorage = {
  saveLogin: (data: AutenticacionResponseDto) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(REFRESH_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  getUser: (): UsuarioDto | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UsuarioDto;
    } catch {
      return null;
    }
  },
};
