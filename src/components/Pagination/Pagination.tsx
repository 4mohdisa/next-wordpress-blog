import Link from "next/link";
import { Helmet } from "react-helmet";
import config from '../../../package.json';

import { GrPrevious as PreviousIcon, GrNext as NextIcon } from "react-icons/gr";
import { HiOutlineDotsHorizontal as Dots } from "react-icons/hi";

import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

const MAX_NUM_PAGES = 9;

const { homepage = "" } = config;

interface PaginationProps {
  pagesCount: number;
  currentPage: number;
  basePath: string;
  addCanonical?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  pagesCount,
  currentPage,
  basePath,
  addCanonical = true,
}) => {
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
        {hasPreviousPage && (
          <link rel="prev" href={`${homepage}${path}${currentPage - 1}`} />
        )}
        {hasNextPage && (
          <link rel="next" href={`${homepage}${path}${currentPage + 1}`} />
        )}
      </Helmet>

      <ShadPagination>
        <PaginationContent>
          {/* Previous Page */}
          {hasPreviousPage && (
            <PaginationItem>
              <PaginationPrevious href={`${path}${currentPage - 1}`}>
                <PreviousIcon /> Previous
              </PaginationPrevious>
            </PaginationItem>
          )}

          {/* Pages */}
          {hasPrevDots && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {pages.map((page) => {
            const active = page === currentPage;
            return (
              <PaginationItem key={page}>
                {active ? (
                  <span aria-label={`Current Page, Page ${page}`} aria-current="true">
                    {page}
                  </span>
                ) : (
                  <PaginationLink href={`${path}${page}`}>
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            );
          })}

          {hasNextDots && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Next Page */}
          {hasNextPage && (
            <PaginationItem>
              <PaginationNext href={`${path}${currentPage + 1}`}>
                Next <NextIcon />
              </PaginationNext>
            </PaginationItem>
          )}
        </PaginationContent>
      </ShadPagination>
    </>
  );
};

export default Pagination;
