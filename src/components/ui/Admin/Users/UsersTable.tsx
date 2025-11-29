import React from 'react';
import { UserViewDto } from '@/src/types/user';

interface Props {
    users: UserViewDto[];
    loading: boolean;
    onDetailClick: (user: UserViewDto) => void;
}

export default function UsersTable({ users, loading, onDetailClick }: Props) {

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('tr-TR');
    };

    return (
        <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden min-h-[400px]">
            <table className="w-full text-sm text-left">
                <thead className="bg-stone-50 text-stone-500 uppercase text-xs border-b border-stone-200">
                <tr>
                    <th className="px-6 py-3">Ad Soyad</th>
                    <th className="px-6 py-3">E-Posta / Telefon</th>
                    <th className="px-6 py-3">Roller</th>
                    <th className="px-6 py-3">Durum</th>
                    <th className="px-6 py-3 text-center">Ödünç</th>
                    <th className="px-6 py-3">Kayıt Tarihi</th>
                    <th className="px-6 py-3 text-right">İşlemler</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                {loading && (
                    <tr><td colSpan={7} className="p-12 text-center text-stone-500">Yükleniyor...</td></tr>
                )}

                {!loading && users.length === 0 && (
                    <tr><td colSpan={7} className="p-12 text-center text-stone-500 italic">Kriterlere uygun kayıt bulunamadı.</td></tr>
                )}

                {!loading && users.map((user) => (
                    <tr key={user.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="px-6 py-4">
                            <div className="font-bold text-stone-800">{user.firstName} {user.lastName}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-stone-600">{user.email}</div>
                            <div className="text-[10px] text-stone-400">{user.phoneNumber}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                                {user.roles.map((role, i) => (
                                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-stone-100 text-stone-600 font-bold uppercase">
                                            {role}
                                        </span>
                                ))}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1 ${
                                    user.hasFine ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${user.hasFine ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                    {user.hasFine ? "Cezalı" : "Temiz"}
                                </span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-stone-700">
                            {user.loanBookCount}
                        </td>
                        <td className="px-6 py-4 text-stone-600 text-xs">
                            {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button
                                onClick={() => onDetailClick(user)}
                                className="text-amber-700 hover:text-amber-900 font-medium text-xs bg-amber-50 px-3 py-1 rounded border border-amber-200 transition-colors"
                            >
                                Detay
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}