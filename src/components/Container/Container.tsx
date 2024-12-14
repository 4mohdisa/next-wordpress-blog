import { ReactNode } from 'react';
import ClassName from '../../models/classname.js';
import styles from './Container.module.scss';
import React from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string | string[];
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  const containerClassName = new ClassName(styles.container);

  if (className) {
    containerClassName.add(className);
  }

  return <div className={containerClassName.toString()}>{children}</div>;
};

export default Container;
