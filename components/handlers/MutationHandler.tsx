'use client';

import { setLoading } from '@/redux/features/display-slice';
import { useAppDispatch } from '@/redux/hooks';
import Organization from '../helpers/Organization';
import { updateOrganizationID } from '@/redux/features/organization-slice';
import { setRefreshEnabled } from '@/redux/features/games-slice';


const MutationHandler = () => {
  const dispatch = useAppDispatch();
  let previousUrl = '';

  const observer = new MutationObserver(() => {
    if (window.location.href !== previousUrl) {
      // console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
      previousUrl = window.location.href;

      // update the organization_id, if it changed
      const pathName = window.location.pathname;
      const splat = pathName.split('/');

      let organization_id = Organization.getCBBID();
      if (splat.length > 1) {
        if (splat[1] === 'cfb') {
          organization_id = Organization.getCFBID();
        }
        if (splat[1] === 'cbb') {
          organization_id = Organization.getCBBID();
        }
      }

      dispatch(setLoading(false));
      dispatch(setRefreshEnabled(true));
      dispatch(updateOrganizationID(organization_id));
    }
  });
  const config = { subtree: true, childList: true };

  // start observing change
  observer.observe(document, config);

  return null;
};

export default MutationHandler;
