'use client';

import { setLoading } from '@/redux/features/loading-slice';
import { useAppDispatch } from '@/redux/hooks';
import Organization from '../helpers/Organization';
import { updateOrganizationID } from '@/redux/features/organization-slice';
import { setDataKey } from '@/redux/features/games-slice';
import { getStore } from '@/app/StoreProvider';


const MutationHandler = () => {
  const dispatch = useAppDispatch();
  let previousUrl = '';

  if (typeof window === 'undefined') {
    return null; // Prevents SSR issues
  }

  const observer = new MutationObserver(() => {
    if (window.location.href !== previousUrl) {
      // console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
      previousUrl = window.location.href;

      // update the organization_id, if it changed
      const pathName = window.location.pathname;
      const splat = pathName.split('/');

      let organization_id: string | null = null;
      if (splat.length > 1) {
        if (splat[1] === 'cfb') {
          organization_id = Organization.getCFBID();
        }
        if (splat[1] === 'cbb') {
          organization_id = Organization.getCBBID();
        }
        const store = getStore();

        if (
          organization_id &&
          store.getState().organizationReducer.organization_id !== organization_id
        ) {
          dispatch(updateOrganizationID(organization_id));
        }
      }

      dispatch(setLoading(false));
      dispatch(setDataKey({ key: 'refreshLoading', value: true }));
    }
  });
  const config = { subtree: true, childList: true };

  // start observing change
  observer.observe(document, config);

  return null;
};

export default MutationHandler;
