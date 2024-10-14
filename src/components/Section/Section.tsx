import React, { ReactNode } from 'react';
import ClassName from 'models/classname';
import styles from './Section.module.scss';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ children, className, ...rest }) => {
  const sectionClassName = new ClassName(styles.section);

  sectionClassName.addIf(className, className);

  return (
    <section className={sectionClassName.toString()} {...rest}>
      {children}
    </section>
  );
};

export default Section;
