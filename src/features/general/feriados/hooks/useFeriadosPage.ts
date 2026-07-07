import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';
import { localCalendarDayKey } from '../../../../shared/date/calendarDate';
import type { FeriadoDto } from '../../types/feriados';
import {
  useActualizarFeriadoMutation,
  useCrearFeriadoMutation,
  useEliminarFeriadoMutation,
  useFeriadosQuery,
} from './feriadosHooks';

export const useFeriadosPage = () => {
  const feriadosQuery = useFeriadosQuery();
  const crearMutation = useCrearFeriadoMutation();
  const actualizarMutation = useActualizarFeriadoMutation();
  const eliminarMutation = useEliminarFeriadoMutation();

  const [fecha, setFecha] = useState(() => localCalendarDayKey());
  const [nombre, setNombre] = useState('');
  const [activo, setActivo] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const feriados = useMemo(() => feriadosQuery.data ?? [], [feriadosQuery.data]);

  const handleCrear = async () => {
    try {
      await crearMutation.mutateAsync({ fecha, nombre: nombre.trim(), activo });
      toast.success('Feriado creado');
      setNombre('');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible crear el feriado'));
    }
  };

  const handleToggleActivo = async (item: FeriadoDto) => {
    try {
      await actualizarMutation.mutateAsync({
        id: item.id,
        payload: { fecha: item.fecha, nombre: item.nombre, activo: !item.activo },
      });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible actualizar el feriado'));
    }
  };

  const handleConfirmEliminar = async () => {
    if (!confirmDeleteId) return;
    try {
      await eliminarMutation.mutateAsync(confirmDeleteId);
      toast.success('Feriado eliminado');
      setConfirmDeleteId(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible eliminar el feriado'));
    }
  };

  return {
    feriadosQuery,
    crearMutation,
    actualizarMutation,
    eliminarMutation,
    fecha,
    setFecha,
    nombre,
    setNombre,
    activo,
    setActivo,
    feriados,
    confirmDeleteId,
    setConfirmDeleteId,
    handleCrear,
    handleToggleActivo,
    handleConfirmEliminar,
  };
};
