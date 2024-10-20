import { ReactNode } from 'react';
import ClassName from '../../models/Classname';
import styles from './Content.module.scss';
import React from 'react';

interface ContentProps {
  children: ReactNode;
  className?: string;
}

const Content: React.FC<ContentProps> = ({ children, className }) => {
  const contentClassName = new ClassName(styles.content);

  contentClassName.addIf(className, className);

  return <div className={contentClassName.toString()}>{children}</div>;
};

export default Content;
