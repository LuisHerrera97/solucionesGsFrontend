import { API_ENDPOINTS_CREDITOS } from '../../../core/config/apiEndpoints';
import { ApiService } from '../../../core/http/apiService';
import type { Cliente, ClientesListado } from '../types/types';
import type { ApiResponse } from '../../../core/http/types';
import { unwrapApiResponse } from '../../../core/http/unwrapApiResponse';
import { withQueryParams, withRouteParams } from '../../../shared/utils/url';
import type { ClienteCreditosDto } from '../types/clienteCreditos';

export const ClientesService = {
  getAll: async (params?: { page?: number; pageSize?: number; buscar?: string; zonaId?: string }): Promise<ClientesListado> => {
    const url = withQueryParams(API_ENDPOINTS_CREDITOS.CLIENTES, params ?? {});
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<ClientesListado>);
  },
  getCreditos: async (clienteId: string): Promise<ClienteCreditosDto> => {
    const url = withRouteParams(API_ENDPOINTS_CREDITOS.CLIENTE_CREDITOS, { id: clienteId });
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<ClienteCreditosDto>);
  },
  create: async (payload: Omit<Cliente, 'id'>): Promise<Cliente> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_CREDITOS.CLIENTES, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<Cliente>);
  },
  update: async (id: string, payload: Omit<Cliente, 'id'>): Promise<Cliente> => {
    const url = withRouteParams(API_ENDPOINTS_CREDITOS.CLIENTE_BY_ID, { id });
    const response = await ApiService.put({ url, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<Cliente>);
  },
  delete: async (id: string): Promise<void> => {
    const url = withRouteParams(API_ENDPOINTS_CREDITOS.CLIENTE_BY_ID, { id });
    const response = await ApiService.delete({ url });
    unwrapApiResponse(response.data as ApiResponse<boolean>);
  },
};
