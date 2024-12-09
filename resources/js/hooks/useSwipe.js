import { useState, useEffect } from 'react';

export const useSwipe = ({ onSwipeUp, onSwipeDown, element, threshold = 50 }) => {
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    useEffect(() => {
        const handleTouchStart = (e) => {
            setTouchStart(e.changedTouches[0].screenY);
        };

        const handleTouchMove = (e) => {
            setTouchEnd(e.changedTouches[0].screenY);
        };

        const handleTouchEnd = () => {
            if (touchStart - touchEnd > threshold) {
                onSwipeUp?.();
            } else if (touchEnd - touchStart > threshold) {
                onSwipeDown?.();
            }
        };

        const el = element?.current || document;
        
        el.addEventListener('touchstart', handleTouchStart);
        el.addEventListener('touchmove', handleTouchMove);
        el.addEventListener('touchend', handleTouchEnd);

        return () => {
            el.removeEventListener('touchstart', handleTouchStart);
            el.removeEventListener('touchmove', handleTouchMove);
            el.removeEventListener('touchend', handleTouchEnd);
        };
    }, [touchStart, touchEnd, onSwipeUp, onSwipeDown, element, threshold]);
}; 