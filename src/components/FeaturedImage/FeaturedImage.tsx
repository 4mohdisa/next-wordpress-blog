import ClassName from '../../models/Classname';
import Image from '../../components/Image';
import styles from './FeaturedImage.module.scss';
import React from 'react';

interface FeaturedImageProps {
  className?: string;
  alt: string;
  src?: string;
  srcSet?: string;
  sizes?: string;
  [key: string]: any; // For any other props passed to the Image component
}

const FeaturedImage: React.FC<FeaturedImageProps> = ({ className, alt, src = '', srcSet, sizes, ...rest }) => {
  const featuredImageClassName = new ClassName(styles.featuredImage);

  featuredImageClassName.addIf(className, className);

  return (
    <Image
      children={undefined} dangerouslySetInnerHTML={undefined} className={featuredImageClassName.toString()}
      alt={alt}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      {...rest}    />
  );
};

export default FeaturedImage;
