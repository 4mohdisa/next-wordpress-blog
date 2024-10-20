import { useEffect, useRef, useState, useCallback, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';

import useSite from '../../hooks/use-site';
import useSearch, { SEARCH_STATE_LOADED } from '../../hooks/use-search';
import { postPathBySlug } from '../../lib/posts';
import { findMenuByLocation, MENU_LOCATION_NAVIGATION_DEFAULT } from '../../lib/menus';

import Section from '../../components/Section';

import styles from './Nav.module.scss';
import NavListItem from '../../components/NavListItem';
import React from 'react';

const SEARCH_VISIBLE = 'visible';
const SEARCH_HIDDEN = 'hidden';

const Nav: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const [searchVisibility, setSearchVisibility] = useState<string>(SEARCH_HIDDEN);

  const { metadata = {}, menus } = useSite();
  const { title } = metadata;

  const navigationLocation = process.env.WORDPRESS_MENU_LOCATION_NAVIGATION || MENU_LOCATION_NAVIGATION_DEFAULT;
  const navigation = findMenuByLocation(menus, navigationLocation);

  interface SearchResult {
    slug: string;
    title: string;
  }

  const { query, results, search, clearSearch, state } = useSearch({
    maxResults: 5,
  });

  const searchIsLoaded = state === SEARCH_STATE_LOADED;

  useEffect(() => {
    if (searchVisibility === SEARCH_HIDDEN) {
      removeDocumentOnClick();
      return;
    }

    addDocumentOnClick();
    addResultsRoving();

    const searchInput = Array.from(formRef.current?.elements ?? []).find(
      (input) => (input as HTMLInputElement).type === 'search'
    ) as HTMLInputElement | undefined;

    searchInput?.focus();

    return () => {
      removeResultsRoving();
      removeDocumentOnClick();
    };
  }, [searchVisibility]);

  function addDocumentOnClick() {
    document.body.addEventListener('click', handleOnDocumentClick, true);
  }

  function removeDocumentOnClick() {
    document.body.removeEventListener('click', handleOnDocumentClick, true);
  }

  function handleOnDocumentClick(e: MouseEvent) {
    if (!e.composedPath().includes(formRef.current as EventTarget)) {
      setSearchVisibility(SEARCH_HIDDEN);
      clearSearch();
    }
  }

  function handleOnSearch(e: ChangeEvent<HTMLInputElement>) {
    search({
      query: e.currentTarget.value,
    });
  }

  function handleOnToggleSearch() {
    setSearchVisibility(SEARCH_VISIBLE);
  }

  function addResultsRoving() {
    document.body.addEventListener('keydown', handleResultsRoving);
  }

  function removeResultsRoving() {
    document.body.removeEventListener('keydown', handleResultsRoving);
  }

  function handleResultsRoving(e: KeyboardEvent) {
    const focusElement = document.activeElement;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (focusElement?.nodeName === 'INPUT' && focusElement.nextElementSibling?.children[0]?.nodeName !== 'P') {
        (focusElement.nextElementSibling?.children[0]?.firstChild as HTMLElement)?.focus();
      } else if (focusElement?.parentElement?.nextElementSibling) {
        (focusElement.parentElement.nextElementSibling.firstChild as HTMLElement)?.focus();
      } else {
        (focusElement?.parentElement?.parentElement?.firstChild?.firstChild as HTMLElement)?.focus();
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (focusElement?.nodeName === 'A' && focusElement.parentElement?.previousElementSibling) {
        (focusElement.parentElement.previousElementSibling.firstChild as HTMLElement)?.focus();
      } else {
        (focusElement?.parentElement?.parentElement?.lastChild?.firstChild as HTMLElement)?.focus();
      }
    }
  }

  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      clearSearch();
      setSearchVisibility(SEARCH_HIDDEN);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  return (
    <nav className={styles.nav}>
      <Section className={styles.navSection}>
        <p className={styles.navName}>
          <Link href="/">{title}</Link>
        </p>
        <ul className={styles.navMenu}>
          {navigation?.map((listItem: { id: string; label: string; [key: string]: any }) => (
            <NavListItem key={listItem.id} className={styles.navSubMenu} item={listItem} />
          ))}
        </ul>
        <div className={styles.navSearch}>
          {searchVisibility === SEARCH_HIDDEN && (
            <button onClick={handleOnToggleSearch} disabled={!searchIsLoaded}>
              <span className="sr-only">Toggle Search</span>
              <FaSearch />
            </button>
          )}
          {searchVisibility === SEARCH_VISIBLE && (
            <form ref={formRef} action="/search" data-search-is-active={!!query}>
              <input
                type="search"
                name="q"
                value={query || ''}
                onChange={handleOnSearch}
                autoComplete="off"
                placeholder="Search..."
                required
              />
              <div className={styles.navSearchResults}>
                {results.length > 0 ? (
                  <ul>
                    {results.map(({ slug, title }: any, index: number | undefined) => (
                      <li key={slug}>
                        <Link tabIndex={index} href={postPathBySlug(slug)}>
                          {title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    Sorry, not finding anything for <strong>{query}</strong>
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </Section>
    </nav>
  );
};

export default Nav;
