'use client';

import { useState, type JSX } from 'react';
import Skeleton from '../Skeleton';
import styles from './ImageWithSkeleton.module.css';

interface ImageWithSkeletonProps {
    src: string;
    alt: string;
    className?: string;
    wrapperClassName?: string;
    loading?: 'lazy' | 'eager';
    fetchPriority?: 'high' | 'low' | 'auto';
    errorLabel?: string;
    loadingLabel?: string;
}

function ImageWithSkeletonInner({
    src,
    alt,
    className,
    wrapperClassName,
    loading = 'lazy',
    fetchPriority,
    errorLabel = 'Could not load image',
    loadingLabel = 'Loading',
}: ImageWithSkeletonProps): JSX.Element {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

    return (
        <div className={`${styles.wrapper} ${wrapperClassName ?? ''}`}>
            {status === 'loading' && (
                <Skeleton
                    className={styles.skeleton}
                    height="100%"
                    aria-label={loadingLabel}
                />
            )}
            {status === 'error' ? (
                <div className={styles.error} role="alert">
                    {errorLabel}
                </div>
            ) : (
                // eslint-disable-next-line @next/next/no-img-element -- onLoad skeleton requires native img
                <img
                    src={src}
                    alt={alt}
                    loading={loading}
                    decoding="async"
                    {...(fetchPriority ? { fetchPriority } : {})}
                    className={`${styles.image} ${status === 'loaded' ? styles.imageLoaded : ''} ${className ?? ''}`}
                    onLoad={() => setStatus('loaded')}
                    onError={() => setStatus('error')}
                />
            )}
        </div>
    );
}

export default function ImageWithSkeleton(props: ImageWithSkeletonProps): JSX.Element {
    return <ImageWithSkeletonInner key={props.src} {...props} />;
}
