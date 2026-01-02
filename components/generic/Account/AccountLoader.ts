'use client';

import { useClientAPI } from '@/components/clientAPI';
import { setDataKey } from '@/redux/features/user-slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ApiKeys, FantasyGroups, FantasyGroupUsers, Pricings, Subscriptions, User } from '@/types/general';
import { useEffect, useState } from 'react';

interface Data {
  subscription: Subscriptions;
  pricing: Pricings;
  api_key: ApiKeys;
  user: User;
  fantasy_group_user: FantasyGroupUsers;
  fantasy_group: FantasyGroups;
}

const AccountLoader = () => {
  const dispatch = useAppDispatch();
  const session_id = useAppSelector((state) => state.userReducer.session_id);
  const loadedAccount = useAppSelector((state) => state.userReducer.loadedAccount);

  const [loading, setLoading] = useState(false);

  const loadAccount = () => {
    if (loading) {
      return;
    }

    console.log('load account')

    setLoading(true);
    useClientAPI({
      class: 'billing',
      function: 'loadAccount',
      arguments: {},
    }).then((accountData: Data) => {
      setLoading(false);
      
      dispatch(setDataKey({ key: 'loadedAccount', value: true}))
      dispatch(setDataKey({ key: 'user', value: accountData.user }))
      dispatch(setDataKey({ key: 'pricing', value: accountData.pricing }))
      dispatch(setDataKey({ key: 'api_key', value: accountData.api_key }))
      dispatch(setDataKey({ key: 'subscription', value: accountData.subscription }))
      dispatch(setDataKey({ key: 'fantasy_group_user', value: accountData.fantasy_group_user }))
      dispatch(setDataKey({ key: 'fantasy_group', value: accountData.fantasy_group }))
    }).catch((err) => {
      setLoading(false);
      dispatch(setDataKey({ key: 'loadedAccount', value: true}))
      // todo error handling sometime maybe
    });
  };

  useEffect(() => {
    if (!loadedAccount && session_id) {
      loadAccount();
    }
  }, [session_id, loadedAccount]);

  return null;
};

export default AccountLoader;