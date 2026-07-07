import { useNavigate } from 'react-router-dom';
import { ModalShell } from '../../../../shared/components/ModalShell';
import StatusPanel from '../../../../shared/components/StatusPanel';
import type { Cliente } from '../../types/types';
import type { useClientesCreditosQuery } from '../hooks/clientesHooks';

type ClienteDetalleModalProps = {
  cliente: Cliente | null;
  onClose: () => void;
  creditosQuery: ReturnType<typeof useClientesCreditosQuery>;
  puedePagarFichas: boolean;
  onPagarFichaVigente: (creditoId: string, folio: string) => void;
  onPagarFichaAtrasada: (creditoId: string, folio: string) => void;
};

export const ClienteDetalleModal = ({
  cliente,
  onClose,
  creditosQuery,
  puedePagarFichas,
  onPagarFichaVigente,
  onPagarFichaAtrasada,
}: ClienteDetalleModalProps) => {
  const navigate = useNavigate();

  if (!cliente) return null;

  return (
    <ModalShell
      open
      onClose={onClose}
      title="Créditos del cliente"
      subtitle={
        <>
          <span className="font-medium text-textDark">
            {cliente.nombre} {cliente.apellido}
          </span>
          <span className="text-slate-400"> · </span>
          <span>
            {cliente.negocio} · {cliente.zona}
          </span>
        </>
      }
      titleId="clientes-creditos-modal-titulo"
    >
      {creditosQuery.isLoading && <StatusPanel variant="loading" title="Cargando créditos" message="Consultando el servidor..." />}
      {creditosQuery.isError && <StatusPanel variant="error" title="No fue posible cargar créditos" message="Intenta nuevamente." />}
      {!creditosQuery.isLoading && !creditosQuery.isError && (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Vigentes</h3>
            {(creditosQuery.data?.vigentes ?? []).length === 0 ? (
              <p className="text-sm text-textMuted">Sin créditos vigentes.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {creditosQuery.data?.vigentes.map((c) => (
                  <div key={c.id} className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 shadow-sm transition hover:border-slate-300 hover:bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-textDark">{c.folio}</div>
                      <span className="badge badge-warning shrink-0">{c.estatus}</span>
                    </div>
                    <div className="mt-2 text-sm text-textMuted">
                      Total: ${c.total.toLocaleString()} · Pagado: ${c.pagado.toLocaleString()}
                    </div>
                    <div className={`mt-3 flex flex-col gap-2 ${puedePagarFichas ? '' : ''}`}>
                      <button
                        type="button"
                        className="btn btn-light w-full"
                        onClick={() => {
                          onClose();
                          navigate(`/creditos/${c.id}`);
                        }}
                      >
                        Ver crédito
                      </button>
                      {puedePagarFichas && (
                        <>
                          <button
                            type="button"
                            className="btn btn-primary w-full"
                            onClick={() => onPagarFichaVigente(c.id, c.folio)}
                          >
                            Pagar ficha vigente
                          </button>
                          <button
                            type="button"
                            className="btn btn-light w-full border-amber-300 text-amber-800 hover:bg-amber-50"
                            onClick={() => onPagarFichaAtrasada(c.id, c.folio)}
                          >
                            Pagar ficha atrasada
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Liquidados</h3>
            {(creditosQuery.data?.liquidados ?? []).length === 0 ? (
              <p className="text-sm text-textMuted">Sin créditos liquidados.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {creditosQuery.data?.liquidados.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 text-left shadow-sm transition hover:border-slate-300 hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-textDark">{c.folio}</div>
                      <span className="badge badge-success shrink-0">{c.estatus}</span>
                    </div>
                    <div className="mt-2 text-sm text-textMuted">
                      Total: ${c.total.toLocaleString()} · Pagado: ${c.pagado.toLocaleString()}
                    </div>
                    <button
                      type="button"
                      className="btn btn-light mt-3 w-full"
                      onClick={() => {
                        onClose();
                        navigate(`/creditos/${c.id}`);
                      }}
                    >
                      Ver crédito
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </ModalShell>
  );
};
