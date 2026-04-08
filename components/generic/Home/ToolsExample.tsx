'use client';

import { useTransition } from 'react';



import PicksIcon from '@esmalley/react-material-icons/Casino';
import QueryStatsIcon from '@esmalley/react-material-icons/QueryStats';
import DataObjectIcon from '@esmalley/react-material-icons/DataObject';
import EventIcon from '@esmalley/react-material-icons/Event';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { setLoading } from '@/redux/features/loading-slice';
import Organization from '@/components/helpers/Organization';
import Tile from '@/components/ux/container/Tile';
import { useTheme } from '@/components/ux/contexts/themeContext';

const ToolsExample = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  const path = Organization.getPath({ organizations, organization_id });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePath = (path) => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(path);
    });
  };

  return (
    <>
      <div style={{ width: '100%' }}>
        <Tile
          style = {{ padding: 10 }}
          icon = {<QueryStatsIcon style = {{ color: theme.info.main, fontSize: 28 }} />}
          primary='Compare tool'
          secondary='Compare the stats, player, trends of any 2 teams.'
          onClick={() => { handlePath(`/${path}/compare`); }}
        />
        <Tile
          style = {{ padding: 10 }}
          icon = {<PicksIcon style = {{ color: theme.success.main, fontSize: 28 }} />}
          primary='Picks tool'
          secondary='This tool can help you calculate which bets you should place.'
          onClick={() => { handlePath(`/${path}/picks`); }}
        />
        <Tile
          style = {{ padding: 10 }}
          icon = {<DataObjectIcon style = {{ color: theme.warning.main, fontSize: 28 }} />}
          primary='API access'
          secondary='Use our API to do your own analysis and unlock every data point.'
          onClick={() => { handlePath('/pricing'); }}
        />
        <Tile
          style = {{ padding: 10 }}
          icon = {<EventIcon style = {{ color: theme.secondary.main, fontSize: 28 }} />}
          primary='Team schedules'
          secondary='View team schedules to analyze their best wins and upcoming predictions.'
          onClick={() => { handlePath(`/${path}/team/87019264-8549-11ed-bf01-5296e1552828`); }}
        />
      </div>
    </>
  );
};

export default ToolsExample;
