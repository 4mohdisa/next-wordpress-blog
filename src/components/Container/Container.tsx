import { ReactNode } from 'react';
import ClassName from '../../models/ClassName';
import styles from './Container.module.scss';
import React from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  const containerClassName = new ClassName(styles.container);

  containerClassName.addIf(className, className);

  return <div className={containerClassName.toString()}>{children}</div>;
};

export default Container;
