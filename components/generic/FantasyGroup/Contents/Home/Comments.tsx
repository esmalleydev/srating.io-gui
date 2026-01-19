'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Paper from '@/components/ux/container/Paper';
import Slab from '@/components/ux/container/Slab';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import Typography from '@/components/ux/text/Typography';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Inputs from '@/components/helpers/Inputs';
import FantasyGroup from '@/components/helpers/FantasyGroup';
import { useClientAPI } from '@/components/clientAPI';
import Textarea from '@/components/ux/input/Textarea';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@/components/ux/buttons/IconButton';
import { useState } from 'react';
import { setLoading } from '@/redux/features/loading-slice';
import { setDataKey } from '@/redux/features/fantasy_group-slice';
import Objector from '@/components/utils/Objector';
import Dates from '@/components/utils/Dates';

const Comments = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const fantasy_group_comments = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group_comments);
  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);
  const fantasy_group_users = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group_users);


  const [newComment, setNewComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [triggerValidation, setTriggerValidation] = useState(false);
  const [sending, setSending] = useState(false);

  const InputHandler = new Inputs();
  const fantasyGroupHelper = new FantasyGroup({ fantasy_group });

  const sorted_comments = Object.values(fantasy_group_comments).sort((a, b) => {
    return a.date_of_entry > b.date_of_entry ? 1 : -1;
  });

  const user_id_x_fantasy_group_user_id = {};

  for (const fantasy_group_user_id in fantasy_group_users) {
    const row = fantasy_group_users[fantasy_group_user_id];
    user_id_x_fantasy_group_user_id[row.user_id] = fantasy_group_user_id;
  }

  const getName = (row) => {
    if (row.comment_type_terminology_id === '927fb358-e9b5-11f0-bc34-529c3ffdbb93') {
      return 'SYSTEM';
    }

    if (row.user_id in user_id_x_fantasy_group_user_id) {
      return fantasy_group_users[user_id_x_fantasy_group_user_id[row.user_id]].name || row.user_id;
    }

    return 'Unknown';
  };

  const comment_containers: React.JSX.Element[] = sorted_comments.map((row, index) => {
    return (
      <Slab
        key = {row.fantasy_group_comment_id}
        label = {`${getName(row)} ${Dates.format(Dates.parse(row.date_of_entry, true), '- M jS g:i a')}`}
        primary = {row.comment}
        style = {{ margin: '5px 0px' }}
      />
    );
  });

  if (!comment_containers.length) {
    comment_containers.push(
      <div style = {{ padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', fontStyle: 'italic', color: theme.text.secondary }}>
        <span style = {{ display: 'flex', marginRight: 10 }}><SentimentVeryDissatisfiedIcon /></span>
        <Typography type = 'body1' style = {{ color: theme.text.secondary }}>No comments yet!</Typography>
      </div>,
    );
  }

  const addComment = () => {
    if (sending) {
      return;
    }

    const errors = InputHandler.getErrors();

    setTriggerValidation(false);
    setErrorMessage('');

    if (errors.length) {
      setTriggerValidation(true);
      return;
    }

    if (!newComment) {
      setErrorMessage('Must add text to send a comment!');
      return;
    }

    setSending(true);
    dispatch(setLoading(true));

    const comment = newComment;

    useClientAPI({
      class: 'fantasy_group_comment',
      function: 'createComment',
      arguments: {
        comment,
        fantasy_group_id: fantasy_group.fantasy_group_id,
      },
    })
      .then((response) => {
        setSending(false);
        dispatch(setLoading(false));

        if (response.error) {
          setErrorMessage(response.error);
        } else {
          setNewComment('');
          dispatch(setDataKey({ key: 'fantasy_group_comments', value: Objector.extender({}, fantasy_group_comments, response) }));
        }
      })
      .catch((err) => {
        console.log(err);
        setSending(false);
        dispatch(setLoading(false));
      });
  };


  return (
    <div>
      <Typography type = 'h6'>Comments</Typography>
      <Paper style={{ padding: 20 }}>
        {comment_containers}
        {
          fantasyGroupHelper.isMember({ fantasy_group_users }) ?
          <div style = {{ marginTop: 20, display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
            <Textarea
              inputHandler={InputHandler}
              placeholder='Add comment'
              variant = 'filled'
              maxLength = {10000}
              errorMessage={errorMessage}
              triggerValidation = {triggerValidation}
              value = {newComment}
              onChange={(val) => setNewComment(val)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addComment();
                }
              }}
            />
            <div style = {{ marginTop: '-30px' }}>
              <IconButton icon = {<SendIcon />} value = 'send' onClick={addComment} />
            </div>
          </div>
            : ''
        }
      </Paper>
    </div>
  );
};

export default Comments;
