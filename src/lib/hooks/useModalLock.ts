import { useEffect } from 'react';

export function useModalLock(active: boolean): void {
    useEffect(() => {
        if (!active) return;

        const main = document.querySelector('main');
        const navbar = document.getElementById('site-navbar');
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';
        document.documentElement.classList.add('modal-open');
        main?.setAttribute('inert', '');
        main?.setAttribute('aria-hidden', 'true');
        navbar?.setAttribute('aria-hidden', 'true');

        return () => {
            document.body.style.overflow = previousOverflow;
            document.documentElement.classList.remove('modal-open');
            main?.removeAttribute('inert');
            main?.removeAttribute('aria-hidden');
            navbar?.removeAttribute('aria-hidden');
        };
    }, [active]);
}
