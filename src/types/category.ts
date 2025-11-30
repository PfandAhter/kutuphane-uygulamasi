export interface Category{
    id: number;
    name: string;
    count?: number;
}

export interface CreateCategoryDto {
    name: string;
}