import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/useAuth';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';

export const useLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [usuarioAcceso, setUsuarioAcceso] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ usuarioAcceso, contrasena });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible iniciar sesión'));
    } finally {
      setLoading(false);
    }
  };

  return {
    usuarioAcceso,
    setUsuarioAcceso,
    contrasena,
    setContrasena,
    loading,
    onSubmit,
  };
};
