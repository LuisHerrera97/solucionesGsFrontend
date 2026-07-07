import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../layout/Layout';
import LoginPage from '../features/auth/login/pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';

import Clientes from '../features/creditos/clientes/pages/Clientes';
import Cobranza from '../features/cobranza/cobranza/pages/Cobranza';
import Creditos from '../features/creditos/creditos/pages/Creditos';
import Movimientos from '../features/creditos/movimientos/pages/Movimientos';
import HomePage from '../features/home/dashboard/pages/Home';
import DetalleCredito from '../features/creditos/detalleCredito/pages/DetalleCredito';
import EstadoCuentaCredito from '../features/creditos/detalleCredito/pages/EstadoCuentaCredito';
import CondonacionCredito from '../features/creditos/detalleCredito/pages/CondonacionCredito';
import NuevoCredito from '../features/creditos/nuevoCredito/pages/NuevoCredito';
import Pendientes from '../features/cobranza/pendientes/pages/Pendientes';
import Reestructura from '../features/creditos/detalleCredito/pages/Reestructura';
import ConfiguracionSistema from '../features/general/configuracion/pages/ConfiguracionSistema';
import ZonasCobranza from '../features/general/zonas/pages/ZonasCobranza';
import Auditoria from '../features/general/auditoria/pages/Auditoria';
import Feriados from '../features/general/feriados/pages/Feriados';
import UsuariosSistema from '../features/seguridad/usuarios/pages/Usuarios';
import PerfilesSistema from '../features/seguridad/perfiles/pages/Perfiles';
import PermisosSistema from '../features/seguridad/permisos/pages/Permisos';
import ElementosSistema from '../features/seguridad/elementosSistema/pages/ElementosSistema';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/clientes"
        element={
          <ProtectedRoute>
            <Layout>
              <Clientes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/config" element={<Navigate to="/general/configuracion" replace />} />
      <Route
        path="/general/configuracion"
        element={
          <ProtectedRoute>
            <Layout>
              <ConfiguracionSistema />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/general/zonas"
        element={
          <ProtectedRoute>
            <Layout>
              <ZonasCobranza />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/general/auditoria"
        element={
          <ProtectedRoute>
            <Layout>
              <Auditoria />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/general/feriados"
        element={
          <ProtectedRoute>
            <Layout>
              <Feriados />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/sistema/usuarios" element={<Navigate to="/seguridad/usuarios" replace />} />
      <Route path="/sistema/perfiles" element={<Navigate to="/seguridad/perfiles" replace />} />
      <Route path="/sistema/permisos" element={<Navigate to="/seguridad/permisos" replace />} />
      <Route path="/sistema/elementos" element={<Navigate to="/seguridad/elementos" replace />} />

      <Route
        path="/seguridad/usuarios"
        element={
          <ProtectedRoute>
            <Layout>
              <UsuariosSistema />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seguridad/perfiles"
        element={
          <ProtectedRoute>
            <Layout>
              <PerfilesSistema />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seguridad/permisos"
        element={
          <ProtectedRoute>
            <Layout>
              <PermisosSistema />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seguridad/elementos"
        element={
          <ProtectedRoute>
            <Layout>
              <ElementosSistema />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/seguridad/auditoria" element={<Navigate to="/general/auditoria" replace />} />
      <Route path="/seguridad/feriados" element={<Navigate to="/general/feriados" replace />} />

      <Route
        path="/creditos/nuevo"
        element={
          <ProtectedRoute>
            <Layout>
              <NuevoCredito />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/creditos/:id/reestructura"
        element={
          <ProtectedRoute>
            <Layout>
              <Reestructura />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/creditos/:id/estado-cuenta"
        element={
          <ProtectedRoute>
            <Layout>
              <EstadoCuentaCredito />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/creditos/:id/condonacion"
        element={
          <ProtectedRoute>
            <Layout>
              <CondonacionCredito />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/creditos/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <DetalleCredito />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/creditos"
        element={
          <ProtectedRoute>
            <Layout>
              <Creditos />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/movimientos"
        element={
          <ProtectedRoute>
            <Layout>
              <Movimientos />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/pendientes"
        element={
          <ProtectedRoute>
            <Layout>
              <Pendientes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cobranza"
        element={
          <ProtectedRoute>
            <Layout>
              <Cobranza />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
