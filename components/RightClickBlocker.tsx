'use client';

import { useEffect } from 'react';

export default function SecurityBlocker() {
    useEffect(() => {
        // Block right-click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // Block DevTools shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
                (e.ctrlKey && e.key === 'U')
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return null; // No visible UI
}
