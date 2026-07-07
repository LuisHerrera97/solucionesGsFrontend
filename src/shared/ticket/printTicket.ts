import { buildTicketHtml } from './buildTicketHtml';

export type TicketData = {
  fecha: string;
  hora: string;
  cliente: string;
  folio: string;
  concepto: string;
  ficha: string;
  total: number;
};

export const printTicket = (data: TicketData) => {
  const html = buildTicketHtml(data);
  const win = window.open('', '_blank', 'width=380,height=640');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
};
