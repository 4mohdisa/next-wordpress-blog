import Link from 'next/link';
import { Helmet } from 'react-helmet';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import config from '../../../package.json';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '../../@/components/ui/pagination';

const MAX_NUM_PAGES = 9;
const { homepage = '' } = config;

interface PaginationProps {
  pagesCount: number;
  currentPage: number;
  basePath: string;
  addCanonical?: boolean;
}

export default function PaginationComponent({
  pagesCount,
  currentPage,
  basePath,
  addCanonical = true,
}: PaginationProps) {
  const path = `${basePath}/page/`;

  const hasPreviousPage = pagesCount > 1 && currentPage > 1;
  const hasNextPage = pagesCount > 1 && currentPage < pagesCount;

  let hasPrevDots = false;
  let hasNextDots = false;

  function getPages() {
    let pages = pagesCount;
    let start = 0;
    if (pagesCount > MAX_NUM_PAGES) {
      pages = MAX_NUM_PAGES;
      const half = Math.ceil(MAX_NUM_PAGES / 2);
      const isHead = currentPage <= half;
      const isTail = currentPage > pagesCount - half;
      hasNextDots = !isTail;
      if (!isHead) {
        hasPrevDots = true;
        start = isTail ? pagesCount - MAX_NUM_PAGES : currentPage - half;
      }
    }
    return [...new Array(pages)].map((_, i) => i + 1 + start);
  }

  const pages = getPages();

  return (
    <>
      <Helmet>
        {addCanonical && !hasPreviousPage && (
          <link rel="canonical" href={`${homepage}${basePath}`} />
        )}
        {hasPreviousPage && <link rel="prev" href={`${homepage}${path}${currentPage - 1}`} />}
        {hasNextPage && <link rel="next" href={`${homepage}${path}${currentPage + 1}`} />}
      </Helmet>

      <Pagination className="my-8">
        <PaginationContent className="flex flex-wrap items-center justify-center gap-4">
          {/* Previous Button */}
          <PaginationItem className="mr-4 ">
            <PaginationLink
              href={`${path}${currentPage - 1}`}
              className={`flex items-center gap-1 px-3 py-2 text-sm rounded hover:no-underline transition-colors 
          ${
            hasPreviousPage
              ? 'text-black dark:text-white bg-white dark:bg-black border border-gray-300 dark:border-white hover:bg-gray-50 dark:hover:bg-gray-800'
              : 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-black cursor-not-allowed border-gray-300 dark:border-gray-700'
          }`}
              aria-label="Go to previous page"
              aria-disabled={!hasPreviousPage}
              tabIndex={!hasPreviousPage ? -1 : undefined}
              onClick={e => !hasPreviousPage && e.preventDefault()}
            >
              <ChevronLeft className="w-4 h-4" />
            </PaginationLink>
          </PaginationItem>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            {hasPrevDots && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {pages.map(page => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={`${path}${page}`}
                  className={`px-3 py-2 text-sm rounded hover:no-underline transition-colors
              ${
                page === currentPage
                  ? 'bg-primary text-black font-semibold border border-gray-300 dark:border-white'
                  : 'text-black dark:text-white bg-white dark:bg-black border border-gray-300 dark:border-white hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {hasNextDots && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </div>

          {/* Next Button */}
          <PaginationItem className="ml-4">
            <PaginationLink
              href={`${path}${currentPage + 1}`}
              className={`flex items-center gap-1 px-3 py-2 text-sm rounded hover:no-underline transition-colors
          ${
            hasNextPage
              ? 'text-black dark:text-white bg-white dark:bg-black border border-gray-300 dark:border-white hover:bg-gray-50 dark:hover:bg-gray-800'
              : 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-black border-gray-300 dark:border-gray-700 cursor-not-allowed'
          }`}
              aria-label="Go to next page"
              aria-disabled={!hasNextPage}
              tabIndex={!hasNextPage ? -1 : undefined}
              onClick={e => !hasNextPage && e.preventDefault()}
            >
              <ChevronRight className="w-4 h-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
