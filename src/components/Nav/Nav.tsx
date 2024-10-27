import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, Menu, Moon, Sun, AlignJustify } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../@/components/ui/dropdown-menu"
import { getAllCategories } from '../../lib/categories';
import { getAllAuthors } from '../../lib/users';

const SEARCH_VISIBLE = 'visible';
const SEARCH_HIDDEN = 'hidden';

const Nav: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [searchVisibility, setSearchVisibility] = useState<string>(SEARCH_HIDDEN);
  const [searchWidth, setSearchWidth] = useState<string>("0%");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      setSearchWidth("0%");
      return;
    }

    addDocumentOnClick();
    addResultsRoving();
    setSearchWidth("100%");

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

  function handleOnToggleSearch() {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        const searchInput = formRef.current?.querySelector('input[type="search"]') as HTMLInputElement | null;
        searchInput?.focus();
      }, 100);
    } else {
      clearSearch();
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
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl hover:no-underline no-underline transition-all hover:text-blue-600 dark:hover:text-white font-bold text-slate-900 dark:text-white">
              {title}
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
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
                  <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] bg-slate-50 dark:bg-slate-800 md:grid-cols-2 lg:w-[600px]">
                      {categories.map((category) => (
                        <li key={category}>
                          <NavigationMenuLink asChild>
                            <Link
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline hover:no-underline outline-none "
                              href={`/category/${category.toLowerCase()}`}
                            >
                              <div className="text-sm font-normal leading-none text-slate-900 transition-colors hover:text-blue-600  dark:text-slate-200 ">{category}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Authors</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 bg-slate-50 dark:bg-slate-800 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {authors.map((author) => (
                        <li key={author}>
                          <NavigationMenuLink asChild>
                            <Link
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline hover:no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              href={`/author/${author.toLowerCase().replace(' ', '-')}`}
                            >
                              <div className="text-sm font-normal leading-none text-slate-900 transition-colors hover:text-blue-600  dark:text-slate-200 ">{author}</div>
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
        <div className="relative flex items-center ">
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOnToggleSearch}
            disabled={!searchIsLoaded}
            aria-label="Toggle Search"
            className="text-slate-700 dark:text-slate-200 z-10"
          >
            <Search className="h-5 w-5" />
          </Button>
          <form 
            ref={formRef} 
            action="/search" 
            className={`absolute right-0 transition-all duration-300 ease-in-out ${
              isSearchOpen ? 'w-full sm:w-64 opacity-100' : 'w-0 opacity-0'
            }`}
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="search"
              name="q"
              value={query || ''}
              onChange={handleOnSearch}
              className="w-full h-10 pl-10 pr-4 text-sm transition-all duration-300 ease-in-out rounded-full border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary"
              placeholder="Search..."
              required
            />
            {isSearchOpen && (query?.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden">
                {results.length > 0 ? (
                  <ul className="py-2 max-h-96 overflow-y-auto">
                    {results.map(({ slug, title }: any, index: number) => (
                      <li key={slug}>
                        <Link
                          href={postPathBySlug(slug)}
                          className="block px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition duration-150 ease-in-out"
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
          
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Nav;
