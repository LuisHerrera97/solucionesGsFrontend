import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';
import { asNumber, type NumberInputValue } from '../../../../shared/utils/numberInput';
import { useAuth } from '../../../auth/context/useAuth';
import { useCrearCreditoMutation } from '../hooks/nuevoCreditoHooks';
import { useConfiguracionSistemaQuery } from '../../../general/configuracion/hooks/configuracionHooks';

import { TipoCredito } from '../../../../shared/constants/dominio';

export const useNuevoCreditoPage = () => {
  const navigate = useNavigate();
  const { canBoton } = useAuth();
  const canCrear = canBoton('CREDITO_CREAR');

  const configQuery = useConfiguracionSistemaQuery();
  const config = configQuery.data;

  const [clienteId, setClienteId] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [monto, setMonto] = useState<NumberInputValue>(0);
  const [plazo, setPlazo] = useState<NumberInputValue>(13);
  const [tipo, setTipo] = useState<'diario' | 'semanal' | 'mensual'>(TipoCredito.SEMANAL);
  const [permitirDomingo, setPermitirDomingo] = useState<boolean | null>(null);
  const [aplicarFeriados, setAplicarFeriados] = useState<boolean | null>(null);
  const [tasaManual, setTasaManual] = useState<number | null>(null);
  const [observacion, setObservacion] = useState('');
  const [confirmarOpen, setConfirmarOpen] = useState(false);

  const crearMutation = useCrearCreditoMutation();

  const permitirDomingoValue = useMemo(() => {
    const defaultValue = config ? !config.domingoInhabilDefault : false;
    return permitirDomingo ?? defaultValue;
  }, [permitirDomingo, config]);

  const aplicarFeriadosValue = useMemo(() => {
    const defaultValue = config ? config.aplicarFeriadosDefault : false;
    return aplicarFeriados ?? defaultValue;
  }, [aplicarFeriados, config]);

  const tasaDefault = useMemo(() => {
    if (!config) return 0;
    if (tipo === TipoCredito.DIARIO) return config.tasaDiaria;
    if (tipo === TipoCredito.SEMANAL) return config.tasaSemanal;
    return config.tasaMensual;
  }, [config, tipo]);

  const tasa = tasaManual ?? tasaDefault;
  const montoNum = asNumber(monto);
  const plazoNum = asNumber(plazo);
  const interesTotal = Math.round(montoNum * tasa);
  const total = montoNum + interesTotal;
  const cuota = plazoNum > 0 ? Math.ceil(total / plazoNum) : 0;

  const ejecutarCreacion = useCallback(async () => {
    if (!clienteId || montoNum <= 0 || plazoNum <= 0) return;
    try {
      await crearMutation.mutateAsync({
        clienteId,
        monto: montoNum,
        plazo: plazoNum,
        tipo,
        permitirDomingo: permitirDomingoValue,
        aplicarFeriados: aplicarFeriadosValue,
        tasaManual: tasaManual ?? undefined,
        observacion,
      });
      toast.success('Crédito creado');
      setConfirmarOpen(false);
      navigate('/creditos');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible crear el crédito'));
    }
  }, [clienteId, montoNum, plazoNum, tipo, permitirDomingoValue, aplicarFeriadosValue, tasaManual, observacion, crearMutation, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId) {
      toast.error('Selecciona un cliente');
      return;
    }
    if (montoNum <= 0) {
      toast.error('Indica un monto mayor a cero');
      return;
    }
    if (plazoNum <= 0) {
      toast.error('Indica un plazo válido');
      return;
    }
    setConfirmarOpen(true);
  };

  return {
    navigate,
    canCrear,
    configQuery,
    clienteId,
    setClienteId,
    clienteNombre,
    setClienteNombre,
    monto,
    setMonto,
    plazo,
    setPlazo,
    tipo,
    setTipo,
    permitirDomingoValue,
    setPermitirDomingo,
    aplicarFeriadosValue,
    setAplicarFeriados,
    tasaManual,
    setTasaManual,
    observacion,
    setObservacion,
    confirmarOpen,
    setConfirmarOpen,
    crearMutation,
    tasaDefault,
    tasa,
    interesTotal,
    total,
    cuota,
    ejecutarCreacion,
    handleSubmit,
  };
};
