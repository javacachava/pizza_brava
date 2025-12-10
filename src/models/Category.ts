export interface Category {
    id: string;
    name: string;
    order: number;
    // REGLA: No existe 'active' ni 'status' en la BD.
    // Si el UI lo necesita, el repositorio lo inyectará como true.
}