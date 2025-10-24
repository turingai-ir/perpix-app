import type { FC } from 'react';

import styles from './loading-generation.module.css';
export const LoadingGeneration: FC = () => {
  return (
    <div className={styles.center}>
      <div className={styles.ring} />
      <span className={styles.text}>در حال تولید ...</span>
    </div>
  );
};
