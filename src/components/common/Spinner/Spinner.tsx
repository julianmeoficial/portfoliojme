import type { JSX } from 'react';
import styles from './Spinner.module.css';

interface SpinnerProps {
    label?: string;
}

export default function Spinner({ label }: SpinnerProps): JSX.Element {
    return (
        <span
            className={styles.spinner}
            role="status"
            aria-label={label ?? 'Loading'}
        />
    );
}
