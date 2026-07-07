import { API_ENDPOINTS_CREDITOS } from '../../core/config/apiEndpoints';
import { ApiService } from '../../core/http/apiService';
import type { ApiResponse } from '../../core/http/types';
import { unwrapApiResponse } from '../../core/http/unwrapApiResponse';
import { withQueryParams, withRouteParams } from '../../shared/utils/url';
import type { MovimientoCajaCobranzaDto, MovimientoCajaDto } from './types/caja';
import type { ClienteCreditosDto } from './types/clienteCreditos';
import type {
  AbonarFichaCreditoRequest,
  Cliente,
  ClientesListado,
  CreditoApi,
  DashboardResumenDto,
  PenalizarFichaCreditoRequest,
} from './types/types';

export type { CreditoApi } from './types/types';

// Clientes
export const obtenerClientes = async (params?: {
  page?: number;
  pageSize?: number;
  buscar?: string;
  zonaId?: string;
}): Promise<ClientesListado> => {
  const url = withQueryParams(API_ENDPOINTS_CREDITOS.CLIENTES, params ?? {});
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<ClientesListado>);
};

export const obtenerCreditosDeCliente = async (clienteId: string): Promise<ClienteCreditosDto> => {
  const url = withRouteParams(API_ENDPOINTS_CREDITOS.CLIENTE_CREDITOS, { id: clienteId });
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<ClienteCreditosDto>);
};

export const crearCliente = async (payload: Omit<Cliente, 'id'>): Promise<Cliente> => {
  const response = await ApiService.post({ url: API_ENDPOINTS_CREDITOS.CLIENTES, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<Cliente>);
};

export const actualizarCliente = async (id: string, payload: Omit<Cliente, 'id'>): Promise<Cliente> => {
  const url = withRouteParams(API_ENDPOINTS_CREDITOS.CLIENTE_BY_ID, { id });
  const response = await ApiService.put({ url, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<Cliente>);
};

export const eliminarCliente = async (id: string): Promise<void> => {
  const url = withRouteParams(API_ENDPOINTS_CREDITOS.CLIENTE_BY_ID, { id });
  const response = await ApiService.delete({ url });
  unwrapApiResponse(response.data as ApiResponse<boolean>);
};

// Créditos
export const obtenerCreditos = async (params?: {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  zonaId?: string;
}): Promise<CreditoApi[]> => {
  const url = withQueryParams(API_ENDPOINTS_CREDITOS.CREDITOS, params ?? {});
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<CreditoApi[]>);
};

export const obtenerCreditoPorId = async (id: string): Promise<CreditoApi> => {
  const url = withRouteParams(API_ENDPOINTS_CREDITOS.CREDITO_BY_ID, { id });
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<CreditoApi>);
};

export const obtenerMovimientosCredito = async (id: string): Promise<MovimientoCajaDto[]> => {
  const url = withRouteParams(API_ENDPOINTS_CREDITOS.CREDITO_MOVIMIENTOS, { id });
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<MovimientoCajaDto[]>);
};

export const crearCredito = async (payload: {
  clienteId: string;
  monto: number;
  plazo: number;
  tipo: 'diario' | 'semanal' | 'mensual';
  permitirDomingo?: boolean;
  aplicarFeriados?: boolean;
  tasaManual?: number;
  observacion?: string;
}): Promise<CreditoApi> => {
  const response = await ApiService.post({ url: API_ENDPOINTS_CREDITOS.CREDITOS, data: payload });
  return unwrapApiResponse(response.data as ApiResponse<CreditoApi>);
};

export const abonarFicha = async (payload: AbonarFichaCreditoRequest): Promise<CreditoApi> => {
  const url = withRouteParams(API_ENDPOINTS_CREDITOS.ABONO_FICHA, {
    creditoId: payload.creditoId,
    numeroFicha: String(payload.numeroFicha),
  });
  const response = await ApiService.post({
    url,
    data: {
      idempotencyKey: payload.idempotencyKey,
      montoAbono: payload.montoAbono,
      medio: payload.medio,
      montoEfectivo: payload.montoEfectivo,
      montoTransferencia: payload.montoTransferencia,
    },
  });
  return unwrapApiResponse(response.data as ApiResponse<CreditoApi>);
};

export const abonarFichasVigentes = async (payload: {
  creditoId: string;
  cantidadFichas: number;
  montoAbono: number;
  medio: AbonarFichaCreditoRequest['medio'];
  montoEfectivo?: number;
  montoTransferencia?: number;
  idempotencyKey?: string;
}): Promise<CreditoApi> => {
  const url = withRouteParams(API_ENDPOINTS_CREDITOS.ABONO_FICHAS_VIGENTES, { creditoId: payload.creditoId });
  const response = await ApiService.post({
    url,
    data: {
      idempotencyKey: payload.idempotencyKey,
      cantidadFichas: payload.cantidadFichas,
      montoAbono: payload.montoAbono,
      medio: payload.medio,
      montoEfectivo: payload.montoEfectivo,
      montoTransferencia: payload.montoTransferencia,
    },
  });
  return unwrapApiResponse(response.data as ApiResponse<CreditoApi>);
};

