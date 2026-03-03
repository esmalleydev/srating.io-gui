'use client';

import { useAppDispatch } from '@/redux/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useTransition } from 'react';
import Navigation from '../helpers/Navigation';

export function useNavigation() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const [isPending, startTransition] = useTransition();

  return useMemo(() => {
    return new Navigation(
      dispatch,
      router,
      pathName,
      startTransition,
      isPending,
    );
  }, [dispatch, router, pathName, startTransition, isPending]);
}
