import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreditoByIdQuery } from '../../creditos/hooks/creditosHooks';
import { formatCalendarDateFromApi } from '../../../../shared/date/calendarDate';
import { calculateEstadoCuenta, calculateFichaDetails } from '../../../../shared/creditos/estadoCuentaCalculations';

export const useEstadoCuentaCreditoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const creditoQuery = useCreditoByIdQuery(id);

  const credito = creditoQuery.data;
  const stats = useMemo(() => calculateEstadoCuenta(credito), [credito]);

  const fechaPrimerPago = stats && stats.fichas.length > 0 ? formatCalendarDateFromApi(stats.fichas[0].fecha) : '-';
  const fechaUltimoPago =
    stats && stats.fichas.length > 0 ? formatCalendarDateFromApi(stats.fichas[stats.fichas.length - 1].fecha) : '-';

  return {
    navigate,
    creditoQuery,
    credito,
    stats,
    fechaPrimerPago,
    fechaUltimoPago,
    calculateFichaDetails,
  };
};
