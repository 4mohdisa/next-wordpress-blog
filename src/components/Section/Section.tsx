import React, { ReactNode } from 'react';
import ClassName from '../../models/classname.js';
import styles from './Section.module.scss';

interface SectionProps {
  children: ReactNode;
  className?: string | string[];
}

const Section: React.FC<SectionProps> = ({ children, className }) => {
  const sectionClassName = new ClassName(styles.section);

  if (className) {
    sectionClassName.add(className);
  }

  return <section className={sectionClassName.toString()}>{children}</section>;
};

export default Section;
