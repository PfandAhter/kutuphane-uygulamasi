import { Shelf } from '@/src/types/roomAndShelf';
import { Category } from "@/src/types/category";

// src/types/book.ts
export interface Author {
    id: number;
    firstName: string;
    lastName: string;
}

export interface BookAuthor {
    bookId: number;
    authorId: number;
    author: Author;
}

export interface BookCopy {
    id: number;
    barcodeNumber: string;
    isAvailable: boolean;
    shelf: Shelf;
}

export interface Publisher {
    id: number;
    name: string;
}

export interface BookDetail {
    id: number;
    title: string;
    isbn: string;
    pageCount: number;
    publicationYear: number;
    language: string;
    description?: string; // Backend modelinde yok ama genelde olur, UI için ekledim
    category: Category;
    publisher: Publisher;
    bookAuthors: BookAuthor[];
    bookCopies: BookCopy[];
}