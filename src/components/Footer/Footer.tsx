import React from 'react';
import Link from 'next/link';
import useSite from '../../hooks/use-site';
import { postPathBySlug } from '../../lib/posts';
import { categoryPathBySlug } from '../../lib/categories';
import Section from '../../components/Section';
import Container from '../../components/Container';
import { useTheme } from 'next-themes'; // Import useTheme
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
  const { theme } = useTheme(); // Get the current theme

  const hasRecentPosts = Array.isArray(recentPosts) && recentPosts.length > 0;
  const hasRecentCategories = Array.isArray(categories) && categories.length > 0;
  const hasMenu = hasRecentPosts || hasRecentCategories;

  return (
    <footer className={"bg-gray-100 text-gray-800 border-t border-gray-300 dark:bg-slate-900 dark:text-gray-200 dark:border-gray-700"}>
      {hasMenu && (
        <Section className="mx-0 my-8">
          <Container>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-xl mx-auto px-4 p-0 list-none">
              {hasRecentPosts && (
                <li>
                  <Link href="/posts/" className={"font-semibold tracking-wide text-4xl sm:text-3xl md:text-2xl lg:text-xl text-slate-800 dark:text-white"}>
                    Recent Posts
                  </Link>
                  <ul className="mt-4">
                    {recentPosts.map((post: Post) => {
                      const { id, slug, title } = post;
                      return (
                        <li key={id} className='mb-4 basis-full md:basis-1/2 lg:basis-1/3'>
                          <Link href={postPathBySlug(slug)} className='text-slate-800 dark:text-slate-300 block text-3xl sm:text-2xl md:text-xl lg:text-base hover:text-blue-500 hover:underline no-underline whitespace-nowrap overflow-hidden text-ellipsis transition-colors last:mb-0'>
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
                  <Link href="/categories/" className={"font-semibold tracking-wide text-4xl sm:text-3xl md:text-2xl lg:text-xl text-gray-800 dark:text-white"}>
                    Categories
                  </Link>
                  <ul className="mt-4">
                    {categories.map((category: Category) => {
                      const { id, slug, name } = category;
                      return (
                        <li key={id} className='mb-4 basis-full md:basis-1/2 lg:basis-1/3'>
                          <Link href={categoryPathBySlug(slug)} className='text-slate-800 dark:text-slate-300'>
                            {name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              )}
              <li>
                <h2 className={"font-semibold tracking-wide text-4xl sm:text-3xl md:text-2xl lg:text-xl text-gray-800 dark:text-white"}>
                  More
                </h2>
                <ul className="mt-4">
                  <li className='mb-4 basis-full md:basis-1/2 lg:basis-1/3'>
                    <a href="/feed.xml" className='text-slate-800 dark:text-slate-300'>RSS</a>
                  </li>
                  <li className='mb-4 basis-full md:basis-1/2 lg:basis-1/3'>
                    <a href="/sitemap.xml" className='text-slate-800 dark:text-slate-300'>Sitemap</a>
                  </li>
                </ul>
              </li>
            </ul>
          </Container>
        </Section>
      )}

      <Section className='text-center text-3xl sm:text-2xl md:text-xl lg:text-base text-gray-500 bg-gray-200 py-4 mt-8 dark:text-gray-400 dark:bg-gray-950 mb-0!'>
        <Container>
          <p className='m-0'>
            &copy; {new Date().getFullYear()} {title}
          </p>
        </Container>
      </Section>
    </footer>
  );
};

export default Footer;