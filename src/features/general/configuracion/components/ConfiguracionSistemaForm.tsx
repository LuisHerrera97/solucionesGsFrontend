import { useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'react-toastify';
import type { ConfiguracionSistemaDto } from '../../types/types';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';
import {
  asNumber,
  coalesceEmptyNumbersToZero,
  numberInputDisplay,
  parseNumberInput,
  type WithEmptyNumberFields,
} from '../../../../shared/utils/numberInput';
import { useActualizarConfiguracionSistemaMutation } from '../hooks/configuracionHooks';
import { useAuth } from '../../../auth/context/useAuth';

import type { NumberInputValue } from '../../../../shared/utils/numberInput';

type ConfigSectionProps = {
  title: string;
  mora: NumberInputValue;
  gracia: NumberInputValue;
  tope: NumberInputValue;
  onChangeMora: (val: NumberInputValue) => void;
  onChangeGracia: (val: NumberInputValue) => void;
  onChangeTope: (val: NumberInputValue) => void;
  disabled?: boolean;
};

const ConfigMoraSection = ({ title, mora, gracia, tope, onChangeMora, onChangeGracia, onChangeTope, disabled }: ConfigSectionProps) => (
  <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 space-y-4">
    <h3 className="text-sm font-bold text-primaryBlue uppercase tracking-wider">{title}</h3>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mora ($/periodo)</label>
        <input
          type="number"
          min={0}
          value={numberInputDisplay(mora)}
          onChange={(e) => onChangeMora(parseNumberInput(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
          disabled={disabled}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Días gracia</label>
          <input
            type="number"
            min={0}
            value={numberInputDisplay(gracia)}
            onChange={(e) => onChangeGracia(parseNumberInput(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tope mora (veces)</label>
          <input
            type="number"
            min={0}
            value={numberInputDisplay(tope)}
            onChange={(e) => onChangeTope(parseNumberInput(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
            disabled={disabled}
          />
        </div>
      </div>
      <p className="text-xs text-infoBlue font-medium">
        {asNumber(gracia) === 0
          ? 'La mora se aplica inmediatamente al día siguiente del vencimiento.'
          : `La mora se aplica a partir del ${asNumber(gracia) + 1}.º día de atraso.`}
      </p>
    </div>
  </div>
);

export const ConfiguracionSistemaForm = ({ initial }: { initial: ConfiguracionSistemaDto }) => {
  const [formData, setFormData] = useState<WithEmptyNumberFields<ConfiguracionSistemaDto>>(initial);
  const updateMutation = useActualizarConfiguracionSistemaMutation();
  const { canBoton } = useAuth();
  const canEditar = canBoton('CONFIGURACION_EDITAR');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await updateMutation.mutateAsync(coalesceEmptyNumbersToZero(formData) as ConfiguracionSistemaDto);
      toast.success('Configuración guardada');
      setFormData(data);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible guardar la configuración'));
    }
  };

  const loading = updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ConfigMoraSection
          title="Créditos Diarios"
          mora={formData.moraDiaria}
          gracia={formData.diasGraciaDiaria}
          tope={formData.topeMoraDiaria}
          onChangeMora={(v) => setFormData((p) => ({ ...p, moraDiaria: v }))}
          onChangeGracia={(v) => setFormData((p) => ({ ...p, diasGraciaDiaria: v }))}
          onChangeTope={(v) => setFormData((p) => ({ ...p, topeMoraDiaria: v }))}
          disabled={loading}
        />
        <ConfigMoraSection
          title="Créditos Semanales"
          mora={formData.moraSemanal}
          gracia={formData.diasGraciaSemanal}
          tope={formData.topeMoraSemanal}
          onChangeMora={(v) => setFormData((p) => ({ ...p, moraSemanal: v }))}
          onChangeGracia={(v) => setFormData((p) => ({ ...p, diasGraciaSemanal: v }))}
          onChangeTope={(v) => setFormData((p) => ({ ...p, topeMoraSemanal: v }))}
          disabled={loading}
        />
        <ConfigMoraSection
          title="Créditos Mensuales"
          mora={formData.moraMensual}
          gracia={formData.diasGraciaMensual}
          tope={formData.topeMoraMensual}
          onChangeMora={(v) => setFormData((p) => ({ ...p, moraMensual: v }))}
          onChangeGracia={(v) => setFormData((p) => ({ ...p, diasGraciaMensual: v }))}
          onChangeTope={(v) => setFormData((p) => ({ ...p, topeMoraMensual: v }))}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Tasas de Interés</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diaria (%)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={numberInputDisplay(formData.tasaDiaria)}
                onChange={(e) => setFormData((prev) => ({ ...prev, tasaDiaria: parseNumberInput(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semanal (%)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={numberInputDisplay(formData.tasaSemanal)}
                onChange={(e) => setFormData((prev) => ({ ...prev, tasaSemanal: parseNumberInput(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mensual (%)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={numberInputDisplay(formData.tasaMensual)}
                onChange={(e) => setFormData((prev) => ({ ...prev, tasaMensual: parseNumberInput(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all bg-white"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Calendario</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-primaryBlue focus:ring-primaryBlue"
                checked={formData.domingoInhabilDefault}
                onChange={(e) => setFormData((prev) => ({ ...prev, domingoInhabilDefault: e.target.checked }))}
                disabled={loading}
              />
              Domingo inhábil por defecto (créditos diarios)
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-primaryBlue focus:ring-primaryBlue"
                checked={formData.aplicarFeriadosDefault}
                onChange={(e) => setFormData((prev) => ({ ...prev, aplicarFeriadosDefault: e.target.checked }))}
                disabled={loading}
              />
              Aplicar feriados por defecto
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
        <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Política de Bloqueo de Cuenta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bloqueo (minutos)</label>
            <input
              type="number"
              min={0}
              value={numberInputDisplay(formData.lockoutMinutes)}
              onChange={(e) => setFormData((prev) => ({ ...prev, lockoutMinutes: parseNumberInput(e.target.value) }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Intentos máximos permitidos</label>
            <input
              type="number"
              min={0}
              value={numberInputDisplay(formData.lockoutMaxFailedAttempts)}
              onChange={(e) => setFormData((prev) => ({ ...prev, lockoutMaxFailedAttempts: parseNumberInput(e.target.value) }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue outline-none transition-all"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="bg-primaryBlue hover:bg-primaryBlueDark text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors font-bold shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={!canEditar || loading}
        >
          <Save size={20} />
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
};
