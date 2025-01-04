'use client';

import { useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { updateTheme } from '../../redux/features/theme-slice';

import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// import TripleDotsIcon from '@mui/icons-material/MoreVert';
import GitHubIcon from '@mui/icons-material/GitHub';
import DarkModeIcon from '@mui/icons-material/ModeNight';
import LightModeIcon from '@mui/icons-material/LightMode';
// import BeerIcon from '@mui/icons-material/SportsBar';
import HomeIcon from '@mui/icons-material/Home';
import RSSFeedIcon from '@mui/icons-material/RssFeed';
import RankingIcon from '@mui/icons-material/EmojiEvents';
import ScoresIcon from '@mui/icons-material/Scoreboard';
import PicksIcon from '@mui/icons-material/Casino';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArticleIcon from '@mui/icons-material/Article';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { clear } from '@/redux/features/compare-slice';
import { setLoading } from '@/redux/features/display-slice';
import Organization from '../helpers/Organization';

// todo spin does nothing here, I think I need to use redux for a global spin and decorate it in another place

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const themeMode = useAppSelector((state) => state.themeReducer.mode);
  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id });

  const showCompareTool = Organization.getCBBID() === organization_id;
  const pathName = usePathname();

  // todo allow keyboard to click the option on enter keydown
  /*
  const handleClick = (e) => {
    console.log(e);
  }
  */

  const handleRanking = () => {
    const newPathName = `/${path}/ranking`;

    if (newPathName !== pathName) {
      dispatch(setLoading(true));
      startTransition(() => {
        router.push(newPathName);
      });
    }
  };

  const handleScores = () => {
    const newPathName = `/${path}/games`;

    if (newPathName !== pathName) {
      dispatch(setLoading(true));
      // sessionStorage.removeItem('CBB.GAMES.DATA');
      startTransition(() => {
        router.push(newPathName);
      });
    }
  };

  const handlePicks = () => {
    const newPathName = `/${path}/picks`;

    if (newPathName !== pathName) {
      dispatch(setLoading(true));
      startTransition(() => {
        router.push(newPathName);
      });
    }
  };

  const handleCompareTool = () => {
    const newPathName = `/${path}/compare`;

    if (newPathName !== pathName) {
      dispatch(setLoading(true));
      startTransition(() => {
        dispatch(clear());
        router.push(newPathName);
      });
    }
  };


  return (
    <div>
      <Box
        sx={{ width: 250 }}
        role="presentation"
        // onClick={handleClick}
        // onKeyDown={handleClick}
      >
        <List>
          <ListItem key={'home'} disablePadding onClick = {() => { router.push('/'); }}>
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={'Home'} />
            </ListItemButton>
          </ListItem>

          <Divider />

          <ListItem key={'ranking'} disablePadding onClick = {handleRanking}>
            <ListItemButton>
              <ListItemIcon>
                <RankingIcon />
              </ListItemIcon>
              <ListItemText primary={'Ranking'} />
            </ListItemButton>
          </ListItem>

          <ListItem key={'scores'} disablePadding onClick = {handleScores}>
            <ListItemButton>
              <ListItemIcon>
                <ScoresIcon />
              </ListItemIcon>
              <ListItemText primary={'Scores'} />
            </ListItemButton>
          </ListItem>

          <ListItem key={'picks'} disablePadding onClick = {handlePicks}>
            <ListItemButton>
              <ListItemIcon>
                <PicksIcon />
              </ListItemIcon>
              <ListItemText primary={'Picks'} />
            </ListItemButton>
          </ListItem>
          {
            showCompareTool ?
              <ListItem key={'compare-tool'} disablePadding onClick = {handleCompareTool}>
                <ListItemButton>
                  <ListItemIcon>
                    <QueryStatsIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Compare tool'} />
                </ListItemButton>
              </ListItem>
              : ''
          }

          <ListItem key={'pricing'} disablePadding onClick = {() => { router.push('/pricing'); }}>
            <ListItemButton>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary={'Subscriptions'} />
            </ListItemButton>
          </ListItem>

          <Divider />

          <ListItem key={'api'} disablePadding onClick = {() => { window.open('https://docs.srating.io', '_blank'); }}>
            <ListItemButton>
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary={'API Docs'} />
            </ListItemButton>
          </ListItem>

          <ListItem key={'github'} disablePadding onClick = {() => { window.open('https://github.com/esmalleydev/srating.io-gui', '_blank'); }}>
            <ListItemButton>
              <ListItemIcon>
                <GitHubIcon />
              </ListItemIcon>
              <ListItemText primary={'Github'} />
            </ListItemButton>
          </ListItem>

          <ListItem key={'blog'} disablePadding onClick = {() => { router.push('/blog'); }}>
            <ListItemButton>
              <ListItemIcon>
                <RSSFeedIcon />
              </ListItemIcon>
              <ListItemText primary={'Blog'} />
            </ListItemButton>
          </ListItem>

          <Divider />

          <ListItem key={'theme'} disablePadding onClick = {() => { dispatch(updateTheme(themeMode === 'dark' ? 'light' : 'dark')); }}>
            <ListItemButton>
              <ListItemIcon>
                {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </ListItemIcon>
              <ListItemText primary={themeMode === 'dark' ? 'Light mode' : 'Dark mode'} />
            </ListItemButton>
          </ListItem>

          {/* <ListItem key={'beer'} disablePadding onClick = {() => {window.open('https://www.buymeacoffee.com/lxeUvrCaH1', '_blank');}}>
            <ListItemButton>
              <ListItemIcon>
                <BeerIcon />
              </ListItemIcon>
              <ListItemText primary={'Buy me a beer'} />
            </ListItemButton>
          </ListItem> */}
        </List>
        <Divider />
      </Box>
    </div>
  );
};

export default Sidebar;
