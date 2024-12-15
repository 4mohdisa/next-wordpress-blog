import {
  useEffect,
  useRef,
  useState,
  useCallback,
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from 'react';
import Link from 'next/link';
import { Search, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import useSite from '../../hooks/use-site';
import useSearch, { SEARCH_STATE_LOADED } from '../../hooks/use-search';
import { postPathBySlug } from '../../lib/posts';
import { findMenuByLocation, MENU_LOCATION_NAVIGATION_DEFAULT } from '../../lib/menus';

import { Button } from '../../@/components/ui/button';
import { Input } from '../../@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '../../@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../../@/components/ui/navigation-menu';
import { getAllCategories } from '../../lib/categories';
import { getAllAuthors } from '../../lib/users';
import { UrlObject } from 'url';

const SEARCH_VISIBLE = 'visible';
const SEARCH_HIDDEN = 'hidden';
const MAX_TITLE_LENGTH = 50; // Maximum characters for title before truncation

interface SearchResult {
  slug: string;
  title: string;
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const Nav = () => {
  const { query, results, search, clearSearch } = useSearch({
    maxResults: 5,
  });

  const searchIsLoaded = results.length > 0;
  const { theme, setTheme } = useTheme();
  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  const [searchVisibility, setSearchVisibility] = useState(SEARCH_HIDDEN);
  const [searchQuery, setSearchQuery] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const mobileFormRef = useRef<HTMLFormElement>(null);

  const { metadata = {}, menus } = useSite();
  const { title } = metadata;

  const navigationLocation =
    process.env.WORDPRESS_MENU_LOCATION_NAVIGATION || MENU_LOCATION_NAVIGATION_DEFAULT;
  const navigation = findMenuByLocation(menus, navigationLocation);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { categories } = await getAllCategories();
        const { authors } = await getAllAuthors();
        setCategories(categories?.map((category: { name: string }) => category.name) || []);
        setAuthors(authors?.map((author: { name: string }) => author.name) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleOnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchQuery(value);
    setSearchVisibility(value.length > 0 ? SEARCH_VISIBLE : SEARCH_HIDDEN);
    search({ query: value });
  };

  const handleMobileSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchQuery(value);
    setMobileSearchVisible(value.length > 0);
    search({ query: value });
  };

  const handleOnDocumentClick = useCallback(
    (e: MouseEvent) => {
      if (!formRef.current?.contains(e.target as Node)) {
        setSearchVisibility(SEARCH_HIDDEN);
        setSearchQuery('');
        clearSearch();
      }
      if (!mobileFormRef.current?.contains(e.target as Node)) {
        setMobileSearchVisible(false);
        setSearchQuery('');
        clearSearch();
      }
    },
    [clearSearch]
  );

  useEffect(() => {
    if (searchVisibility === SEARCH_VISIBLE || mobileSearchVisible) {
      document.body.addEventListener('click', handleOnDocumentClick, true);
      const searchInput = (
        searchVisibility === SEARCH_VISIBLE ? formRef.current : mobileFormRef.current
      )?.querySelector('input[type="search"]') as HTMLInputElement;
      searchInput?.focus();
    }
    return () => {
      document.body.removeEventListener('click', handleOnDocumentClick, true);
    };
  }, [searchVisibility, mobileSearchVisible, handleOnDocumentClick]);

  const renderSearchResults = (results: SearchResult[], isMobile: boolean = false) => (
    <ul
      className={`absolute ${isMobile ? 'top-[100%] left-0 right-0' : 'top-full left-0'} w-full mt-1 bg-white dark:bg-[#1E1E1E] border border-border-default rounded-md shadow-lg max-h-[300px] overflow-y-auto z-50`}
    >
      {results.map(({ slug, title }) => (
        <li key={slug}>
          <Link
            href={postPathBySlug(slug)}
            className="block px-3 py-2 text-black dark:text-white hover:bg-highlighted-bg dark:hover:bg-[#333333] truncate"
            title={title}
          >
            {truncateText(title, MAX_TITLE_LENGTH)}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-gray-100 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl text-black dark:text-white font-bold hover:text-link-default transition-colors"
            >
              {title}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {navigation?.map(
                  (listItem: {
                    id: Key | null | undefined;
                    path: string | UrlObject;
                    label:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<AwaitedReactNode>
                      | null
                      | undefined;
                  }) => (
                    <NavigationMenuItem key={listItem.id}>
                      <Link href={listItem.path} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={`${navigationMenuTriggerStyle()} text-black dark:text-white hover:text-link-default dark:hover:text-link-hover`}
                        >
                          {listItem.label}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  )
                )}

                {/* Categories Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-black dark:text-white">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-2 p-4 bg-white dark:bg-[#1E1E1E] shadow-lg rounded-md max-h-[60vh] overflow-y-auto">
                      {categories.map(category => (
                        <li key={category}>
                          <Link
                            href={`/categories/${category.toLowerCase()}`}
                            className="block p-2 text-black dark:text-white hover:bg-highlighted-bg dark:hover:bg-[#333333] rounded-md transition-colors truncate"
                            title={category}
                          >
                            {category}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Authors Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-black dark:text-white">
                    Authors
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-2 p-4 bg-white dark:bg-[#1E1E1E] shadow-lg rounded-md max-h-[60vh] overflow-y-auto">
                      {authors.map(author => (
                        <li key={author}>
                          <Link
                            href={`/authors/${author.toLowerCase()}`}
                            className="block p-2 text-black dark:text-white hover:bg-highlighted-bg dark:hover:bg-[#333333] rounded-md transition-colors truncate"
                            title={author}
                          >
                            {author}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Search and Theme Toggle */}
            <div className="flex items-center space-x-4">
              <form ref={formRef} className="relative" onSubmit={e => e.preventDefault()}>
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-[250px] bg-white dark:bg-[#1E1E1E] text-black dark:text-white border-border-default"
                  value={searchQuery}
                  onChange={handleOnSearch}
                />
                {results.length > 0 &&
                  searchVisibility === SEARCH_VISIBLE &&
                  renderSearchResults(results)}
              </form>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-black dark:text-white"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-black dark:text-white"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-black dark:text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-[300px] bg-white dark:bg-black border-l border-border-default p-0 h-full"
              >
                <div className="p-6 relative">
                  <SheetHeader>
                    <div className="flex justify-between items-center">
                      <SheetTitle className="text-black dark:text-white font-sans">
                        {title}
                      </SheetTitle>
                      <SheetClose className="text-black dark:text-white">
                        <X className="h-5 w-5" />
                      </SheetClose>
                    </div>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {/* Search in mobile drawer */}
                    <form
                      ref={mobileFormRef}
                      className="relative"
                      onSubmit={e => e.preventDefault()}
                    >
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full bg-white dark:bg-[#1E1E1E] text-black dark:text-white border-border-default"
                        value={searchQuery}
                        onChange={handleMobileSearch}
                      />
                      {results.length > 0 && mobileSearchVisible && (
                        <div className="relative w-full">{renderSearchResults(results, true)}</div>
                      )}
                    </form>

                    {/* Navigation Links */}
                    <div className="space-y-2">
                      {navigation?.map(
                        (listItem: {
                          id: Key | null | undefined;
                          path: string | UrlObject;
                          label:
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactElement<any, string | JSXElementConstructor<any>>
                            | Iterable<ReactNode>
                            | ReactPortal
                            | Promise<AwaitedReactNode>
                            | null
                            | undefined;
                        }) => (
                          <Link
                            key={listItem.id}
                            href={listItem.path}
                            className="block py-2 text-black dark:text-white hover:text-link-default dark:hover:text-link-hover font-medium"
                          >
                            {listItem.label}
                          </Link>
                        )
                      )}
                    </div>

                    {/* Categories */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-black dark:text-white font-sans">
                        Categories
                      </h3>
                      <div className="max-h-[200px] overflow-y-auto">
                        {categories.map(category => (
                          <Link
                            key={category}
                            href={`/categories/${category.toLowerCase()}`}
                            className="block py-2 text-gray-600 dark:text-gray-300 hover:text-link-default dark:hover:text-link-hover truncate"
                            title={category}
                          >
                            {category}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Authors */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-black dark:text-white font-sans">
                        Authors
                      </h3>
                      <div className="max-h-[200px] overflow-y-auto">
                        {authors.map(author => (
                          <Link
                            key={author}
                            href={`/authors/${author.toLowerCase()}`}
                            className="block py-2 text-gray-600 dark:text-gray-300 hover:text-link-default dark:hover:text-link-hover truncate"
                            title={author}
                          >
                            {author}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
