import Link from 'next/link';
import { Helmet } from 'react-helmet';

import { getPostBySlug, getRecentPosts, getRelatedPosts, postPathBySlug } from 'lib/posts';
import { categoryPathBySlug } from 'lib/categories';
import { formatDate } from 'lib/datetime';
import { ArticleJsonLd } from 'lib/json-ld';
import { helmetSettingsFromMetadata } from 'lib/site';
import useSite from 'hooks/use-site';
import usePageMetadata from 'hooks/use-page-metadata';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';
import Content from 'components/Content';
import Metadata from 'components/Metadata';
import FeaturedImage from 'components/FeaturedImage';

import styles from 'styles/pages/Post.module.scss';

export default function Post({ post, socialImage, related }) {
  const {
    title,
    metaTitle,
    description,
    content,
    date,
    author,
    categories,
    modified,
    featuredImage,
    isSticky = false,
  } = post;

  const { metadata: siteMetadata = {}, homepage } = useSite();

  if (!post.og) {
    post.og = {};
  }

  post.og.imageUrl = `${homepage}${socialImage}`;
  post.og.imageSecureUrl = post.og.imageUrl;
  post.og.imageWidth = 2000;
  post.og.imageHeight = 1000;

  const { metadata } = usePageMetadata({
    metadata: {
      ...post,
      title: metaTitle,
      description: description || post.og?.description || `Read more about ${title}`,
    },
  });

  if (process.env.WORDPRESS_PLUGIN_SEO !== true) {
    metadata.title = `${title} - ${siteMetadata.title}`;
    metadata.og.title = metadata.title;
    metadata.twitter.title = metadata.title;
  }

  const metadataOptions = {
    compactCategories: false,
  };

  const { posts: relatedPostsList, title: relatedPostsTitle } = related || {};

  const helmetSettings = helmetSettingsFromMetadata(metadata);

  return (
    <Layout>
      <Helmet {...helmetSettings} />

      <ArticleJsonLd post={post} siteTitle={siteMetadata.title} />

      <Header>
        {featuredImage && (
          <FeaturedImage
            {...featuredImage}
            src={featuredImage.sourceUrl}
            dangerouslySetInnerHTML={featuredImage.caption}
          />
        )}
        <p className={`text-gray-500 text-center`}>Last updated on {formatDate(modified)}.</p>

        <h1
          className={`text-7xl leading-snug md:text-4xl md:leading-14  lg:text-5xl lg:leading-tight text-center font-bold  text-gray-900`}
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
        <Metadata
          className={`text-4xl md:text-2xl lg:text-xl text-center justify-center`}
          date={date}
          author={author}
          categories={categories}
          options={metadataOptions}
          isSticky={isSticky}
        />
      </Header>

      <Content>
        <Section>
          <Container>
            <div
              className={`text-4xl md:text-2xl lg:text-base ${styles.content}`}
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          </Container>
        </Section>
      </Content>

      <Section className={`text-center`}>
        <Container>
          {Array.isArray(relatedPostsList) && relatedPostsList.length > 0 && (
            <div className={`flex flex-col`}>
              {relatedPostsTitle.name ? (
                <span className='text-[1.2em] mb-[0.4em]'>
                  More from <Link href={relatedPostsTitle.link}>{relatedPostsTitle.name}</Link>
                </span>
              ) : (
                <span>More Posts</span>
              )}
              <ul className='list-none' >
                {relatedPostsList.map((post) => (
                  <li key={post.title}>
                    <Link href={postPathBySlug(post.slug)}>{post.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps({ params = {} } = {}) {
  const { post } = await getPostBySlug(params?.slug);

  if (!post) {
    return {
      props: {},
      notFound: true,
    };
  }

  const { categories, databaseId: postId } = post;

  const props = {
    post,
    socialImage: `${process.env.OG_IMAGE_DIRECTORY}/${params?.slug}.png`,
  };

  const { category: relatedCategory, posts: relatedPosts } = (await getRelatedPosts(categories, postId)) || {};
  const hasRelated = relatedCategory && Array.isArray(relatedPosts) && relatedPosts.length;

  if (hasRelated) {
    props.related = {
      posts: relatedPosts,
      title: {
        name: relatedCategory.name || null,
        link: categoryPathBySlug(relatedCategory.slug),
      },
    };
  }

  return {
    props,
  };
}

export async function getStaticPaths() {
  // Only render the most recent posts to avoid spending unecessary time
  // querying every single post from WordPress

  // Tip: this can be customized to use data or analytitcs to determine the
  // most popular posts and render those instead

  const { posts } = await getRecentPosts({
    count: process.env.POSTS_PRERENDER_COUNT, // Update this value in next.config.js!
    queryIncludes: 'index',
  });

  const paths = posts
    .filter(({ slug }) => typeof slug === 'string')
    .map(({ slug }) => ({
      params: {
        slug,
      },
    }));

  return {
    paths,
    fallback: 'blocking',
  };
}
