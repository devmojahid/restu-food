import { useState, useEffect } from 'react';

/**
 * A custom hook for implementing scroll spy functionality.
 * Tracks which section is currently in view as the user scrolls.
 * 
 * @param {string[]} sectionIds - Array of section IDs to track
 * @param {Object} options - Configuration options
 * @param {number} options.offset - Offset from the top of the viewport (default: 0)
 * @param {boolean} options.smooth - Enable smooth scrolling to sections (default: true)
 * @returns {string|null} - The ID of the currently active section
 */
export const useScrollSpy = (sectionIds = [], options = {}) => {
    const { offset = 0, smooth = true } = options;
    const [activeSection, setActiveSection] = useState(null);

    useEffect(() => {
        if (!sectionIds.length) return;

        // Track all sections
        const sectionElements = sectionIds
            .map(id => document.getElementById(id))
            .filter(Boolean);

        if (!sectionElements.length) return;

        const handleScroll = () => {
            // Get current scroll position
            const scrollY = window.scrollY;

            // Find the section that is currently in view
            // We iterate backwards to give preference to sections later in the page
            // when the user is in a boundary area
            for (let i = sectionElements.length - 1; i >= 0; i--) {
                const section = sectionElements[i];

                if (!section) continue;

                // Get position relative to viewport
                const rect = section.getBoundingClientRect();

                // Determine if section is in view, accounting for offset
                if (rect.top <= offset + 100) {
                    // If current section differs from active, update state
                    if (section.id !== activeSection) {
                        setActiveSection(section.id);
                    }
                    break;
                }
            }

            // If we've scrolled to the top, default to first section
            if (scrollY < 100 && sectionElements[0]) {
                setActiveSection(sectionElements[0].id);
            }
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Set initial active section
        handleScroll();

        // Clean up event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [sectionIds, offset, activeSection]);

    /**
     * Helper function to scroll to a section
     * 
     * @param {string} sectionId - The ID of the section to scroll to
     */
    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);

        if (!section) return;

        const y = section.getBoundingClientRect().top + window.pageYOffset + offset;

        window.scrollTo({
            top: y,
            behavior: smooth ? 'smooth' : 'auto'
        });

        setActiveSection(sectionId);
    };

    return activeSection;
};

export default useScrollSpy; 