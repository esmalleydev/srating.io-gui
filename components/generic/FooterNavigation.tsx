'use client';

import React, { useTransition } from 'react';


import RankingIcon from '@mui/icons-material/EmojiEvents';
import ScoresIcon from '@mui/icons-material/Scoreboard';
import PicksIcon from '@mui/icons-material/Casino';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
// import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
// import NewspaperIcon from '@mui/icons-material/Newspaper';
import { useAppSelector } from '@/redux/hooks';
import Organization from '@/components/helpers/Organization';
import Paper from '@/components/ux/container/Paper';
import Navigation from '@/components/helpers/Navigation';
import { usePathname } from 'next/navigation';
import Style from '@/components/utils/Style';
import { useTheme } from '@/components/hooks/useTheme';
import Typography from '@/components/ux/text/Typography';


export const footerNavigationHeight = 56;

const FooterNavigation = () => {
  const navigation = new Navigation();
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();

  const viewingSport = Organization.getPath({ organizations, organization_id });
  let viewingPage: string | null = null;

  // todo when you remove nextjs / this function, when the location changes, this code runs before it is updated, so there is nothing retriggering this
  // probably need a useEffect or something
  const pathName = usePathname();

  // todo the /team page highlights home button, because there is no sport / viewing page

  const pages = [
    'home',
    'ranking',
    'games',
    'picks',
  ];

  if (organization_id === Organization.getCBBID()) {
    pages.push('fantasy');
  }

  if (pathName) {
    const splat = pathName.split('/');

    if (
      splat &&
      splat.length > 2 &&
      pages.indexOf(splat[2]) > -1
    ) {
      viewingPage = pages[pages.indexOf(splat[2])];
    } else if (
      splat &&
      splat.length === 2 &&
      splat[1] === ''
    ) {
      viewingPage = pages[pages.indexOf('home')];
    }
  }

  const handleHome = () => {
    startTransition(() => {
      // router.push('/'+viewingSport.toLowerCase());
      navigation.getRouter().push('/');
    });
  };

  const handleRanking = () => {
    const newPathName = `/${viewingSport.toLowerCase()}/ranking`;

    if (newPathName !== pathName) {
      navigation.ranking(newPathName);
    }
  };

  const handleScores = () => {
    const newPathName = `/${viewingSport.toLowerCase()}/games`;

    if (newPathName !== pathName) {
      navigation.games(newPathName);
    }
  };

  const handlePicks = () => {
    const newPathName = `/${viewingSport.toLowerCase()}/picks`;

    if (newPathName !== pathName) {
      navigation.picks(newPathName);
    }
  };

  const handleFantasy = () => {
    const newPathName = `/${viewingSport.toLowerCase()}/fantasy`;

    if (newPathName !== pathName) {
      navigation.fantasy(newPathName);
    }
  };


  const options: {
    value: string;
    label: string;
    icon: React.JSX.Element;
    handler: () => void;
  }[] = [
    // {
    //   value: 'home',
    //   label: 'Home',
    //   icon: <HomeIcon />,
    //   handler: handleHome,
    // },
    {
      value: 'ranking',
      label: 'Ranking',
      icon: <RankingIcon />,
      handler: handleRanking,
    },
    {
      value: 'games',
      label: 'Scores',
      icon: <ScoresIcon />,
      handler: handleScores,
    },
    {
      value: 'picks',
      label: 'Picks',
      icon: <PicksIcon />,
      handler: handlePicks,
    },
  ];

  if (organization_id === Organization.getCBBID()) {
    options.splice(1, 0, {
      value: 'fantasy',
      label: 'Fantasy',
      icon: <SportsEsportsIcon />,
      handler: handleFantasy,
    });
  }

  const footerStyle = {
    display: 'flex',
    justifyContent: 'center',
    height: 56,
    // zIndex: Style.getZIndex().appBar,
    backgroundColor: theme.mode === 'dark' ? theme.grey[900] : theme.blue[700],
    color: '#fff',
  };

  const buttonStyle = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'relative',
    // backgroundColor: 'transparent',
    cursor: 'pointer',
    // verticalAlign: 'middle',
    minWidth: '80px',
    maxWidth: '160px',
    flexDirection: 'column',
    // color: 'rgb(255, 255, 255)',
    // margin: '0px',
    // borderRadius: '0px',
    transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1), padding-top 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    padding: '0px 12px',
    flex: '1 1 0%',
    '&.selected_footer': {
      color: theme.mode === 'light' ? theme.warning.light : theme.success.dark,
    },
  };


  const getClassName = (type) => {
    return `${Style.getStyleClassName(buttonStyle)} ${(type === viewingPage ? 'selected_footer' : '')}`;
  };


  return (
    <div>
      <Paper style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 4 }}>
        <div className = {Style.getStyleClassName(footerStyle)}>
          {options.map((r) => {
            return (
              <div key = {r.value} onClick = {r.handler} className = {getClassName(r.value)}>
                <div style = {{ height: 24 }}>{r.icon}</div>
                <Typography type = 'body2' style = {{ color: 'inherit' }}>{r.label}</Typography>
              </div>
            );
          })}
        </div>
      </Paper>
    </div>
  );
};

export default FooterNavigation;
