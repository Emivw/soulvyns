'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Users,
  LayoutDashboard,
  Cpu,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/dashboard/ai-suggester', icon: Cpu, label: 'AI Suggester' },
  { href: '/dashboard/users', icon: Users, label: 'Users' },
  { href: '/dashboard/resources', icon: Package, label: 'Resources' },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        {navItems.map((item) => (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  {
                    'bg-muted text-primary': pathname === item.href,
                  }
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </TooltipProvider>
  );
}
