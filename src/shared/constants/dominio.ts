export const TipoCredito = {
  DIARIO: 'diario',
  SEMANAL: 'semanal',
  MENSUAL: 'mensual',
} as const;

export type TipoCredito = (typeof TipoCredito)[keyof typeof TipoCredito];

export const MedioPago = {
  EFECTIVO: 'Efectivo',
  TRANSFERENCIA: 'Transferencia',
  MIXTO: 'Mixto',
} as const;

export type MedioPago = (typeof MedioPago)[keyof typeof MedioPago];

export const EstatusCliente = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
  REVISION: 'En Revisión',
} as const;

export type EstatusCliente = (typeof EstatusCliente)[keyof typeof EstatusCliente];
