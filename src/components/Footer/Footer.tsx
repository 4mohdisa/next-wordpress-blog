import React, { FC } from 'react';
import Link from 'next/link';
import useSite from 'hooks/use-site';
import { postPathBySlug } from 'lib/posts';
import { categoryPathBySlug } from 'lib/categories';
import Section from 'components/Section';
import Container from 'components/Container';
import styles from './Footer.module.scss';

interface Post {
  id: string;
  slug: string;
  title: string;
}

interface Category {
  id: string;
  slug: string;
  name: string;
}

const Footer: React.FC = () => {
  const { metadata = {}, recentPosts = [], categories = [] } = useSite();
  const { title } = metadata;

  const hasRecentPosts = Array.isArray(recentPosts) && recentPosts.length > 0;
  const hasRecentCategories = Array.isArray(categories) && categories.length > 0;
  const hasMenu = hasRecentPosts || hasRecentCategories;

  return (
    <footer className={styles.footer}>
      {hasMenu && (
        <Section className={styles.footerMenu}>
          <Container className={undefined}>
            <ul className={styles.footerMenuColumns}>
              {hasRecentPosts && (
                <li>
                  <Link href="/posts/" className={styles.footerMenuTitle}>
                    <strong>Recent Posts</strong>
                  </Link>
                  <ul className={styles.footerMenuItems}>
                    {recentPosts.map((post: Post) => {
                      const { id, slug, title } = post;
                      return (
                        <li key={id}>
                          <Link href={postPathBySlug(slug)}>
                            {title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              )}
              {hasRecentCategories && (
                <li>
                  <Link href="/categories/" className={styles.footerMenuTitle}>

                    <strong>Categories</strong>

                  </Link>
                  <ul className={styles.footerMenuItems}>
                    {categories.map((category: Category) => {
                      const { id, slug, name } = category;
                      return (
                        <li key={id}>
                          <Link href={categoryPathBySlug(slug)}>
                            {name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              )}
              <li>
                <p className={styles.footerMenuTitle}>
                  <strong>More</strong>
                </p>
                <ul className={styles.footerMenuItems}>
                  <li>
                    <a href="/feed.xml">RSS</a>
                  </li>
                  <li>
                    <a href="/sitemap.xml">Sitemap</a>
                  </li>
                </ul>
              </li>
            </ul>
          </Container>
        </Section>
      )}

      <Section className={styles.footerLegal}>
        <Container className={undefined}>
          <p>
            &copy; {new Date().getFullYear()} {title}
          </p>
        </Container>
      </Section>
    </footer>
  );
};

export default Footer;