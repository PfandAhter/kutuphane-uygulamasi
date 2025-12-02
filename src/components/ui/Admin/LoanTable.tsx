import React from 'react';
import { LoanWithUserDetailsDto } from '@/src/types/loan';

interface Props {
    loans: LoanWithUserDetailsDto[];
    loading: boolean;
    emptyMessage: string;
    isOverdueList?: boolean;
}

export default function LoanTable({ loans, loading, emptyMessage, isOverdueList = false }: Props) {

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (loading) {
        return <div className="p-8 text-center text-stone-500">Yükleniyor...</div>;
    }

    if (loans.length === 0) {
        return <div className="p-8 text-center text-stone-500 bg-stone-50 rounded border border-stone-200">{emptyMessage}</div>;
    }

    return (
        <div className="overflow-x-auto border border-stone-200 rounded-lg shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-stone-100 text-stone-600 font-bold uppercase text-xs border-b border-stone-200">
                <tr>
                    <th className="px-6 py-3">Kitap Bilgisi</th>
                    <th className="px-6 py-3">Kullanıcı</th>
                    <th className="px-6 py-3">Konum</th>
                    <th className="px-6 py-3">Tarihler</th>
                    <th className="px-6 py-3 text-center">Durum</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                {loans.map((loan) => {
                    // 1. Kitap İade Edilmiş mi?
                    const isReturned = !!loan.actualReturnDate; // veya loan.isActive === false

                    // 2. Şu anki tarih beklenen tarihten büyük mü?
                    const now = new Date();
                    const expectedDate = new Date(loan.expectedReturnDate);

                    // 3. İade edildiyse, geç mi iade edilmiş?
                    // actualReturnDate varsa onu Date objesine çeviriyoruz, yoksa null
                    const actualDate = loan.actualReturnDate ? new Date(loan.actualReturnDate) : null;
                    const returnedLate = isReturned && actualDate && actualDate > expectedDate;

                    // 4. İade edilmediyse, süresi geçmiş mi?
                    const isOverdueActive = !isReturned && now > expectedDate;

                    return (
                        <tr key={loan.loanId} className="hover:bg-stone-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-stone-800">{loan.bookTitle}</div>
                                <div className="text-xs text-stone-500">{loan.authorName}</div>
                                <div className="text-[10px] text-stone-400 font-mono mt-1">ISBN: {loan.isbn}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-stone-800">{loan.userFullName}</div>
                                <div className="text-xs text-stone-500">{loan.userEmail}</div>
                                <div className="text-xs text-stone-500">{loan.userPhoneNumber}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-block bg-amber-50 text-amber-800 text-xs px-2 py-1 rounded border border-amber-100">
                                    Oda: {loan.room} / Raf: {loan.shelf}
                                </span>
                            </td>
                            <td className="px-6 py-4 space-y-1">
                                <div className="text-xs">
                                    <span className="text-stone-400">Veriliş:</span> <span className="text-stone-700">{formatDate(loan.loanDate)}</span>
                                </div>
                                <div className="text-xs">
                                    <span className="text-stone-400">Beklenen:</span>
                                    <span className={`font-bold ml-1 ${(isOverdueActive || returnedLate) ? 'text-red-600' : 'text-stone-700'}`}>
                                        {formatDate(loan.expectedReturnDate)}
                                    </span>
                                </div>
                                {isReturned && (
                                    <div className="text-xs">
                                        <span className="text-stone-400">İade:</span>
                                        <span className="text-green-700 font-medium ml-1">{formatDate(loan.actualReturnDate!)}</span>
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 text-center">
                                {isReturned ? (
                                    returnedLate ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                                            ⚠️ Geç İade
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                            ✅ Tamamlandı
                                        </span>
                                    )
                                ) : (
                                    isOverdueActive || isOverdueList ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                            🚫 Gecikmiş
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                                            ⏳ Okunuyor
                                        </span>
                                    )
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}