import type { Credito, Ficha } from '../../features/creditos/types/types';

export const calculateEstadoCuenta = (credito: Credito | undefined) => {
  if (!credito) return null;
  
  const fichas = credito.fichas ?? [];
  const saldoPendiente = credito.total - credito.pagado;
  
  const totalMoraPendiente = fichas.reduce((acc, f) => {
    const moraAcumulada = f.moraAcumulada ?? f.mora ?? 0;
    const moraPagada = f.mora ?? 0;
    return acc + Math.max(0, moraAcumulada - moraPagada);
  }, 0);
  
  const totalMoraGenerada = fichas.reduce((acc, f) => acc + (f.moraAcumulada ?? f.mora ?? 0), 0);
  const totalAbono = fichas.reduce((acc, f) => acc + (f.abono ?? 0), 0);
  const saldoTotal = saldoPendiente + totalMoraPendiente;

  return {
    saldoPendiente,
    totalMoraPendiente,
    totalMoraGenerada,
    totalAbono,
    saldoTotal,
    fichas,
  };
};

export const calculateFichaDetails = (f: Ficha) => {
  const cuotaPendiente = Math.max(0, (f.total ?? 0) - (f.abono ?? 0));
  const moraAcumulada = f.moraAcumulada ?? f.mora ?? 0;
  const moraPendiente = Math.max(0, moraAcumulada - (f.mora ?? 0));
  const totalPendienteFicha = cuotaPendiente + moraPendiente;
  
  return {
    cuotaPendiente,
    moraAcumulada,
    moraPendiente,
    totalPendienteFicha,
  };
};
