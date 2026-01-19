'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Paper from '@/components/ux/container/Paper';
import Slab from '@/components/ux/container/Slab';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import Typography from '@/components/ux/text/Typography';
import { useAppSelector } from '@/redux/hooks';
import TextInput from '@/components/ux/input/TextInput';
import Inputs from '@/components/helpers/Inputs';
import FantasyGroup from '@/components/helpers/FantasyGroup';
import { useClientAPI } from '@/components/clientAPI';

const Comments = () => {
  const theme = useTheme();

  const fantasy_group_comments = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group_comments);
  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);
  const fantasy_group_users = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group_users);
  const terminologies = useAppSelector((state) => state.dictionaryReducer.terminology);
  // const users = useAppSelector((state) => state.fantasyGroupReducer.users);

  const InputHandler = new Inputs();
  const fantasyGroupHelper = new FantasyGroup({ fantasy_group });

  const comment_containers: React.JSX.Element[] = [];

  for (const fantasy_group_comment_id in fantasy_group_comments) {
    const row = fantasy_group_comments[fantasy_group_comment_id];

    comment_containers.push(
      <Slab
        label = {row.comment_type_terminology_id === '927fb358-e9b5-11f0-bc34-529c3ffdbb93' ? 'SYSTEM' : 'todo user'}
        primary = {row.comment}
      />,
    );
  }

  if (!comment_containers.length) {
    comment_containers.push(
      <div style = {{ padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', fontStyle: 'italic', color: theme.text.secondary }}>
        <span style = {{ display: 'flex', marginRight: 10 }}><SentimentVeryDissatisfiedIcon /></span>
        <Typography type = 'body1' style = {{ color: theme.text.secondary }}>No comments yet!</Typography>
      </div>,
    );
  }

  const addComment = (comment) => {
    useClientAPI({
      class: 'fantasy_group_comment',
      function: 'create',
      arguments: {
        comment,
        comment_type_terminology_id: '92922f1c-e9b5-11f0-bc34-529c3ffdbb93',
      },
    });
  };


  return (
    <div>
      <Typography type = 'h6'>Comments</Typography>
      <Paper style={{ padding: 20 }}>
        {comment_containers}
        {
          fantasyGroupHelper.isMember({ fantasy_group_users }) ?
          <div style = {{ marginTop: 20 }}>
            <TextInput
              inputHandler={InputHandler}
              placeholder='Add comment'
              variant = 'filled'
              maxLength = {10000}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // todo call add comment
                  // add send button
                  // in api overwrite the create
                  // broadcast the new row
                  // use session for user_id
                }
              }}
            />
          </div>
            : ''
        }
      </Paper>
    </div>
  );
};

export default Comments;
