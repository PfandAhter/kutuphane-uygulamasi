export interface CreateLoanDto {
    barcodeNumber: string;
    loanDays: number;
}

export interface LoanInfo{
    loanDate: string;
    expectedReturnDate: string;
    actualReturnDate?: string;
    bookTitle: string;
    barcodeNumber: string;
}

export interface LoanWithUserDetailsDto {
    loanId: number;
    loanDate: string;
    expectedReturnDate: string;
    actualReturnDate: string | null;
    isActive: boolean;

    bookTitle: string;
    authorName: string;
    isbn: string;
    room: string;
    shelf: string;

    userId: string;
    userFullName: string;
    userEmail: string;
    userPhoneNumber: string;
}