export const penalizarFicha = async (payload: PenalizarFichaCreditoRequest): Promise<CreditoApi> => {
  const url = withRouteParams(API_ENDPOINTS_CREDITOS.MULTA_FICHA, {
    creditoId: payload.creditoId,
    numeroFicha: String(payload.numeroFicha),
  });
  const response = await ApiService.post({
    url,
    data: {
      monto: payload.monto,
      idempotencyKey: payload.idempotencyKey,
    },
  });
  return unwrapApiResponse(response.data as ApiResponse<CreditoApi>);
};

export const reversarMovimiento = async (payload: { creditoId: string; movimientoId: string }): Promise<CreditoApi> => {
  const url = withRouteParams(API_ENDPOINTS_CREDITOS.REVERSA_MOVIMIENTO, {
    creditoId: payload.creditoId,
    movimientoId: payload.movimientoId,
  });
  const response = await ApiService.post({ url });
  return unwrapApiResponse(response.data as ApiResponse<CreditoApi>);
};

export const reestructurarCredito = async (payload: {
  creditoId: string;
  nuevoMonto: number;
  nuevoPlazo: number;
  tipo: 'diario' | 'semanal' | 'mensual';
}): Promise<CreditoApi> => {
  const url = withRouteParams(API_ENDPOINTS_CREDITOS.REESTRUCTURAR, { creditoId: payload.creditoId });
  const response = await ApiService.put({
    url,
    data: {
      creditoId: payload.creditoId,
      nuevoMonto: payload.nuevoMonto,
      nuevoPlazo: payload.nuevoPlazo,
      tipo: payload.tipo,
    },
  });
  return unwrapApiResponse(response.data as ApiResponse<CreditoApi>);
};

export const condonarInteres = async (payload: { creditoId: string; numeroFicha: number }): Promise<string> => {
  const url = withRouteParams(API_ENDPOINTS_CREDITOS.CONDONAR_INTERES, {
    creditoId: payload.creditoId,
    numeroFicha: String(payload.numeroFicha),
  });
  const response = await ApiService.post({ url });
  return unwrapApiResponse(response.data as ApiResponse<string>);
};

export const condonarInteresMonto = async (payload: { creditoId: string; monto: number }): Promise<string> => {
  const url = withRouteParams(API_ENDPOINTS_CREDITOS.CONDONAR_INTERES_MONTO, { creditoId: payload.creditoId });
  const response = await ApiService.post({ url, data: { monto: payload.monto } });
  return unwrapApiResponse(response.data as ApiResponse<string>);
};

export const actualizarObservacion = async (payload: { creditoId: string; observacion: string }): Promise<string> => {
  const url = withRouteParams(API_ENDPOINTS_CREDITOS.ACTUALIZAR_OBSERVACION, { creditoId: payload.creditoId });
  const response = await ApiService.put({ url, data: { observacion: payload.observacion } });
  return unwrapApiResponse(response.data as ApiResponse<string>);
};

export const aplicarMora = async (): Promise<number> => {
  const response = await ApiService.post({ url: API_ENDPOINTS_CREDITOS.APLICAR_MORA });
  return unwrapApiResponse(response.data as ApiResponse<number>);
};

// Dashboard
export const obtenerDashboardResumen = async (params?: { zonaId?: string }): Promise<DashboardResumenDto> => {
  const url = withQueryParams(API_ENDPOINTS_CREDITOS.DASHBOARD_RESUMEN, params ?? {});
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<DashboardResumenDto>);
};

export const obtenerMovimientosEnRango = async (params: {
  fechaDesde: string;
  fechaHasta: string;
  zonaId?: string;
  cobradorId?: string;
  creditoFolio?: string;
  clienteNombre?: string;
}): Promise<MovimientoCajaDto[]> => {
  const url = withQueryParams(API_ENDPOINTS_CREDITOS.DASHBOARD_MOVIMIENTOS, params);
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<MovimientoCajaDto[]>);
};

export const obtenerMovimientosCobranzaEnRango = async (params: {
  fechaDesde: string;
  fechaHasta: string;
  zonaId?: string;
  cobradorId?: string;
  creditoFolio?: string;
  clienteNombre?: string;
}): Promise<MovimientoCajaCobranzaDto[]> => {
  const url = withQueryParams(API_ENDPOINTS_CREDITOS.DASHBOARD_MOVIMIENTOS_COBRANZA, params);
  const response = await ApiService.get({ url });
  return unwrapApiResponse(response.data as ApiResponse<MovimientoCajaCobranzaDto[]>);
};
