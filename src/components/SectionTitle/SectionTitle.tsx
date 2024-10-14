import React, { ReactNode } from 'react';
import styles from './SectionTitle.module.scss';

interface SectionTitleProps {
  children: ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => {
  return <h2 className={styles.sectionTitle}>{children}</h2>;
};

export default SectionTitle;
