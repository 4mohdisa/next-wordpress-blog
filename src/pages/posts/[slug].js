import { getPostBySlug, getRecentPosts, getAllPosts } from '../../lib/posts';
import { WebpageJsonLd, ArticleJsonLd } from '../../lib/json-ld';
import { categoryPathBySlug } from '../../lib/categories';
import { formatDate } from '../../lib/datetime';
import styles from '../../styles/pages/Post.module.scss';
import useSite from '../../hooks/use-site';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Header from '../../components/Header';
import Section from '../../components/Section';
import Container from '../../components/Container';
import Content from '../../components/Content';
import Metadata from '../../components/Metadata';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';
import Helmet from 'react-helmet';

const ThemeProvider = dynamic(() => import('next-themes').then(mod => mod.ThemeProvider), {
  ssr: false,
});

export default function Post({ post, socialImage = null, related = [] }) {
  const { metadata: siteMetadata = {} } = useSite();
  const { homepage } = useSite();
  const router = useRouter();
  const { asPath } = router;

  const {
    title,
    content,
    date,
    author,
    categories,
    modified,
    featuredImage,
    isSticky = false,
  } = post;

  const metadataOptions = {
    compactCategories: false,
  };

  if (!post.og) {
    post.og = {};
  }

  post.og.imageUrl = `${homepage}${socialImage}`;
  post.og.imageSecureUrl = post.og.imageUrl;
  post.og.imageWidth = 2000;
  post.og.imageHeight = 1000;

  const helmetSettings = {
    defaultTitle: siteMetadata.title,
    titleTemplate:
      process.env.WORDPRESS_PLUGIN_SEO === 'true' ? '%s' : `%s - ${siteMetadata.title}`,
  };

  const metaTitle = post.metadata?.title || title;
  const metaDescription = post.metadata?.description || '';

  const socialImageUrl =
    socialImage && process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}${socialImage}`
      : null;

  const metaOptions = {
    title: `${metaTitle} - ${siteMetadata.title}`,
    description: metaDescription,
    canonicalPath: asPath,
    imageUrl: socialImageUrl,
  };

  const jsonLdOptions = {
    ...post,
    siteTitle: siteMetadata.title,
    canonicalPath: asPath,
  };

  if (!post) {
    return (
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
        <Layout>
          <Container>
            <h1>Post not found</h1>
            <p>The requested post could not be found.</p>
          </Container>
        </Layout>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <Layout>
        <Helmet {...helmetSettings}>
          <title>{title}</title>
          {socialImage ? <meta property="og:image" content={socialImage} /> : null}
        </Helmet>
        <WebpageJsonLd {...metaOptions} />
        <ArticleJsonLd {...jsonLdOptions} />
        <Container>
          <article className={styles.post}>
            <Header>
              {featuredImage && <img src={featuredImage.sourceUrl} alt={featuredImage.altText} />}
              <p className={styles.postModified}>Last updated on {formatDate(modified)}</p>
              <h1
                className={styles.postTitle}
                dangerouslySetInnerHTML={{
                  __html: title,
                }}
              />
              <Metadata
                className={styles.postMetadata}
                date={date}
                author={author}
                categories={categories}
                options={metadataOptions}
                isSticky={isSticky}
              />
            </Header>

            <Content>
              <div
                className={styles.postContent}
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
            </Content>

            <Section className={styles.postFooter}>
              {Array.isArray(related) && related.length > 0 && (
                <div className={styles.relatedPosts}>
                  <span>Related Posts</span>
                  <ul>
                    {related.map(post => (
                      <li key={post.id}>
                        <Link href={`/posts/${post.slug}`}>
                          <a>{post.title}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Section>
          </article>
        </Container>
      </Layout>
    </ThemeProvider>
  );
}

export async function getStaticProps({ params = {} } = {}) {
  try {
    const { post, socialImage = null } = await getPostBySlug(params?.slug);

    if (!post) {
      return {
        notFound: true,
      };
    }

    // Generate social image if needed
    const postSocialImage = socialImage || post?.featuredImage?.sourceUrl || null;

    return {
      props: {
        post,
        socialImage: postSocialImage,
        related: post.related || [],
      },
      revalidate: 60 * 60, // Revalidate every hour
    };
  } catch (e) {
    console.error(`[getStaticProps] Error fetching post: ${e.message}`);
    return {
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  try {
    // First try to get the count from environment variable
    const count = parseInt(process.env.POSTS_PRERENDER_COUNT, 10) || 5;

    // Try to get recent posts first
    let posts = [];
    try {
      const recentPosts = await getRecentPosts({
        count,
        queryIncludes: 'index',
      });
      posts = recentPosts.posts || [];
    } catch (e) {
      console.warn('[getStaticPaths] Failed to get recent posts, falling back to getAllPosts');
      // Fallback to getting all posts if getRecentPosts fails
      const allPosts = await getAllPosts({
        queryIncludes: 'index',
      });
      posts = (allPosts.posts || []).slice(0, count);
    }

    // Filter out posts without slugs and create paths
    const paths = posts
      .filter(post => post && typeof post.slug === 'string')
      .map(post => ({
        params: {
          slug: post.slug,
        },
      }));

    return {
      paths,
      // Use blocking fallback to ensure SEO for posts not pre-rendered
      fallback: 'blocking',
    };
  } catch (e) {
    console.error(`[getStaticPaths] Error generating paths: ${e.message}`);
    // Return minimal paths array with fallback true to prevent build failure
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}
