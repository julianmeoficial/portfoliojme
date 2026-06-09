import type { JSX, CSSProperties } from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    className?: string;
    'aria-label'?: string;
}

export default function Skeleton({
    width = '100%',
    height = '1rem',
    className,
    'aria-label': ariaLabel = 'Loading',
}: SkeletonProps): JSX.Element {
    return (
        <div
            className={`${styles.skeleton} ${className ?? ''}`}
            style={{ width, height } as CSSProperties}
            role="status"
            aria-label={ariaLabel}
            aria-busy="true"
        />
    );
}
