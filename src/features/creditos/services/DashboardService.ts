import { API_ENDPOINTS_CREDITOS } from '../../../core/config/apiEndpoints';
import { ApiService } from '../../../core/http/apiService';
import type { DashboardResumenDto } from '../types/types';
import type { MovimientoCajaCobranzaDto, MovimientoCajaDto } from '../types/caja';
import type { ApiResponse } from '../../../core/http/types';
import { unwrapApiResponse } from '../../../core/http/unwrapApiResponse';
import { withQueryParams } from '../../../shared/utils/url';

export class DashboardService {
  static async getResumen(params?: { zonaId?: string }): Promise<DashboardResumenDto> {
    const url = withQueryParams(API_ENDPOINTS_CREDITOS.DASHBOARD_RESUMEN, params ?? {});
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<DashboardResumenDto>);
  }

  static async getMovimientosEnRango(params: {
    fechaDesde: string;
    fechaHasta: string;
    zonaId?: string;
    cobradorId?: string;
    creditoFolio?: string;
    clienteNombre?: string;
  }): Promise<MovimientoCajaDto[]> {
    const url = withQueryParams(API_ENDPOINTS_CREDITOS.DASHBOARD_MOVIMIENTOS, params);
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<MovimientoCajaDto[]>);
  }

  static async getMovimientosCobranzaEnRango(params: {
    fechaDesde: string;
    fechaHasta: string;
    zonaId?: string;
    cobradorId?: string;
    creditoFolio?: string;
    clienteNombre?: string;
  }): Promise<MovimientoCajaCobranzaDto[]> {
    const url = withQueryParams(API_ENDPOINTS_CREDITOS.DASHBOARD_MOVIMIENTOS_COBRANZA, params);
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<MovimientoCajaCobranzaDto[]>);
  }
}
