import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../auth/context/useAuth';
import { useCreditoByIdQuery } from '../../creditos/hooks/creditosHooks';
import { useCondonarInteresMontoMutation } from '../hooks/detalleCreditoHooks';
import { asNumber, type NumberInputValue } from '../../../../shared/utils/numberInput';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';

export const useCondonacionCreditoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canBoton, isMenuLoading } = useAuth();
  const puedeCondonar = canBoton('CREDITO_CONDONAR_INTERES');

  const creditoQuery = useCreditoByIdQuery(id);
  const condonarMontoMutation = useCondonarInteresMontoMutation();

  const [monto, setMonto] = useState<NumberInputValue>('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const credito = creditoQuery.data;

  const { interesTotalPendiente, fichasPendientesCount } = useMemo(() => {
    if (!credito) return { interesTotalPendiente: 0, fichasPendientesCount: 0 };
    const pend = credito.fichas.filter((f) => !f.pagada);
    const total = pend.reduce((acc, f) => acc + (f.interes ?? 0), 0);
    return { interesTotalPendiente: total, fichasPendientesCount: pend.length };
  }, [credito]);

  const montoNum = asNumber(monto);
  const montoValido = montoNum > 0 && montoNum <= interesTotalPendiente;

  const solicitarConfirmacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !credito) return;
    if (!puedeCondonar) {
      toast.error('No tienes permiso para condonar interés.');
      return;
    }
    if (montoNum <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }
    if (montoNum > interesTotalPendiente) {
      toast.error('El monto no puede superar el interés pendiente.');
      return;
    }
    setConfirmOpen(true);
  };

  const aplicarCondonacion = async () => {
    if (!id || !montoValido) return;
    try {
      await condonarMontoMutation.mutateAsync({ creditoId: id, monto: montoNum });
      toast.success('Interés condonado correctamente');
      setConfirmOpen(false);
      navigate(`/creditos/${id}`);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible aplicar la condonación'));
    }
  };

  return {
    id,
    navigate,
    puedeCondonar,
    isMenuLoading,
    creditoQuery,
    condonarMontoMutation,
    monto,
    setMonto,
    confirmOpen,
    setConfirmOpen,
    credito,
    interesTotalPendiente,
    fichasPendientesCount,
    montoNum,
    montoValido,
    solicitarConfirmacion,
    aplicarCondonacion,
  };
};
