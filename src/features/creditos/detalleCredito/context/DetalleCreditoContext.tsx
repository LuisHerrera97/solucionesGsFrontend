import React from 'react';
import { DetalleCreditoContext } from '../hooks/useDetalleCreditoContext';
import { useDetalleCreditoPage } from '../hooks/useDetalleCreditoPage';

export const DetalleCreditoProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useDetalleCreditoPage();
  return <DetalleCreditoContext.Provider value={value}>{children}</DetalleCreditoContext.Provider>;
};
