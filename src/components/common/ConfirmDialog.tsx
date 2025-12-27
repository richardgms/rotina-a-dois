'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUIStore } from '@/stores/uiStore';

export function ConfirmDialog() {
    const { isConfirmDialogOpen, confirmDialogData, closeConfirmDialog } = useUIStore();

    const handleConfirm = async () => {
        if (confirmDialogData?.onConfirm) {
            await confirmDialogData.onConfirm();
        }
        closeConfirmDialog();
    };

    return (
        <AlertDialog open={isConfirmDialogOpen} onOpenChange={closeConfirmDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{confirmDialogData?.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {confirmDialogData?.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
