import { useEffect, type RefObject } from 'react';

const FOCUSABLE =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

interface UseFocusTrapOptions {
    restoreFocus?: boolean;
}

function isFocusableVisible(el: HTMLElement): boolean {
    if (el.hasAttribute('disabled')) return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;
    if (el.getClientRects().length === 0) return false;
    return true;
}

export function useFocusTrap(
    containerRef: RefObject<HTMLElement | null>,
    active: boolean,
    options: UseFocusTrapOptions = {},
): void {
    const { restoreFocus = true } = options;

    useEffect(() => {
        if (!active || !containerRef.current) return;

        const container = containerRef.current;
        const previouslyFocused = document.activeElement as HTMLElement | null;

        const getFocusable = (): HTMLElement[] =>
            Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
                isFocusableVisible,
            );

        const focusables = getFocusable();
        focusables[0]?.focus();

        const handleKeyDown = (e: KeyboardEvent): void => {
            if (e.key !== 'Tab') return;

            const items = getFocusable();
            if (items.length === 0) return;

            const first = items[0];
            const last = items[items.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        container.addEventListener('keydown', handleKeyDown);

        return () => {
            container.removeEventListener('keydown', handleKeyDown);
            if (restoreFocus) {
                previouslyFocused?.focus();
            }
        };
    }, [active, containerRef, restoreFocus]);
}
