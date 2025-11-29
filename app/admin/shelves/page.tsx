'use client';

import React, { useState, useEffect } from 'react';
import { roomService } from '@/src/services/roomService';
import { shelfService } from "@/src/services/shelfService";
import { Room, Shelf, CreateRoomDto, CreateShelfDto } from '@/src/types/roomAndShelf';

import RoomListPanel from '@/src/components/ui/Admin/Shelves/RoomListPanel';
import ShelfListPanel from '@/src/components/ui/Admin/Shelves/ShelfListPanel';
import AddRoomModal from '@/src/components/ui/Admin/Modals/AddRoomModal';
import AddShelfModal from '@/src/components/ui/Admin/Modals/AddShelfModal';
import UpdateShelfModal from '@/src/components/ui/Admin/Modals/UpdateShelfModal';
import UpdateRoomModal from '@/src/components/ui/Admin/Modals/UpdateRoomModal';

export default function AdminShelvesPage() {
    // --- STATE ---
    const [rooms, setRooms] = useState<Room[]>([]);
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    // Loading States
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [loadingShelves, setLoadingShelves] = useState(false);

    // --- UPDATE STATES ---
    const [isUpdateRoomModalOpen, setIsUpdateRoomModalOpen] = useState(false);
    const [isUpdateShelfModalOpen, setIsUpdateShelfModalOpen] = useState(false);
    const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
    const [shelfToEdit, setShelfToEdit] = useState<Shelf | null>(null);

    // Modal States
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [isShelfModalOpen, setIsShelfModalOpen] = useState(false);

    // --- DATA FETCHING ---
    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        if (selectedRoom) {
            fetchShelves(selectedRoom.id);
        } else {
            setShelves([]);
        }
    }, [selectedRoom]);

    const fetchRooms = async () => {
        setLoadingRooms(true);
        try {
            const data = await roomService.getRooms();
            setRooms(data);
        } catch (error) {
            console.error("Odalar yüklenemedi", error);
        } finally {
            setLoadingRooms(false);
        }
    };

    const fetchShelves = async (roomId: number) => {
        setLoadingShelves(true);
        try {
            const data = await shelfService.getShelvesByRoomId(roomId);
            setShelves(data);
        } catch (error) {
            console.error("Raflar yüklenemedi", error);
        } finally {
            setLoadingShelves(false);
        }
    };

    const handleOpenEditRoom = (room: Room) => {
        setRoomToEdit(room);
        setIsUpdateRoomModalOpen(true);
    };

    const handleOpenEditShelf = (shelf: Shelf) => {
        setShelfToEdit(shelf);
        setIsUpdateShelfModalOpen(true);
    };

    const handleUpdateRoomSubmit = async (id: number, data: CreateRoomDto) => {
        await roomService.updateRoom(id, data);
        setIsUpdateRoomModalOpen(false);
        fetchRooms();
    };

    const handleUpdateShelfSubmit = async (id: number, data: { roomId: number, shelfCode: string }) => {
        await shelfService.updateShelf(id, data);
        setIsUpdateShelfModalOpen(false);

        if (selectedRoom) fetchShelves(selectedRoom.id);
    };

    // --- HANDLERS (Modal Submit) ---
    const handleRoomSubmit = async (data: CreateRoomDto) => {
        await roomService.createRoom(data);
        setIsRoomModalOpen(false);
        fetchRooms(); // Listeyi yenile
    };

    const handleShelfSubmit = async (shelfCode: string) => {
        if (!selectedRoom) return;


        const dto: CreateShelfDto = {
            roomId: selectedRoom.id,
            shelfCode: shelfCode
        };
        await shelfService.createShelf(dto);
        setIsShelfModalOpen(false);
        fetchShelves(selectedRoom.id);
    };

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-stone-800 font-serif">Yerleşim Yönetimi</h1>
                <p className="text-stone-500 text-sm">Oda ve raf hiyerarşisini buradan yönetebilirsiniz.</p>
            </div>

            {/* Content Panels */}
            <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">

                {/* Sol Panel: Odalar */}
                <RoomListPanel
                    rooms={rooms}
                    selectedRoom={selectedRoom}
                    loading={loadingRooms}
                    onSelectRoom={setSelectedRoom}
                    onAddClick={() => setIsRoomModalOpen(true)}
                    onEditClick={handleOpenEditRoom}
                />

                {/* Sağ Panel: Raflar */}
                <ShelfListPanel
                    shelves={shelves}
                    selectedRoom={selectedRoom}
                    loading={loadingShelves}
                    onAddClick={() => setIsShelfModalOpen(true)}
                    onEditClick={handleOpenEditShelf}
                />
            </div>

            {/* Modals */}
            <AddRoomModal
                isOpen={isRoomModalOpen}
                onClose={() => setIsRoomModalOpen(false)}
                onSubmit={handleRoomSubmit}
            />

            <AddShelfModal
                isOpen={isShelfModalOpen}
                onClose={() => setIsShelfModalOpen(false)}
                selectedRoom={selectedRoom}
                onSubmit={handleShelfSubmit}
            />

            <UpdateRoomModal
                isOpen={isUpdateRoomModalOpen}
                onClose={() => setIsUpdateRoomModalOpen(false)}
                room={roomToEdit}
                onSubmit={handleUpdateRoomSubmit}
            />

            <UpdateShelfModal
                isOpen={isUpdateShelfModalOpen}
                onClose={() => setIsUpdateShelfModalOpen(false)}
                shelf={shelfToEdit}
                currentRoomId={selectedRoom?.id || 0}
                onSubmit={handleUpdateShelfSubmit}
            />
        </div>
    );
}