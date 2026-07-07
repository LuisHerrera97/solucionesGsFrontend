import { useState } from 'react';
import { usePagoFicha, type PagoFichaResult } from '../../../../shared/creditos/usePagoFicha';
import { printTicket } from '../../../../shared/ticket/printTicket';
import type { Cliente } from '../../types/types';

export const useClientesActions = (clienteSeleccionado: Cliente | null, onPagoSuccess?: () => void) => {
  const [ticketPagoFicha, setTicketPagoFicha] = useState<PagoFichaResult | null>(null);

  const pagoFichaHook = usePagoFicha((result) => {
    setTicketPagoFicha(result);
    onPagoSuccess?.();
  });

  const handleImprimirTicket = () => {
    if (!ticketPagoFicha) return;
    const now = new Date();
    printTicket({
      fecha: now.toLocaleDateString(),
      hora: now.toLocaleTimeString(),
      cliente: `${clienteSeleccionado?.nombre ?? ''} ${clienteSeleccionado?.apellido ?? ''}`.trim() || '-',
      folio: ticketPagoFicha.folio,
      concepto: ticketPagoFicha.tipo === 'vigente' ? 'Pago ficha vigente' : 'Pago ficha atrasada',
      ficha: `#${ticketPagoFicha.numeroFicha}`,
      total: ticketPagoFicha.total,
    });
  };

  return {
    ticketPagoFicha,
    setTicketPagoFicha,
    pagoFichaHook,
    handleImprimirTicket,
  };
};
