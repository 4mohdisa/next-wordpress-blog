import Link from 'next/link';
import ClassName from '../../models/Classname';
import styles from './Breadcrumbs.module.scss';
import React from 'react';

interface Breadcrumb {
  id: string;
  title: string;
  uri?: string;
}

interface BreadcrumbsProps {
  className?: string;
  breadcrumbs: Breadcrumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className, breadcrumbs }) => {
  const breadcrumbsClassName = new ClassName(styles.breadcrumbs);

  breadcrumbsClassName.addIf(className, className);

  return (
    <ul className={breadcrumbsClassName.toString()}>
      {breadcrumbs.map(({ id, title, uri }) => (
        <li key={id}>
          {!uri ? title : <Link href={uri}>{title}</Link>}
        </li>
      ))}
    </ul>
  );
};

export default Breadcrumbs;
