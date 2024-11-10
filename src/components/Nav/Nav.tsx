import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from 'next-themes';

import useSite from '../../hooks/use-site';
import useSearch, { SEARCH_STATE_LOADED } from '../../hooks/use-search';
import { postPathBySlug } from '../../lib/posts';
import { findMenuByLocation, MENU_LOCATION_NAVIGATION_DEFAULT } from '../../lib/menus';

import { Button } from "../../@/components/ui/button"
import { Input } from "../../@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../../@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../../@/components/ui/navigation-menu"
import { getAllCategories } from '../../lib/categories';
import { getAllAuthors } from '../../lib/users';

const SEARCH_VISIBLE = 'visible';
const SEARCH_HIDDEN = 'hidden';

const Nav: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [searchVisibility, setSearchVisibility] = useState<string>(SEARCH_HIDDEN);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { metadata = {}, menus } = useSite();
  const { title } = metadata;

  const navigationLocation = process.env.WORDPRESS_MENU_LOCATION_NAVIGATION || MENU_LOCATION_NAVIGATION_DEFAULT;
  const navigation = findMenuByLocation(menus, navigationLocation);

  const { query, results, search, clearSearch, state } = useSearch({
    maxResults: 5,
  });

  const searchIsLoaded = state === SEARCH_STATE_LOADED;

  const { theme, setTheme } = useTheme()
  const [categories, setCategories] = useState<string[]>([])
  const [authors, setAuthors] = useState<string[]>([])

  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(false);

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const toggleAuthors = () => {
    setIsAuthorsOpen(!isAuthorsOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { categories } = await getAllCategories();
      const { authors } = await getAllAuthors();
      
      setCategories(categories.map((category: { name: any; }) => category.name));
      setAuthors(authors.map((author: { name: any; }) => author.name));
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchVisibility === SEARCH_HIDDEN) {
      removeDocumentOnClick();
      return;
    }

    addDocumentOnClick();
    addResultsRoving();

    const searchInput = formRef.current?.querySelector('input[type="search"]') as HTMLInputElement | null;
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
    if (!formRef.current?.contains(e.target as Node)) {
      setSearchVisibility(SEARCH_HIDDEN);
      clearSearch();
    }
  }

  function handleOnSearch(e: React.ChangeEvent<HTMLInputElement>) {
    search({
      query: e.currentTarget.value,
    });
  }

  function handleOnToggleSearch() {
    setSearchVisibility(searchVisibility === SEARCH_VISIBLE ? SEARCH_HIDDEN : SEARCH_VISIBLE);
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
    <nav className="sticky top-0 z-40 w-full border-b border-b-slate-200 bg-white dark:border-b-slate-700 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between lg:justify-start">
          <div className="flex items-center flex-1 lg:flex-none">
            <Link href="/" className="text-2xl font-bold text-slate-900 dark:text-white">
              {title}
            </Link>
          </div>

          <div className="hidden lg:flex items-center justify-center flex-1">
            <NavigationMenu>
              <NavigationMenuList>
                {navigation?.map((listItem: { id: string; label: string; path: string; [key: string]: any }) => (
                  <NavigationMenuItem key={listItem.id}>
                    <Link href={listItem.path} legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        {listItem.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className='dark:text-slate-50'>Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-slate-700 ">
                      {categories.map((category) => (
                        <li key={category}>
                          <NavigationMenuLink asChild>
                            <Link
                              className="block select-none dark:text-slate-100 space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              href={`/category/${category.toLowerCase()}`}
                            >
                              <div className="text-sm font-medium leading-none">{category}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className='dark:text-slate-50'>Authors</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-slate-700">
                      {authors.map((author) => (
                        <li key={author}>
                          <NavigationMenuLink asChild>
                            <Link
                              className="block select-none dark:text-slate-100 space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              href={`/author/${author.toLowerCase().replace(' ', '-')}`}
                            >
                              <div className="text-sm font-medium leading-none">{author}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center space-x-4 lg:flex-1 lg:justify-end">
            <div className="relative hidden lg:block">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOnToggleSearch}
                disabled={!searchIsLoaded}
                aria-label="Toggle Search"
                className="text-slate-700 dark:text-slate-200"
              >
                <Search className="h-5 w-5" />
              </Button>
              {searchVisibility === SEARCH_VISIBLE && (
                <form ref={formRef} action="/search" className="absolute right-0 top-full mt-2" data-search-is-active={!!query}>
                  <Input
                    type="search"
                    name="q"
                    value={query || ''}
                    onChange={handleOnSearch}
                    className="w-64 h-10 pl-10 pr-4 text-sm rounded-full border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
                    placeholder="Search..."
                    required
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  {(results.length > 0 || (query && results.length === 0)) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden w-[25vw]">
                      {results.length > 0 ? (
                        <ul className="py-2 max-h-96 overflow-y-auto">
                          {results.map(({ slug, title }: any, index: number) => (
                            <li key={slug}>
                              <Link
                                href={postPathBySlug(slug)}
                                className="block px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition duration-150 ease-in-out"
                                tabIndex={index}
                              >
                                {title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          No results found for <strong>{query}</strong>
                        </p>
                      )}
                    </div>
                  )}
                </form>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Theme"
              className="text-slate-700 dark:text-slate-200"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  {isDrawerOpen ? (
                    <X className="h-7 w-7 transition-transform duration-200 ease-in-out" />
                  ) : (
                    <Menu className="h-7 w-7 text-black dark:text-white transition-transform duration-200 ease-in-out" />
                  )}
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent   side="right" className="w-full sm:w-[35%] rounded-l-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                <nav className="flex flex-col space-y-4">
                  <form ref={formRef} action="/search" className="relative pt-5" data-search-is-active={!!query}>
                    <Input
                      type="search"
                      name="q"
                      value={query || ''}
                      onChange={handleOnSearch}
                      className="w-full h-10 pl-10 pr-4 text-sm rounded-full border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
                      placeholder="Search..."
                      required
                    />
                    {(results.length > 0 || (query && results.length === 0)) && (
                      <div className="absolute top-full left-0 mt-2 right-0 bg-slate-100 rounded-md dark:bg-slate-800 overflow-hidden z-20">
                        {results.length > 0 ? (
                          <ul className="py-2 max-h-96 overflow-y-auto">
                            {results.map(({ slug, title }: any, index: number) => (
                              <li key={slug}>
                                <Link
                                  href={postPathBySlug(slug)}
                                  className="block px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition duration-150 ease-in-out"
                                  tabIndex={index}
                                >
                                  {title}
                                </Link>
                              
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="px-4 py-3 text-slate-600 dark:text-slate-300">
                            No results found for <strong>{query}</strong>
                          </p>
                        )}
                      </div>
                    )}
                  </form>
                  {/* {navigation?.map((item: { id: string; label: string; path: string }) => (
                    <Link key={item.id} href={item.path} className="text-lg">
                      {item.label}
                    </Link>
                  ))} */}
                  <div className="flex flex-col text-left">
      {/* Categories Dropdown */}
      <div className="relative">
        <button
          onClick={toggleCategories}
          className="w-full text-left p-2 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-gray-300 focus:outline-none"
        >
          Categories
        </button>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${isCategoriesOpen ? 'max-h-40' : 'max-h-0'}`}
        >
          <ul className="grid gap-3 p-4 list-none bg-white dark:bg-slate-200">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/category/${category.toLowerCase()}`}
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline transition-colors hover:bg-blue-500 hover:text-white"
                >
                  <div className="text-sm font-medium leading-none">{category}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Authors Dropdown */}
      <div className="relative mt-4">
        <button
          onClick={toggleAuthors}
          className="w-full text-left p-2 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-gray-300 focus:outline-none"
        >
          Authors
        </button>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${isAuthorsOpen ? 'max-h-40' : 'max-h-0'}`}
        >
          <ul className="grid gap-3 list-none bg-white dark:bg-slate-200">
            {authors.map((author) => (
              <li key={author}>
                <Link
                  href={`/author/${author.toLowerCase().replace(' ', '-')}`}
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline transition-colors hover:bg-blue-500 hover:text-white"
                >
                  <div className="text-sm font-medium leading-none">{author}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;