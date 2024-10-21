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
import { useAppDispatch } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { setLoading } from '@/redux/features/display-slice';

const ToolsExample = () => {
  const dispatch = useAppDispatch();
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
            <ListItemButton onClick={(e) => { handlePath(e, '/cbb/compare'); }}>
              <ListItemIcon>
                <QueryStatsIcon />
              </ListItemIcon>
              <ListItemText primary='Compare tool' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={(e) => { handlePath(e, '/cbb/picks'); }}>
              <ListItemIcon>
                <PicksIcon />
              </ListItemIcon>
              <ListItemText primary='Picks tool' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={(e) => { handlePath(e, '/pricing'); }}>
              <ListItemIcon>
                <DataObjectIcon />
              </ListItemIcon>
              <ListItemText primary='API access' />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default ToolsExample;
