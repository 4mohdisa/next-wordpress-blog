import React, { ReactNode } from 'react';
import ClassName from '../../models/Classname';
import styles from './Image.module.scss';

interface ImageProps {
  children?: ReactNode;
  className?: string;
  width?: "100%" | number;
  height?: "auto" | number;
  src: string;
  alt?: string;
  srcSet?: string;
  sizes?: string;
  dangerouslySetInnerHTML?: string;
}

const Image: React.FC<ImageProps> = ({
  children,
  className,
  width = '100%',
  height = 'auto',
  src,
  alt,
  srcSet,
  sizes,
  dangerouslySetInnerHTML,
}) => {
  const imageClassName = new ClassName(styles.image);

  imageClassName.addIf(className, className);

  return (
    <figure className={imageClassName.toString()}>
      <div className={styles.featuredImageImg}>
        <img
          width={width}
          height={height}
          src={src}
          alt={alt || ''}
          srcSet={srcSet}
          sizes={sizes}
        />
      </div>
      {children && <figcaption>{children}</figcaption>}
      {dangerouslySetInnerHTML && (
        <figcaption
          dangerouslySetInnerHTML={{
            __html: dangerouslySetInnerHTML,
          }}
        />
      )}
    </figure>
  );
};

export default Image;
