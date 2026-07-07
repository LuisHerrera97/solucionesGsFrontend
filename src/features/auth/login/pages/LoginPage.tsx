import { Lock } from 'lucide-react';
import { LoginBrandPanel } from '../components/LoginBrandPanel';
import { LoginForm } from '../components/LoginForm';
import { useLoginPage } from '../hooks/useLoginPage';

const LoginPage = () => {
  const { usuarioAcceso, setUsuarioAcceso, contrasena, setContrasena, loading, onSubmit } = useLoginPage();

  return (
    <div className="min-h-screen bg-softBeige">
      <div className="min-h-screen grid place-items-center p-6">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-3xl border border-gray-100 shadow-sm bg-white">
          <LoginBrandPanel />

          <div className="p-8 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-textDark">Iniciar sesión</h1>
                <p className="text-sm text-textMuted mt-1">Ingresa tus credenciales para continuar.</p>
              </div>
              <div className="lg:hidden flex items-center gap-2 text-primaryBlue font-semibold">
                <Lock size={18} />
                <span>Financiera GS</span>
              </div>
            </div>

            <LoginForm
              usuarioAcceso={usuarioAcceso}
              contrasena={contrasena}
              loading={loading}
              onChangeUsuarioAcceso={setUsuarioAcceso}
              onChangeContrasena={setContrasena}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
