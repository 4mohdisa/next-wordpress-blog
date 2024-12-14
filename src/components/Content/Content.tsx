"use client"

import { ReactNode } from 'react';
import { cn } from '../../@/lib/utils';

interface ContentProps {
  children: ReactNode;
  className?: string;
}

const Content = ({ children, className }: ContentProps) => {
  return (
    <div className={cn(
      "prose prose-lg dark:prose-invert",
      "prose-headings:text-black dark:prose-headings:text-white",
      "prose-p:text-gray-700 dark:prose-p:text-gray-200",
      "prose-a:text-primary dark:prose-a:text-primary-foreground hover:prose-a:text-primary/80",
      "prose-strong:text-black dark:prose-strong:text-white",
      "prose-code:text-black dark:prose-code:text-white",
      "prose-code:before:content-none prose-code:after:content-none",
      "prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800",
      "prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300",
      "prose-img:rounded-lg prose-img:shadow-md",
      "max-w-none",
      className
    )}>
      {children}
    </div>
  );
};

export default Content;
