import StatusPanel from '../../../../shared/components/StatusPanel';
import { CreditoCard } from '../components/CreditoCard';
import { CreditosHeader } from '../components/CreditosHeader';
import { CobranzaZonaFiltroPanel } from '../../../../shared/cobranza/CobranzaZonaFiltroPanel';
import { useCreditosPage } from '../hooks/useCreditosPage';
import { PagoFichaModal } from '../../../../shared/creditos/PagoFichaModal';

const Creditos = () => {
  const {
    navigate,
    user,
    puedePagarFichasVigentesListado,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    zonaCtx,
    creditosQuery,
    pagoFichaHook,
    creditos,
    canGoNext,
  } = useCreditosPage();

  return (
    <div className="space-y-6">
      <CreditosHeader 
        onNuevo={() => navigate('/creditos/nuevo')} 
        searchTerm={searchTerm} 
        onSearchTermChange={(val) => {
          setSearchTerm(val);
          setPage(1); // reset to page 1 on search
        }} 
      />

      <CobranzaZonaFiltroPanel
        user={user}
        puedeElegirZona={zonaCtx.puedeElegirZona}
        zonas={zonaCtx.zonas}
        zonasLoading={zonaCtx.zonasLoading}
        zonaFiltro={zonaCtx.zonaFiltro}
        onChangeZona={(val) => {
          zonaCtx.setZonaFiltro(val);
          setPage(1);
        }}
        esZonaDelUsuario={zonaCtx.esZonaDelUsuario}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="text-sm text-textMuted">
          Página <span className="font-semibold text-textDark">{page}</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-light" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Anterior
          </button>
          <button type="button" className="btn btn-light" onClick={() => setPage((p) => p + 1)} disabled={!canGoNext}>
            Siguiente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {creditosQuery.isLoading && <StatusPanel variant="loading" title="Cargando créditos" message="Consultando el servidor..." />}
        {creditosQuery.isError && <StatusPanel variant="error" title="No fue posible cargar créditos" message="Intenta nuevamente." />}
        {creditos.map((credito) => (
          <CreditoCard
            key={credito.id}
            credito={credito}
            onVerDetalles={() => navigate(`/creditos/${credito.id}`)}
            onPagarFichaVigente={
              puedePagarFichasVigentesListado
                ? () => pagoFichaHook.abrirModalPagoFicha(credito.id, credito.folio, 'vigente')
                : undefined
            }
            onPagarFichaAtrasada={
              puedePagarFichasVigentesListado
                ? () => pagoFichaHook.abrirModalPagoFicha(credito.id, credito.folio, 'atrasada')
                : undefined
            }
          />
        ))}
        {!creditosQuery.isLoading && !creditosQuery.isError && creditos.length === 0 && (
          <StatusPanel variant="empty" title="Sin créditos" message="Crea un crédito para empezar." />
        )}
      </div>

      <PagoFichaModal pagoHook={pagoFichaHook} titleId="creditos-pago-ficha-modal-titulo" />
    </div>
  );
};

export default Creditos;
