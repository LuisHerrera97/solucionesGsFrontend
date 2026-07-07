import { API_ENDPOINTS_SEGURIDAD } from '../../core/config/apiEndpoints';
import { ApiService } from '../../core/http/apiService';
import type { ApiResponse } from '../../core/http/types';
import { unwrapApiResponse } from '../../core/http/unwrapApiResponse';
import { withQueryParams, withRouteParams } from '../../shared/utils/url';
import type {
  AsignarPermisosRequestDto,
  BotonDto,
  Guid,
  ModuloDto,
  PaginaDto,
  PerfilDto,
  ResetPasswordAdminRequestDto,
  UsuarioCrearDto,
  UsuarioDto,
} from './types/types';

// Usuarios
export const obtenerUsuarios = async (): Promise<UsuarioDto[]> => {
  const response = await ApiService.get({ url: API_ENDPOINTS_SEGURIDAD.USUARIOS });
  return unwrapApiResponse(response.data as ApiResponse<UsuarioDto[]>);
};

export const obtenerUsuarioPorId = async (id: Guid): Promise<UsuarioDto> => {
  const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.USUARIOS}/{id}`, { id });
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<UsuarioDto>);
};

export const crearUsuario = async (payload: UsuarioCrearDto): Promise<UsuarioDto> => {
  const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.USUARIOS, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<UsuarioDto>);
};

export const actualizarUsuario = async (id: Guid, payload: UsuarioDto): Promise<UsuarioDto> => {
  const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.USUARIOS}/{id}`, { id });
  const response = await ApiService.put({ url, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<UsuarioDto>);
};

export const eliminarUsuario = async (id: Guid): Promise<void> => {
  const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.USUARIOS}/{id}`, { id });
  const response = await ApiService.delete({ url });
  unwrapApiResponse(response.data as ApiResponse<boolean>);
};

export const restablecerContrasenaUsuario = async (id: Guid, payload: ResetPasswordAdminRequestDto): Promise<void> => {
  const url = withRouteParams(API_ENDPOINTS_SEGURIDAD.USUARIOS_RESET_PASSWORD, { id });
  const response = await ApiService.post({ url, data: payload });
  unwrapApiResponse(response.data as ApiResponse<boolean>);
};

// Perfiles
export const obtenerPerfiles = async (): Promise<PerfilDto[]> => {
  const response = await ApiService.get({ url: API_ENDPOINTS_SEGURIDAD.PERFILES });
  return unwrapApiResponse(response.data as ApiResponse<PerfilDto[]>);
};

export const crearPerfil = async (payload: PerfilDto): Promise<PerfilDto> => {
  const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.PERFILES, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<PerfilDto>);
};

export const actualizarPerfil = async (idPerfil: Guid, payload: PerfilDto): Promise<PerfilDto> => {
  const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.PERFILES}/{idPerfil}`, { idPerfil });
  const response = await ApiService.put({ url, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<PerfilDto>);
};

export const eliminarPerfil = async (idPerfil: Guid): Promise<void> => {
  const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.PERFILES}/{idPerfil}`, { idPerfil });
  const response = await ApiService.delete({ url });
  unwrapApiResponse(response.data as ApiResponse<boolean>);
};

// Permisos y menú
export const obtenerMenu = async (idPerfil: Guid): Promise<ModuloDto[]> => {
  const url = withRouteParams(API_ENDPOINTS_SEGURIDAD.PERFIL_MENU, { idPerfil });
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<ModuloDto[]>);
};

export const obtenerPermisos = async (idPerfil: Guid): Promise<AsignarPermisosRequestDto> => {
  const url = withRouteParams(API_ENDPOINTS_SEGURIDAD.PERFIL_PERMISOS_GET, { idPerfil });
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<AsignarPermisosRequestDto>);
};

export const guardarPermisos = async (payload: AsignarPermisosRequestDto): Promise<void> => {
  const url = withRouteParams(API_ENDPOINTS_SEGURIDAD.PERFIL_PERMISOS_POST, { idPerfil: payload.idPerfil });
  const response = await ApiService.post({ url, data: payload });
  unwrapApiResponse(response.data as ApiResponse<boolean>);
};

// Módulos
export const obtenerModulos = async (): Promise<ModuloDto[]> => {
  const response = await ApiService.get({ url: API_ENDPOINTS_SEGURIDAD.MODULOS });
  return unwrapApiResponse(response.data as ApiResponse<ModuloDto[]>);
};

export const crearModulo = async (payload: ModuloDto): Promise<ModuloDto> => {
  const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.MODULOS, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<ModuloDto>);
};

export const actualizarModulo = async (idModulo: Guid, payload: ModuloDto): Promise<ModuloDto> => {
  const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.MODULOS}/{idModulo}`, { idModulo });
  const response = await ApiService.put({ url, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<ModuloDto>);
};

export const eliminarModulo = async (idModulo: Guid): Promise<void> => {
  const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.MODULOS}/{idModulo}`, { idModulo });
  const response = await ApiService.delete({ url });
  unwrapApiResponse(response.data as ApiResponse<boolean>);
};

// Páginas
export const obtenerPaginas = async (params?: { page?: number; pageSize?: number }): Promise<PaginaDto[]> => {
  const url = withQueryParams(API_ENDPOINTS_SEGURIDAD.PAGINAS, params ?? {});
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<PaginaDto[]>);
};

export const crearPagina = async (payload: PaginaDto): Promise<PaginaDto> => {
  const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.PAGINAS, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<PaginaDto>);
};

export const actualizarPagina = async (idPagina: Guid, payload: PaginaDto): Promise<PaginaDto> => {
  const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.PAGINAS}/{idPagina}`, { idPagina });
  const response = await ApiService.put({ url, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<PaginaDto>);
};

export const eliminarPagina = async (idPagina: Guid): Promise<void> => {
  const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.PAGINAS}/{idPagina}`, { idPagina });
  const response = await ApiService.delete({ url });
  unwrapApiResponse(response.data as ApiResponse<boolean>);
};

// Botones
export const obtenerBotones = async (params?: { page?: number; pageSize?: number }): Promise<BotonDto[]> => {
  const url = withQueryParams(API_ENDPOINTS_SEGURIDAD.BOTONES, params ?? {});
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<BotonDto[]>);
};

export const crearBoton = async (payload: BotonDto): Promise<BotonDto> => {
  const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.BOTONES, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<BotonDto>);
};

export const actualizarBoton = async (idBoton: Guid, payload: BotonDto): Promise<BotonDto> => {
  const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.BOTONES}/{idBoton}`, { idBoton });
  const response = await ApiService.put({ url, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<BotonDto>);
};

export const eliminarBoton = async (idBoton: Guid): Promise<void> => {
  const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.BOTONES}/{idBoton}`, { idBoton });
  const response = await ApiService.delete({ url });
  unwrapApiResponse(response.data as ApiResponse<boolean>);
};
