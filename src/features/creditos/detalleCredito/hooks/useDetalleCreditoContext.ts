import { createContext, useContext } from 'react';
import { useDetalleCreditoPage } from './useDetalleCreditoPage';

export type DetalleCreditoContextType = ReturnType<typeof useDetalleCreditoPage>;

export const DetalleCreditoContext = createContext<DetalleCreditoContextType | null>(null);

export const useDetalleCreditoContext = () => {
  const context = useContext(DetalleCreditoContext);
  if (!context) {
    throw new Error('useDetalleCreditoContext debe usarse dentro de un DetalleCreditoProvider');
  }
  return context;
};
