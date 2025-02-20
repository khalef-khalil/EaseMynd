'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, BookOpenIcon, ChartBarIcon, ListBulletIcon, ClockIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, BookOpenIcon as BookOpenIconSolid, ChartBarIcon as ChartBarIconSolid, ListBulletIcon as ListBulletIconSolid, ClockIcon as ClockIconSolid } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon, activeIcon: HomeIconSolid },
    { name: 'Habits', href: '/habits', icon: ChartBarIcon, activeIcon: ChartBarIconSolid },
    { name: 'Tasks', href: '/tasks', icon: ListBulletIcon, activeIcon: ListBulletIconSolid },
    { name: 'Focus', href: '/focus', icon: ClockIcon, activeIcon: ClockIconSolid },
    { name: 'Principles', href: '/principles', icon: BookOpenIcon, activeIcon: BookOpenIconSolid },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <nav className="flex justify-around">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.activeIcon : item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center px-3 py-2',
                isActive ? 'text-indigo-600' : 'text-gray-500'
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 