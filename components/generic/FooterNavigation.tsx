'use client';

import { useTransition } from 'react';


import RankingIcon from '@mui/icons-material/EmojiEvents';
import ScoresIcon from '@mui/icons-material/Scoreboard';
import PicksIcon from '@mui/icons-material/Casino';
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

  let hightlightValue = -1;

  if (viewingPage) {
    hightlightValue = pages.indexOf(viewingPage);
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

          <div onClick = {handleHome} className = {getClassName('home')}>
            <div style = {{ height: 24 }}><HomeIcon /></div>
            <Typography type = 'body2' style = {{ color: 'inherit' }}>Home</Typography>
          </div>

          <div onClick = {handleRanking} className = {getClassName('ranking')}>
            <div style = {{ height: 24 }}><RankingIcon /></div>
            <Typography type = 'body2' style = {{ color: 'inherit' }} >Ranking</Typography>
          </div>

          <div onClick = {handleScores} className = {getClassName('games')}>
            <div style = {{ height: 24 }}><ScoresIcon /></div>
            <Typography type = 'body2' style = {{ color: 'inherit' }} >Scores</Typography>
          </div>

          <div key = {`${getClassName('picks')}.picks`} onClick = {handlePicks} className = {getClassName('picks')}>
            <div style = {{ height: 24 }}><PicksIcon /></div>
            <Typography type = 'body2' style = {{ color: 'inherit' }} >Picks</Typography>
          </div>

        </div>
      </Paper>
    </div>
  );
};

export default FooterNavigation;
