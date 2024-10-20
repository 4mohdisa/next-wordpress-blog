import React, { ReactNode } from 'react';
import Container from '../Container/Container';
import styles from './Header.module.scss';

interface HeaderProps {
  children: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className={styles.header}>
      <Container>{children}</Container>
    </header>
  );
};

export default Header;
