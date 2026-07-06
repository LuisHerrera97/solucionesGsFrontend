import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AutenticacionRequestDto, ModuloDto, UsuarioDto } from '../../seguridad/types/types';
import { obtenerMenu } from '../../seguridad/api';
import { login as apiLogin } from '../api';
import { sessionStorage } from '../utils/sessionStorage';
import { AuthContext } from './authContextStore';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UsuarioDto | null>(() => sessionStorage.getUser());

  const menuQuery = useQuery({
    queryKey: ['auth', 'menu', user?.idPerfil ?? ''],
    queryFn: () => obtenerMenu(user?.idPerfil as string),
    enabled: Boolean(user?.idPerfil),
    staleTime: 5 * 60 * 1000,
  });

  const menu = (menuQuery.data as ModuloDto[] | undefined) ?? null;

  const allowedPaginas = useMemo(() => {
    if (!menu) return [];
    const rutas: string[] = [];
    for (const m of menu) {
      for (const p of m.paginas ?? []) {
        if (p.activo && p.tienePermiso) rutas.push(p.ruta);
      }
    }
    return rutas;
  }, [menu]);

  const allowedBotones = useMemo(() => {
    if (!menu) return new Set<string>();
    const claves = new Set<string>();
    for (const m of menu) {
      for (const p of m.paginas ?? []) {
        for (const b of p.botones ?? []) {
          if (b.activo && b.tienePermiso) claves.add(b.clave);
        }
      }
    }
    return claves;
  }, [menu]);

  const canAccessPath = useCallback(
    (pathname: string) => {
      if (!pathname) return false;
      if (pathname === '/') return true;
      if (allowedPaginas.length === 0) return false;
      return allowedPaginas.some((ruta) => ruta === pathname || pathname.startsWith(`${ruta}/`));
    },
    [allowedPaginas],
  );

  const canBoton = useCallback((botonClave: string) => {
    if (!botonClave) return false;
    return allowedBotones.has(botonClave);
  }, [allowedBotones]);

  const login = useCallback(async (payload: AutenticacionRequestDto) => {
    const result = await apiLogin(payload);
    if (!result.autenticado) {
      throw new Error('Credenciales inválidas');
    }
    sessionStorage.saveLogin(result);
    setUser(result.usuario);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user && (sessionStorage.getToken() || sessionStorage.getRefreshToken())),
      menu,
      isMenuLoading: menuQuery.isLoading,
      canAccessPath,
      canBoton,
      login,
      logout,
    }),
    [user, menu, menuQuery.isLoading, canAccessPath, canBoton, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
