import { ClientesService } from './services/ClientesService';
import { CreditosService } from './services/CreditosService';
export type { CreditoApi } from './services/CreditosService';
import { DashboardService } from './services/DashboardService';
import { CortesService } from './services/CortesService';

// Clientes functions
export const obtenerClientes = ClientesService.getAll;
export const obtenerCreditosDeCliente = ClientesService.getCreditos;
export const crearCliente = ClientesService.create;
export const actualizarCliente = ClientesService.update;
export const eliminarCliente = ClientesService.delete;

// Creditos functions
export const obtenerCreditos = CreditosService.getAll;
export const obtenerCreditoPorId = CreditosService.getById;
export const obtenerMovimientosCredito = CreditosService.getMovimientos;
export const crearCredito = CreditosService.create;
export const abonarFicha = CreditosService.abonarFicha;
export const abonarFichasVigentes = CreditosService.abonarFichasVigentes;
export const penalizarFicha = CreditosService.penalizarFicha;
export const reversarMovimiento = CreditosService.reversarMovimiento;
export const reestructurarCredito = CreditosService.reestructurar;
export const condonarInteres = CreditosService.condonarInteres;
export const condonarInteresMonto = CreditosService.condonarInteresMonto;
export const actualizarObservacion = CreditosService.actualizarObservacion;
export const aplicarMora = CreditosService.aplicarMora;

// Dashboard functions
export const obtenerDashboardResumen = DashboardService.getResumen;
export const obtenerMovimientosEnRango = DashboardService.getMovimientosEnRango;
export const obtenerMovimientosCobranzaEnRango = DashboardService.getMovimientosCobranzaEnRango;

// Cortes functions
export const obtenerCortes = CortesService.getAll;
