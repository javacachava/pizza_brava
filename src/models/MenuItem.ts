export interface MenuItem {
    id: string;
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    isAvailable: boolean; // REGLA: Campo correcto para disponibilidad
    usesIngredients: boolean;
    usesFlavors: boolean;
    usesSizeVariant: boolean;
    comboEligible: boolean;
}