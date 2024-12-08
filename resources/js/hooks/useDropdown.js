import { useState, useCallback, useEffect } from 'react';

export function useDropdown() {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleToggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // Close on ESC key and click outside
    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleEsc);
        
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen]);

    return {
        isOpen,
        handleOpen,
        handleClose,
        handleToggle
    };
} 