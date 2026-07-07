import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog';
import { ElementosSistemaHeader } from '../components/ElementosSistemaHeader';
import { ElementosSistemaModal } from '../components/ElementosSistemaModal';
import { ElementosSistemaTabs } from '../components/ElementosSistemaTabs';
import { BotonForm } from '../components/forms/BotonForm';
import { ModuloForm } from '../components/forms/ModuloForm';
import { PaginaForm } from '../components/forms/PaginaForm';
import { BotonesTable } from '../components/tables/BotonesTable';
import { ModulosTable } from '../components/tables/ModulosTable';
import { PaginasTable } from '../components/tables/PaginasTable';
import { useElementosSistemaPage } from '../hooks/useElementosSistemaPage';

const ElementosSistema = () => {
  const {
    tab,
    setTab,
    modulosQuery,
    paginasQuery,
    botonesQuery,
    modal,
    setModal,
    abrirNuevo,
    titulo,
    ordenadoModulos,
    ordenadoPaginas,
    ordenadoBotones,
    confirmDelete,
    setConfirmDelete,
    busy,
    handleConfirmDelete,
    handleSubmitModulo,
    handleSubmitPagina,
    handleSubmitBoton,
  } = useElementosSistemaPage();

  return (
    <div className="space-y-6">
      <ElementosSistemaHeader onNuevo={abrirNuevo} disabled={busy} />
      <ElementosSistemaTabs tab={tab} onChange={setTab} />

      {tab === 'modulos' && (
        <ModulosTable
          modulos={ordenadoModulos}
          isLoading={modulosQuery.isLoading}
          isError={modulosQuery.isError}
          onEditar={(m) => setModal({ tipo: 'modulo', mode: 'edit', item: m })}
          onEliminar={(m) => setConfirmDelete({ tipo: 'modulo', id: m.id, nombre: m.nombre })}
        />
      )}

      {tab === 'paginas' && (
        <PaginasTable
          paginas={ordenadoPaginas}
          isLoading={paginasQuery.isLoading}
          isError={paginasQuery.isError}
          onEditar={(p) => setModal({ tipo: 'pagina', mode: 'edit', item: p })}
          onEliminar={(p) => setConfirmDelete({ tipo: 'pagina', id: p.id, nombre: p.nombre })}
        />
      )}

      {tab === 'botones' && (
        <BotonesTable
          botones={ordenadoBotones}
          isLoading={botonesQuery.isLoading}
          isError={botonesQuery.isError}
          onEditar={(b) => setModal({ tipo: 'boton', mode: 'edit', item: b })}
          onEliminar={(b) => setConfirmDelete({ tipo: 'boton', id: b.id, nombre: b.nombre })}
        />
      )}

      <ElementosSistemaModal
        open={Boolean(modal)}
        title={`${modal?.mode === 'create' ? 'Nuevo' : 'Editar'} ${modal?.tipo === 'modulo' ? 'módulo' : modal?.tipo === 'pagina' ? 'página' : 'botón'}`}
        subtitle={titulo}
        onClose={() => setModal(null)}
      >
        {modal?.tipo === 'modulo' && (
          <ModuloForm initial={modal.item} onCancel={() => setModal(null)} onSubmit={handleSubmitModulo} />
        )}
        {modal?.tipo === 'pagina' && (
          <PaginaForm
            modulos={ordenadoModulos}
            initial={modal.item}
            onCancel={() => setModal(null)}
            onSubmit={handleSubmitPagina}
          />
        )}
        {modal?.tipo === 'boton' && (
          <BotonForm
            paginas={ordenadoPaginas}
            initial={modal.item}
            onCancel={() => setModal(null)}
            onSubmit={handleSubmitBoton}
          />
        )}
      </ElementosSistemaModal>

      <ConfirmDialog
        isOpen={Boolean(confirmDelete)}
        title={`Eliminar ${confirmDelete?.tipo === 'modulo' ? 'módulo' : confirmDelete?.tipo === 'pagina' ? 'página' : 'botón'}`}
        message={`¿Estás seguro de eliminar "${confirmDelete?.nombre}"? Esta acción no se puede deshacer.`}
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default ElementosSistema;
