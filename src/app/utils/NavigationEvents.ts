'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/app/hooks/LoadingContext'; // Adjust path as necessary

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(true); // Start loading on route change
    const url = `${pathname}?${searchParams}`;

    // Simulate loading process (can adjust logic as needed)
    setTimeout(() => {
      setIsLoading(false); // Stop loading once navigation is presumed complete
    }, 500); // Adjust delay to simulate loading time

  }, [pathname, searchParams, setIsLoading]);

  return null;
}
