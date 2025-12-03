import { LoanInfo } from "@/src/types/loan";

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

export interface UserFineDto{
    fineId: number;
    amount: number;
    status: string;
    isActive: boolean;
    issuedDate: string;
    fineType: string;
    description: string;

    loanDetails?: LoanInfo;
}

export interface MyLoanDto {
    id: number;
    bookTitle: string;
    authorName: string;
    borrowDate: string;
    dueDate: string;
    returnDate?: string | null;
    isOverdue: boolean;
    daysLeft: number;
}

export interface MyFineDto {
    id: number;
    amount: number;
    reason: string;
    issuedDate: string;
    isPaid: boolean;
    paymentDate?: string | null;
}

export interface UserStats {
    activeLoanCount: number;
    totalReadCount: number;
    totalFineDebt: number;
}