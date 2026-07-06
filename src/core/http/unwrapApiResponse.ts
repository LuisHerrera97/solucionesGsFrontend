import type { ApiResponse } from './types';

export const unwrapApiResponse = <T>(data: ApiResponse<T>): T => {
  if (data.hasError) {
    throw new Error(data.message || 'Ocurrió un error al procesar la solicitud');
  }
  return data.result;
};
