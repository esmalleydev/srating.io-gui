'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/fantasy_group-slice';
import { FantasyDraftOrders, FantasyEntrys, FantasyGroup, FantasyGroupComments, FantasyGroupInvites, FantasyGroupUsers } from '@/types/general';
import { updateDivisionID, updateOrganizationID } from '@/redux/features/organization-slice';
import { AppDispatch } from '@/redux/store';

export interface FantasyGroupLoadData {
  isOwner: boolean;
  fantasy_group: FantasyGroup;
  fantasy_group_users: FantasyGroupUsers;
  fantasy_group_invites: FantasyGroupInvites;
  fantasy_group_comments: FantasyGroupComments;
  fantasy_entrys: FantasyEntrys;
  fantasy_draft_orders: FantasyDraftOrders;
  fantasy_rankings: {}, // todo
  error?: string;
}


export const handleLoad = (
  {
    dispatch,
    data,
  }:
  {
    dispatch: AppDispatch;
    data: FantasyGroupLoadData;
  },
) => {
  console.log(data)
  dispatch(setDataKey({ key: 'isOwner', value: data.isOwner }));
  dispatch(setDataKey({ key: 'fantasy_group_users', value: data.fantasy_group_users }));
  dispatch(setDataKey({ key: 'fantasy_group_invites', value: data.fantasy_group_invites }));
  dispatch(setDataKey({ key: 'fantasy_group_comments', value: data.fantasy_group_comments }));
  dispatch(setDataKey({ key: 'fantasy_entrys', value: data.fantasy_entrys }));
  dispatch(setDataKey({ key: 'fantasy_draft_orders', value: data.fantasy_draft_orders }));
};

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
