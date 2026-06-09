import Skeleton from '@/components/common/Skeleton';
import { en } from '@/lib/i18n/en';
import styles from './loading.module.css';

export default function Loading() {
    return (
        <div className={styles.loading} role="status" aria-label={en.common.loading_page}>
            <span className={styles.logo}>JME</span>
            <Skeleton width="12rem" height="0.5rem" />
            <Skeleton width="8rem" height="0.5rem" />
        </div>
    );
}
