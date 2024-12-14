import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import styles from './Layout.module.scss';
import { useTheme } from 'next-themes';
import useSite from '../../hooks/use-site';
import { helmetSettingsFromMetadata } from '../../lib/site';
import Nav from '../../components/Nav';
import Main from '../../components/Main';
import Footer from '../../components/Footer';
import React, { ReactNode, useEffect } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { asPath } = router;
  const { theme } = useTheme();
  const { homepage, metadata = {} } = useSite();

  useEffect(() => {
    // Update data-theme attribute when theme changes
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  if (!metadata.og) {
    metadata.og = {};
  }

  metadata.og.url = `${homepage}${asPath}`;

  const helmetSettings = {
    defaultTitle: metadata.title,
    titleTemplate: process.env.WORDPRESS_PLUGIN_SEO === 'true' ? '%s' : `%s - ${metadata.title}`,
    ...helmetSettingsFromMetadata(metadata),
  };

  return (
    <div className={styles.wrapper}>
      <Helmet {...helmetSettings} />

      <Nav />

      <Main>{children}</Main>

      <Footer />
    </div>
  );
};

export default Layout;
