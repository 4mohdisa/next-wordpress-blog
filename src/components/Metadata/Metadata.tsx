import Link from 'next/link';
import { categoryPathBySlug } from '../../lib/categories';
import { authorPathByName } from '../../lib/users';
import { formatDate } from '../../lib/datetime';
import ClassName from '../../models/ClassName';

import { FaMapPin } from 'react-icons/fa';
import styles from './Metadata.module.scss';
import React from 'react';

interface Author {
  name: string;
  avatar?: {
    url: string;
    width: number;
    height: number;
  };
}

interface Category {
  slug: string;
  name: string;
}

interface MetadataProps {
  className?: string;
  author?: Author;
  date?: string;
  categories?: Category[];
  options?: {
    compactCategories: boolean;
  };
  isSticky?: boolean;
}

const DEFAULT_METADATA_OPTIONS = {
  compactCategories: true,
};

const Metadata: React.FC<MetadataProps> = ({
  className,
  author,
  date,
  categories,
  options = DEFAULT_METADATA_OPTIONS,
  isSticky = false,
}) => {
  const metadataClassName = new ClassName(styles.metadata);

  metadataClassName.addIf(className, className);

  const { compactCategories } = options;

  return (
    <ul className={metadataClassName.toString()}>
      {author && (
        <li className={styles.metadataAuthor}>
          <address>
            {author.avatar && (
              <img
                width={author.avatar.width}
                height={author.avatar.height}
                src={author.avatar.url}
                alt="Author Avatar"
              />
            )}
            <Link href={authorPathByName(author.name)} rel="author">
              {author.name}
            </Link>
          </address>
        </li>
      )}
      {date && (
        <li>
          <time dateTime={date}>
            {formatDate(date)}
          </time>
        </li>
      )}
      {Array.isArray(categories) && categories[0] && (
        <li className={styles.metadataCategories}>
          {compactCategories ? (
            <p title={categories.map(({ name }) => name).join(', ')}>
              <Link href={categoryPathBySlug(categories[0].slug)}>{categories[0].name}</Link>
              {categories.length > 1 && ' and more'}
            </p>
          ) : (
            <ul>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={categoryPathBySlug(category.slug)}>{category.name}</Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      )}
      {isSticky && (
        <li className={styles.metadataSticky}>
          <FaMapPin aria-label="Sticky Post" />
        </li>
      )}
    </ul>
  );
};

export default Metadata;
