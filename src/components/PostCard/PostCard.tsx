import Link from 'next/link';
import { postPathBySlug, sanitizeExcerpt } from 'lib/posts';
import Metadata from 'components/Metadata';
import { FaMapPin } from 'react-icons/fa';
import styles from './PostCard.module.scss';
import React from 'react';

interface Post {
  title: string;
  excerpt?: string;
  slug: string;
  date?: string;
  author?: object;
  categories?: object[];
  isSticky?: boolean;
}

interface PostCardOptions {
  excludeMetadata?: string[];
}

interface PostCardProps {
  post: Post;
  options?: PostCardOptions;
}

const PostCard: React.FC<PostCardProps> = ({ post, options = {} }) => {
  const { title, excerpt, slug, date, author, categories, isSticky = false } = post;
  const { excludeMetadata = [] } = options;

  const metadata: Record<string, any> = {};

  if (!excludeMetadata.includes('author')) {
    metadata.author = author;
  }

  if (!excludeMetadata.includes('date')) {
    metadata.date = date;
  }

  if (!excludeMetadata.includes('categories')) {
    metadata.categories = categories;
  }

  let postCardStyle = styles.postCard;

  if (isSticky) {
    postCardStyle = `${postCardStyle} ${styles.postCardSticky}`;
  }

  return (
    <div className={postCardStyle}>
      {isSticky && <FaMapPin aria-label="Sticky Post" />}
      <Link href={postPathBySlug(slug)}>
        <h3
          className={styles.postCardTitle}
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
      </Link>
      <Metadata className={styles.postCardMetadata} {...metadata} />
      {excerpt && (
        <div
          className={styles.postCardContent}
          dangerouslySetInnerHTML={{
            __html: sanitizeExcerpt(excerpt),
          }}
        />
      )}
    </div>
  );
};

export default PostCard;
