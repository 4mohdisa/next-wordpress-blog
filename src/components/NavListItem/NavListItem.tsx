import Link from 'next/link';
import React from 'react';

interface NavItem {
  id: string;
  label: string;
  path?: string;
  target?: string;
  title?: string;
  children?: NavItem[];
}

interface NavListItemProps {
  className?: string;
  item: NavItem;
}

const NavListItem: React.FC<NavListItemProps> = ({ className, item }) => {
  const nestedItems = (item.children || []).map(child => (
    <NavListItem key={child.id} item={child} />
  ));

  return (
    <li key={item.id}>
      {item.path && !item.path.includes('http') && !item.target && (
        <Link href={item.path} title={item.title || ''}>
          {item.label}
        </Link>
      )}
      {item.path && item.path.includes('http') && (
        <a href={item.path} title={item.title || ''} target={item.target}>
          {item.label}
        </a>
      )}

      {nestedItems.length > 0 && <ul className={className}>{nestedItems}</ul>}
    </li>
  );
};

export default NavListItem;
