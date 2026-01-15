'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/fantasy_entry-slice';
import { FantasyEntry, FantasyGroup } from '@/types/general';
import { updateDivisionID, updateOrganizationID } from '@/redux/features/organization-slice';

const ReduxWrapper = (
  {
    children,
    fantasy_group,
    fantasy_entry,
  }:
  {
    children: React.ReactNode;
    fantasy_group: FantasyGroup;
    fantasy_entry: FantasyEntry;
  },
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateOrganizationID(fantasy_group.organization_id));
    dispatch(updateDivisionID(fantasy_group.division_id));
    dispatch(setDataKey({ key: 'fantasy_group', value: fantasy_group }));
    dispatch(setDataKey({ key: 'fantasy_entry', value: fantasy_entry }));
  }, [dispatch, fantasy_group, fantasy_entry]);


  return (
    <div>
      {children}
    </div>
  );
};

export default ReduxWrapper;
