import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';

const FlashMessages = () => {
    const { flash } = usePage().props;

    useEffect(() => {
        // Check if flash messages exist and show appropriate toast
        if (flash?.success) {
            toast.success(flash.success, {
                position: 'top-right',
                duration: 3000,
            });
        }

        if (flash?.error) {
            toast.error(flash.error, {
                position: 'top-right',
                duration: 3000,
            });
        }

        if (flash?.warning) {
            toast.custom(flash.warning, {
                position: 'top-right',
                duration: 3000,
                className: 'bg-yellow-500',
            });
        }

        if (flash?.info) {
            toast.custom(flash.info, {
                position: 'top-right',
                duration: 3000,
                className: 'bg-blue-500',
            });
        }
    }, [flash]);

    return <Toaster />;
};

export default FlashMessages;