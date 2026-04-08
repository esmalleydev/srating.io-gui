'use client';

import { useTheme } from '@/components/ux/contexts/themeContext';
import Button from '@/components/ux/buttons/Button';
import IconButton from '@/components/ux/buttons/IconButton';
import Paper from '@/components/ux/container/Paper';
import Typography from '@/components/ux/text/Typography';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import SentimentVeryDissatisfiedIcon from '@esmalley/react-material-icons/SentimentVeryDissatisfied';
import AddIcon from '@esmalley/react-material-icons/Add';
import React, { useState } from 'react';
import Modal from '@/components/ux/modal/Modal';
import TextInput from '@/components/ux/input/TextInput';
import Inputs from '@/components/ux/input/Inputs';
import { setLoading } from '@/redux/features/loading-slice';
import { useClientAPI } from '@/components/clientAPI';
import { setDataKey } from '@/redux/features/fantasy_group-slice';

import MarkEmailReadIcon from '@esmalley/react-material-icons/MarkEmailRead';
import Tile from '@/components/ux/container/Tile';
import { Dates, Objector } from '@esmalley/ts-utils';

const Invites = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const session_id = useAppSelector((state) => state.userReducer.session_id);
  const isOwner = useAppSelector((state) => state.fantasyGroupReducer.isOwner);
  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);
  const fantasy_group_invites = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group_invites);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [emails, setEmails] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [isSending, setIsSending] = useState(false);

  const canInvite = (
    isOwner ||
    fantasy_group.open_invites
  ) && session_id && !fantasy_group.locked;

  const inputHandler = new Inputs();

  const inviteRows = Object.values(fantasy_group_invites || {}).map((row, index) => {
    return (
      <Tile
        key = {row.fantasy_group_invite_id}
        icon={<MarkEmailReadIcon style = {{ fontSize: 24 }} />}
        primary={row.email}
        secondary={`Expires: ${Dates.format(row.expires, 'M jS Y')}`}
      />
    );
  });

  const handleInvite = () => {
    setInviteModalOpen(true);
  };

  const sendInvites = () => {
    setErrorMessage(undefined);
    if (!emails) {
      setErrorMessage('Nothing to send');
      return;
    }

    if (isSending) {
      return;
    }

    setIsSending(true);

    dispatch(setLoading(true));

    useClientAPI({
      class: 'fantasy_group',
      function: 'sendInvites',
      arguments: {
        fantasy_group_id: fantasy_group.fantasy_group_id,
        emails,
      },
    }).then((new_fantasy_group_invites) => {
      dispatch(setLoading(false));
      setIsSending(false);
      if (!new_fantasy_group_invites || new_fantasy_group_invites.error) {
        setErrorMessage(new_fantasy_group_invites.error);
      } else {
        setEmails('');
        setInviteModalOpen(false);
        dispatch(setDataKey({ key: 'fantasy_group_invites', value: Objector.extender({}, fantasy_group_invites, new_fantasy_group_invites) }));
      }
    }).catch((err) => {
      // nothing for now
    });
  };

  const paperButtons: React.JSX.Element[] = [];

  if (canInvite && inviteRows.length > 0) {
    paperButtons.push(
      <IconButton type = 'circle' value = 'invite' onClick = {handleInvite} icon={<AddIcon style = {{ fontSize: 24 }} />} />,
    );
  }

  const getContents = () => {
    if (inviteRows.length) {
      return inviteRows;
    }

    if (canInvite && inviteRows.length === 0) {
      return (
        <div style = {{ textAlign: 'center' }}>
          <Button title = 'Invite people' value = 'invite' handleClick = {handleInvite} />
        </div>
      );
    }

    if (fantasy_group.locked) {
      return (
        <div style = {{ padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', fontStyle: 'italic', color: theme.text.secondary }}>
          <Typography type = 'body1' style = {{ color: theme.text.secondary }}>League is locked!</Typography>
        </div>
      );
    }

    return (
      <div style = {{ padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', fontStyle: 'italic', color: theme.text.secondary }}>
        <span style = {{ display: 'flex', marginRight: 10 }}><SentimentVeryDissatisfiedIcon style = {{ fontSize: 24 }} /></span>
        <Typography type = 'body1' style = {{ color: theme.text.secondary }}>No pending invites yet!</Typography>
      </div>
    );
  };

  return (
    <div>
      <Typography type = 'h6'>Pending invites</Typography>
      <Paper buttons={paperButtons} style={{ padding: 20 }}>
        {getContents()}
      </Paper>
      <Modal
        open = {inviteModalOpen}
        onClose={() => {
          setInviteModalOpen(false);
          setEmails('');
        }}
      >
        <Typography type = 'h6'>Invite to league</Typography>
        <Typography type = 'caption' style = {{ color: theme.text.secondary }}>Enter a list of emails to send an invite to below. Separate by a [space] or comma</Typography>
        <TextInput
          autoFocus
          inputHandler={inputHandler}
          type = 'outlined'
          placeholder='Emails'
          error = {Boolean(errorMessage)}
          errorMessage = {errorMessage}
          value = {emails || ''}
          onChange={(val) => setEmails(val)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendInvites();
            }
          }}
        />
        <div style = {{ textAlign: 'right' }}>
          <Button value = 'send' title = 'Send' handleClick={sendInvites} />
        </div>
      </Modal>
    </div>
  );
};

export default Invites;
