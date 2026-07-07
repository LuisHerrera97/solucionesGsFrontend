import StatusPanel from '../../../../shared/components/StatusPanel';
import { ConfiguracionSistemaForm } from '../components/ConfiguracionSistemaForm';
import { useConfiguracionSistemaQuery } from '../hooks/configuracionHooks';

const ConfiguracionSistema = () => {
  const configQuery = useConfiguracionSistemaQuery();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Configuración del Sistema</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {configQuery.isLoading && <StatusPanel variant="loading" title="Cargando configuración" message="Consultando el servidor..." />}
        {configQuery.isError && <StatusPanel variant="error" title="No fue posible cargar la configuración" message="Intenta nuevamente." />}
        {configQuery.data && <ConfiguracionSistemaForm key={configQuery.data.id} initial={configQuery.data} />}
      </div>
    </div>
  );
};

export default ConfiguracionSistema;
