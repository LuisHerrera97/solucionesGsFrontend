import { Activity, DollarSign, Users } from 'lucide-react';
import StatusPanel from '../../../../shared/components/StatusPanel';
import { ActividadRecienteTable } from '../../../creditos/dashboard/components/ActividadRecienteTable';
import { CobradoPorDiaChart } from '../../../creditos/dashboard/components/CobradoPorDiaChart';
import { CobradoVencidoChart } from '../../../creditos/dashboard/components/CobradoVencidoChart';
import { DashboardHeader } from '../../../creditos/dashboard/components/DashboardHeader';
import { MedioPagoPie } from '../../../creditos/dashboard/components/MedioPagoPie';
import { StatCard } from '../../../creditos/dashboard/components/StatCard';
import { useHomePage } from '../hooks/useHomePage';

const HomePage = () => {
  const {
    navigate,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    totalClientes,
    creditosActivos,
    totalVencido,
    ingresoPeriodo,
    chartCobradoVencido,
    chartPorMedio,
    cobradoPorDia,
    movimientosRango,
    movimientosQuery,
    isLoading,
    isError,
  } = useHomePage();

  return (
    <div className="space-y-6">
      <DashboardHeader fechaDesde={fechaDesde} fechaHasta={fechaHasta} onChangeFechaDesde={setFechaDesde} onChangeFechaHasta={setFechaHasta} />

      {isLoading && <StatusPanel variant="loading" title="Cargando dashboard" message="Consultando el servidor..." />}
      {isError && <StatusPanel variant="error" title="No fue posible cargar el dashboard" message="Intenta nuevamente." />}

      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Clientes Totales" value={totalClientes.toString()} icon={Users} color="bg-blue-500" onClick={() => navigate('/clientes')} />
            <StatCard title="Créditos Activos" value={creditosActivos.toString()} icon={Activity} color="bg-green-500" onClick={() => navigate('/creditos')} />
            <StatCard title="Saldo vencido (fichas)" value={`$${totalVencido.toLocaleString()}`} icon={DollarSign} color="bg-orange-500" onClick={() => navigate('/pendientes')} />
            <StatCard title={fechaDesde === fechaHasta ? 'Ingreso del Día' : 'Ingreso del Período'} value={`$${ingresoPeriodo.toLocaleString()}`} icon={DollarSign} color="bg-purple-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CobradoVencidoChart data={chartCobradoVencido} />
            <MedioPagoPie data={chartPorMedio} />
          </div>

          <CobradoPorDiaChart data={cobradoPorDia} />
          <ActividadRecienteTable movimientos={movimientosRango} isLoading={movimientosQuery.isLoading} isError={movimientosQuery.isError} />
        </>
      )}
    </div>
  );
};

export default HomePage;
