import { useConfiguracionSistemaQuery } from './configuracionHooks';

export const useConfiguracionSistemaPage = () => {
  const configQuery = useConfiguracionSistemaQuery();
  return { configQuery };
};
