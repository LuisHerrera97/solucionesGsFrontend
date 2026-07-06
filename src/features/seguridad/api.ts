import { UsuarioService } from './services/UsuarioService';
import { PerfilService } from './services/PerfilService';
import { PermisoService } from './services/PermisoService';
import { ModuloService } from './services/ModuloService';
import { PaginaService } from './services/PaginaService';
import { BotonService } from './services/BotonService';

// Usuarios
export const obtenerUsuarios = UsuarioService.getAll;
export const obtenerUsuarioPorId = UsuarioService.getById;
export const crearUsuario = UsuarioService.create;
export const actualizarUsuario = UsuarioService.update;
export const eliminarUsuario = UsuarioService.remove;
export const restablecerContrasenaUsuario = UsuarioService.resetPasswordAdmin;

// Perfiles
export const obtenerPerfiles = PerfilService.getAll;
export const crearPerfil = PerfilService.create;
export const actualizarPerfil = PerfilService.update;
export const eliminarPerfil = PerfilService.remove;

// Permisos y Menu
export const obtenerMenu = PermisoService.getMenu;
export const obtenerPermisos = PermisoService.getPermisos;
export const guardarPermisos = PermisoService.setPermisos;

// Modulos
export const obtenerModulos = ModuloService.getAll;
export const crearModulo = ModuloService.create;
export const actualizarModulo = ModuloService.update;
export const eliminarModulo = ModuloService.remove;

// Paginas
export const obtenerPaginas = PaginaService.getAll;
export const crearPagina = PaginaService.create;
export const actualizarPagina = PaginaService.update;
export const eliminarPagina = PaginaService.remove;

// Botones
export const obtenerBotones = BotonService.getAll;
export const crearBoton = BotonService.create;
export const actualizarBoton = BotonService.update;
export const eliminarBoton = BotonService.remove;
