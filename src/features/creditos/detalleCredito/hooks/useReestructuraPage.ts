import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';
import { asNumber, type NumberInputValue } from '../../../../shared/utils/numberInput';
import { useCreditoByIdQuery } from '../../creditos/hooks/creditosHooks';
import { useReestructurarCreditoMutation } from './detalleCreditoHooks';

export const useReestructuraPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const creditoQuery = useCreditoByIdQuery(id);
  const credito = creditoQuery.data;

  const [montoExtra, setMontoExtra] = useState<NumberInputValue>(0);
  const [nuevoPlazo, setNuevoPlazo] = useState<NumberInputValue>(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const reestructuraMutation = useReestructurarCreditoMutation();

  const saldoPendiente = useMemo(() => {
    if (!credito) return 0;
    return credito.total - credito.pagado;
  }, [credito]);

  const plazoDefault = useMemo(() => {
    if (!credito) return 0;
    return (nuevoPlazo === '' ? 0 : nuevoPlazo) || credito.totalFichas;
  }, [credito, nuevoPlazo]);

  const montoExtraSafe = Math.max(0, asNumber(montoExtra));
  const nuevoMontoCredito = saldoPendiente + montoExtraSafe;
  const folioLabel = credito?.folio?.trim() || 'este crédito';
  const confirmMessage = credito
    ? `Crédito ${folioLabel}: el saldo pendiente de $${saldoPendiente.toLocaleString()}${montoExtraSafe > 0 ? ` más $${montoExtraSafe.toLocaleString()} extra` : ''} generará un nuevo crédito de $${nuevoMontoCredito.toLocaleString()} en ${plazoDefault} ficha(s). El crédito actual quedará como reestructurado.`
    : '';

  const handleSubmitIntent = (e: React.FormEvent) => {
    e.preventDefault();
    const plazo = plazoDefault;
    if (plazo <= 0) {
      toast.error('El plazo debe ser al menos 1 ficha.');
      return;
    }
    setConfirmOpen(true);
  };

  const aplicarReestructura = async () => {
    if (!credito) return;
    const plazo = plazoDefault;
    if (plazo <= 0) return;
    try {
      await reestructuraMutation.mutateAsync({
        creditoId: credito.id,
        nuevoMonto: nuevoMontoCredito,
        nuevoPlazo: plazo,
        tipo: credito.tipo,
      });
      toast.success('Crédito reestructurado');
      setConfirmOpen(false);
      navigate('/creditos');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible reestructurar el crédito'));
    }
  };

  return {
    navigate,
    creditoQuery,
    credito,
    montoExtra,
    setMontoExtra,
    nuevoPlazo,
    setNuevoPlazo,
    confirmOpen,
    setConfirmOpen,
    reestructuraMutation,
    saldoPendiente,
    plazoDefault,
    confirmMessage,
    handleSubmitIntent,
    aplicarReestructura,
  };
};
