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
    <footer className="bg-white dark:bg-black border-t border-border-default">
    {hasMenu && (
      <div className="mx-0 my-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 lg:gap-10 list-none">
            {hasRecentPosts && (
              <li>
                <Link
                  href="/posts/"
                  className="font-bold tracking-wide text-lg md:text-xl text-black dark:text-white block mb-4 hover:text-link-default dark:hover:text-link-hover"
                >
                  Recent Posts
                </Link>
                <ul>
                  {recentPosts.map((post: Post) => (
                    <li key={post.id} className="mb-2">
                      <Link
                        href={postPathBySlug(post.slug)}
                        className="text-sm md:text-base text-black dark:text-white hover:text-link-default dark:hover:text-link-hover transition-colors"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}
            {hasRecentCategories && (
              <li>
                <Link
                  href="/categories/"
                  className="font-bold tracking-wide text-lg md:text-xl text-black dark:text-white block mb-4 hover:text-link-default dark:hover:text-link-hover"
                >
                  Categories
                </Link>
                <ul>
                  {categories.map((category: Category) => (
                    <li key={category.id} className="mb-2">
                      <Link
                        href={categoryPathBySlug(category.slug)}
                        className="text-sm md:text-base text-black dark:text-white hover:text-link-default dark:hover:text-link-hover transition-colors"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}
            <li>
              <h2 className="font-bold tracking-wide text-lg md:text-xl text-black dark:text-white mb-4">
                More
              </h2>
              <ul>
                <li className="mb-2">
                  <a
                    href="/feed.xml"
                    className="text-sm md:text-base text-black dark:text-white hover:text-link-default dark:hover:text-link-hover transition-colors"
                  >
                    RSS
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="/sitemap.xml"
                    className="text-sm md:text-base text-black dark:text-white hover:text-link-default dark:hover:text-link-hover transition-colors"
                  >
                    Sitemap
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    )}
  
    {/* Copyright Section */}
    <div className="text-center text-sm md:text-base py-4 bg-white dark:bg-black text-black dark:text-white border-t border-border-default">
      <p className="m-0">
        &copy; {new Date().getFullYear()} {title}
      </p>
    </div>
  </footer>
  );
};

export default Footer;