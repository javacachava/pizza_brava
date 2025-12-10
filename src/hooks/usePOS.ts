import { usePOSContext } from '../contexts/POSContext';

// Este hook es la interfaz pública para los componentes
export const usePOS = () => {
    return usePOSContext();
};