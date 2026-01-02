'use client';

import { Profiler, useEffect, useState } from 'react';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';
import { useTheme } from '@/components/hooks/useTheme';
import Navigation from '@/components/helpers/Navigation';
import { useClientAPI } from '@/components/clientAPI';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Button from '@/components/ux/buttons/Button';
import { setLoading } from '@/redux/features/loading-slice';
import ErrorModal from '@/components/ux/modal/ErrorModal';
import Organization from '@/components/helpers/Organization';
import Typography from '@/components/ux/text/Typography';
import { setDataKey } from '@/redux/features/user-slice';



/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ padding: 5 }}>
      {children}
    </div>
  );
};


const ClientSkeleton = () => {
  const paddingTop = 0;

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 84;
  return (
    <Contents>
      <div style = {{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100vh - ${heightToRemove}px)`,
      }}>
        <LinearProgress color = 'secondary' style={{ width: '50%' }} />
      </div>
    </Contents>
  );
};

const Client = ({ fantasy_group, fantasy_group_invite_id, code }) => {
  const navigation = new Navigation();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id });

  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState(false);

  const paddingTop = 0;

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 84;

  const join = () => {
    if (isJoining) {
      return;
    }

    setIsJoining(true);
    dispatch(setLoading(true));

    useClientAPI({
      'class': 'fantasy_group_invite',
      'function': 'join',
      'arguments': {
        fantasy_group_invite_id,
        code,
      }
    }).then((data) => {
      if (
        data &&
        data.session_id &&
        data.fantasy_group_id
      ) {
        dispatch(setDataKey({ key: 'session_id', value: data.session_id }));
        dispatch(setDataKey({ key: 'isValidSession', value: true }));
        
        navigation.fantasy_group(`/${path}/fantasy_group/${data.fantasy_group_id}`);
      } else {
        setIsJoining(false);
        dispatch(setLoading(false));
        setError(true);
      }
    }).catch((err) => {
      setIsJoining(false);
      dispatch(setLoading(false));
      setError(true);
    });
  };


  return (
    <Profiler id="FantasyGroupInvite.Client" onRender={(id, phase, actualDuration) => {
      console.log(id, phase, actualDuration);
    }}>
    <Contents>
      <div style = {{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100vh - ${heightToRemove}px)`,
      }}>
        <div>
          <Typography type = 'h6'>You have been invited to join "{fantasy_group.name}"!</Typography>
        </div>
        <Button value = 'join' title = 'Join league!' handleClick={join} buttonStyle = {{ backgroundColor: (theme.mode === 'dark' ? theme.info.dark : theme.info.main) }} />
      </div>
      <ErrorModal
        open = {error}
        title = {'Error joining league'}
        message = {'Oops! Something went wrong, please try again later..'}
        confirm={() => {
          setError(false);
        }}
      />
    </Contents>
    </Profiler>
  );
};

export { Client, ClientSkeleton };
