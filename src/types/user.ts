export interface UserViewDto {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; // ISO string
    email: string;
    phoneNumber: string;
    roles: string[];
    loanBookCount: number;
    hasFine: boolean;
    createdAt: string; // ISO string
}

export interface UserFilterDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    name?: string; // İsim veya Email araması için ortak alan
    role?: string;
    hasFine?: boolean;
    page: number;
    size: number;
}