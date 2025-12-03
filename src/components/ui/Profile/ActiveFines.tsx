'use client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fineService } from '@/src/services/fineService';
import { UserFineDto } from '@/src/types/user';
import FineListTable from './FineListTable';
import PaymentModal from './PaymentModal';

interface Props {
    page: number;
    pageSize: number;
    onDataLoaded: (total: number) => void;
    onPaymentSuccess?: () => void;
}

export default function ActiveFines({ page, pageSize, onDataLoaded, onPaymentSuccess }: Props) {
    const [fines, setFines] = useState<UserFineDto[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedFine, setSelectedFine] = useState<UserFineDto | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const fetchFines = async () => {
        setLoading(true);
        try {
            const result = await fineService.getMyActiveFines(page, pageSize);

            if (result && Array.isArray(result.items)) {
                setFines(result.items);
                onDataLoaded(result.totalCount || 0);
            } else {
                setFines([]);
                onDataLoaded(0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFines();
    }, [page, pageSize]);

    const handlePayClick = (fine: UserFineDto) => {
        setSelectedFine(fine);
        setIsPaymentModalOpen(true);
    };

    const handleConfirmPayment = async () => {
        if (!selectedFine) return;
        setPaymentLoading(true);
        try {
            await fineService.payFine(selectedFine.fineId.toString());

            toast.success("Ödeme başarıyla alındı.");
            setIsPaymentModalOpen(false);
            setSelectedFine(null);

            fetchFines();
            if (onPaymentSuccess) onPaymentSuccess();
        } catch (error) {
            toast.error("Ödeme işlemi başarısız."); //TODO: bunu duzelt.
        } finally {
            setPaymentLoading(false);
        }
    };

    return (
        <>
            <FineListTable
                fines={fines}
                loading={loading}
                isHistory={false}
                onPayClick={handlePayClick}
            />

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onConfirm={handleConfirmPayment}
                fine={selectedFine}
                loading={paymentLoading}
            />
        </>
    );
}