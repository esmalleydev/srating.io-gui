'use client';

import { useTransition } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import PicksIcon from '@mui/icons-material/Casino';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import DataObjectIcon from '@mui/icons-material/DataObject';
import EventIcon from '@mui/icons-material/Event';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { setLoading } from '@/redux/features/display-slice';
import Organization from '@/components/helpers/Organization';

const ToolsExample = () => {
  const dispatch = useAppDispatch();
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  const path = Organization.getPath({ organizations, organization_id });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePath = (e, path) => {
    e.preventDefault();
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(path);
    });
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={(e) => { handlePath(e, `/${path}/compare`); }}>
              <ListItemIcon>
                <QueryStatsIcon color = 'info' />
              </ListItemIcon>
              <ListItemText primary='Compare tool' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={(e) => { handlePath(e, `/${path}/picks`); }}>
              <ListItemIcon>
                <PicksIcon color = 'success' />
              </ListItemIcon>
              <ListItemText primary='Picks tool' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={(e) => { handlePath(e, '/pricing'); }}>
              <ListItemIcon>
                <DataObjectIcon color = 'warning' />
              </ListItemIcon>
              <ListItemText primary='API access' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={(e) => { handlePath(e, `/${path}/team/87019264-8549-11ed-bf01-5296e1552828`); }}>
              <ListItemIcon>
                <EventIcon color = 'secondary' />
              </ListItemIcon>
              <ListItemText primary='Team schedules' />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default ToolsExample;
