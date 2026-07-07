type FeriadoFormProps = {
  fecha: string;
  nombre: string;
  activo: boolean;
  saving: boolean;
  onChangeFecha: (value: string) => void;
  onChangeNombre: (value: string) => void;
  onChangeActivo: (value: boolean) => void;
  onSubmit: () => void;
};

export const FeriadoForm = ({
  fecha,
  nombre,
  activo,
  saving,
  onChangeFecha,
  onChangeNombre,
  onChangeActivo,
  onSubmit,
}: FeriadoFormProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <label className="form-label">Fecha</label>
        <input className="form-input" type="date" value={fecha} onChange={(e) => onChangeFecha(e.target.value)} />
      </div>
      <div>
        <label className="form-label">Nombre</label>
        <input
          className="form-input"
          value={nombre}
          onChange={(e) => onChangeNombre(e.target.value)}
          placeholder="Ej. Año Nuevo"
        />
      </div>
      <div className="flex items-end gap-2">
        <label className="flex items-center gap-2 text-sm text-textDark">
          <input type="checkbox" checked={activo} onChange={(e) => onChangeActivo(e.target.checked)} />
          Activo
        </label>
        <button type="button" className="btn btn-primary ml-auto" disabled={saving || !nombre.trim()} onClick={onSubmit}>
          Agregar
        </button>
      </div>
    </div>
  </div>
);
