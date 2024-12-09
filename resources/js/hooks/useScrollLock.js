import { useEffect } from 'react';

export const useScrollLock = (isLocked) => {
    useEffect(() => {
        if (isLocked) {
            // Store current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${scrollY}px`;
        } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }, [isLocked]);
}; 