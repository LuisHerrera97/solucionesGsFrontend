import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../auth/context/useAuth';
import { useCreditoByIdQuery } from '../../creditos/hooks/creditosHooks';
import {
  useActualizarObservacionMutation,
} from '../hooks/detalleCreditoHooks';
import { useConfiguracionSistemaQuery } from '../../../general/configuracion/hooks/configuracionHooks';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';
import { calcularMoraSugerida } from '../../../../shared/creditos/calcularMora';
import { useDetalleCreditoModals } from './useDetalleCreditoModals';
import { useDetalleCreditoActions } from './useDetalleCreditoActions';

export const useDetalleCreditoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canBoton } = useAuth();

  const creditoQuery = useCreditoByIdQuery(id);
  const configQuery = useConfiguracionSistemaQuery();

  const modals = useDetalleCreditoModals();
  
  const [obsEditMode, setObsEditMode] = useState(false);
  const [obsText, setObsText] = useState('');

  const actualizarObsMutation = useActualizarObservacionMutation();

  const credito = creditoQuery.data;
  const fichas = useMemo(() => credito?.fichas ?? [], [credito?.fichas]);

  const handleCalcularMora = useCallback(
    (fechaFicha: string) => calcularMoraSugerida(fechaFicha, credito, configQuery.data),
    [credito, configQuery.data]
  );

  const actions = useDetalleCreditoActions(
    credito,
    modals.modalPago,
    modals.modalType,
    modals.monto,
    modals.mora,
    modals.medioPago,
    modals.montoEfectivo,
    modals.montoTransferencia,
    modals.setModalPago,
    modals.setTicketModal,
    modals.setConfirmDialog
  );

  const handleSaveObs = async () => {
    if (!credito) return;
    try {
      await actualizarObsMutation.mutateAsync({ creditoId: credito.id, observacion: obsText });
      toast.success('Observación actualizada');
      setObsEditMode(false);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible actualizar la observación'));
    }
  };

  return {
    id,
    navigate,
    canBoton,
    creditoQuery,
    configQuery,
    ...modals,
    obsEditMode,
    setObsEditMode,
    obsText,
    setObsText,
    credito,
    fichas,
    handleCalcularMora,
    ...actions,
    handleSaveObs,
    handlePrintTicket: () => actions.handlePrintTicket(modals.ticketModal),
  };
};
