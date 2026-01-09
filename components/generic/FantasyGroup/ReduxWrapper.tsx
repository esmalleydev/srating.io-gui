'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/fantasy_group-slice';
import { FantasyGroup } from '@/types/general';
import { updateDivisionID, updateOrganizationID } from '@/redux/features/organization-slice';

const ReduxWrapper = (
  {
    children,
    fantasy_group,
  }:
  {
    children: React.ReactNode;
    fantasy_group: FantasyGroup;
  },
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateOrganizationID(fantasy_group.organization_id));
    dispatch(updateDivisionID(fantasy_group.division_id));
    dispatch(setDataKey({ key: 'fantasy_group', value: fantasy_group }));
  }, [dispatch, fantasy_group]);


  return (
    <div>
      {children}
    </div>
  );
};

export default ReduxWrapper;
