import { formatCalendarDateFromApi } from '../../../../shared/date/calendarDate';
import type { FeriadoDto } from '../../types/feriados';

type FeriadosTableProps = {
  feriados: FeriadoDto[];
  updating: boolean;
  deleting: boolean;
  onToggleActivo: (item: FeriadoDto) => void;
  onEliminar: (id: string) => void;
};

export const FeriadosTable = ({ feriados, updating, deleting, onToggleActivo, onEliminar }: FeriadosTableProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="text-left p-3">Fecha</th>
          <th className="text-left p-3">Nombre</th>
          <th className="text-left p-3">Activo</th>
          <th className="text-right p-3">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {feriados.map((f) => (
          <tr key={f.id} className="border-t border-gray-100">
            <td className="p-3 whitespace-nowrap">{formatCalendarDateFromApi(f.fecha)}</td>
            <td className="p-3">{f.nombre}</td>
            <td className="p-3">
              <button type="button" className="btn btn-light" onClick={() => onToggleActivo(f)} disabled={updating}>
                {f.activo ? 'Sí' : 'No'}
              </button>
            </td>
            <td className="p-3 text-right">
              <button type="button" className="btn btn-light" onClick={() => onEliminar(f.id)} disabled={deleting}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {feriados.length === 0 && <div className="p-10 text-center text-textMuted">Sin feriados registrados.</div>}
  </div>
);
