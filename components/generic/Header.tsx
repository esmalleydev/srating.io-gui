'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
// import { Link } from 'next/link';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';


import Drawer from '@mui/material/Drawer';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
// import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import sratingLogo from '../../public/favicon-32x32.png';

import Sidebar from './Sidebar';
import Search from './Search';
import AccountHandler from '@/components/generic/AccountHandler';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { reset } from '@/redux/features/compare-slice';
import { getLogoColorPrimary, getLogoColorSecondary } from '../utils/Color';
import { setLoading } from '@/redux/features/loading-slice';
import OrganizationPicker from './OrganizationPicker';
import Menu, { MenuDivider, MenuOption } from '@/components/ux/menu/Menu';
import Organization from '../helpers/Organization';
import Tooltip from '../ux/hover/Tooltip';
import Button from '../ux/buttons/Button';
import { useTheme } from '../hooks/useTheme';
import Style from '../utils/Style';
import Objector from '../utils/Objector';
import IconButton from '../ux/buttons/IconButton';
import { setDataKey } from '@/redux/features/user-slice';
import Navigation from '../helpers/Navigation';


// todo hook up settings with router

export const headerBarHeight = 64;

const Header = () => {
  const navigation = new Navigation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const validSession = useAppSelector((state) => state.userReducer.isValidSession);
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  const path = Organization.getPath({ organizations, organization_id });

  const router = useRouter();
  const pathName = usePathname();
  const { width } = useWindowDimensions() as Dimensions;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [fullSearch, setFullSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [anchorEl, setAnchorEl] = useState(null);

  const logoPrimaryColor = getLogoColorPrimary();
  const logoSecondaryColor = getLogoColorSecondary();


  useEffect(() => {
    setIsLoading(false);
  }, []);


  const handleHome = () => {
    if (pathName !== '/') {
      dispatch(setLoading(true));
      startTransition(() => {
        router.push('/');
      });
    }
  };

  const handleCompare = () => {
    if (pathName !== `/${path}/compare`) {
      dispatch(setLoading(true));
      dispatch(reset());
      startTransition(() => {
        router.push(`/${path}/compare`);
      });
    }
  };


  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };


  const handleAccount = () => {
    handleClose();
    if (validSession) {
      if (pathName !== '/account') {
        navigation.user('/account?view=settings');
      } else if (pathName === '/account') {
        navigation.userView({ view: 'settings' });
      }

      return;
    }
    setAccountOpen(true);
  };

  const handleAccountSubscriptions = () => {
    handleClose();
    if (validSession) {
      if (pathName !== '/account') {
        navigation.user('/account?view=subscriptions');
      } else if (pathName === '/account') {
        navigation.userView({ view: 'subscriptions' });
      }

      return;
    }
    setAccountOpen(true);
  };

  const handleAccountFantasy = () => {
    handleClose();
    if (validSession) {
      if (pathName !== '/account') {
        navigation.user('/account?view=fantasy');
      } else if (pathName === '/account') {
        navigation.userView({ view: 'fantasy' });
      }

      return;
    }
    setAccountOpen(true);
  };

  const handleAccountClose = () => {
    setAccountOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(setDataKey({ key: 'session_id', value: null }));
    dispatch(setDataKey({ key: 'isValidSession', value: false }));
    startTransition(() => {
      router.push('/');
    });
  };


  const logoStyle: React.CSSProperties = {
    // 'fontFamily': 'Consolas',
    // 'fontFamily': 'Courier New',
    fontWeight: 600,
    fontSize: '20px',
    fontStyle: 'italic',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };

  const shrinkName = width <= 425;

  const headerStyle = {
    position: 'fixed',
    width: '100%',
    zIndex: Style.getZIndex().appBar,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.header.main,
    color: '#fff',
  };

  const toolBarStyle = {
    minHeight: 56,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    '@media (min-width: 600px)': {
      minHeight: 64,
    },
  };

  const menuOptions: MenuOption[] = [
    {
      value: 'account',
      selectable: true,
      label: 'My account',
      onSelect: handleAccount,
      icon: <AccountCircleIcon fontSize="small" />,
    },
    {
      value: 'subscriptions',
      selectable: true,
      label: 'My subscriptions',
      onSelect: handleAccountSubscriptions,
      icon: <ShoppingCartIcon fontSize="small" />,
    },
    {
      value: 'fantasy',
      selectable: true,
      label: 'My fantasy legaues',
      onSelect: handleAccountFantasy,
      icon: <SportsEsportsIcon fontSize="small" />,
    },
    {
      value: null,
      selectable: false,
      customLabel: <MenuDivider />,
    },
    {
      value: 'logout',
      selectable: true,
      label: 'Logout',
      onSelect: handleLogout,
      icon: <Logout fontSize="small" />,
    },
  ];

  return (
    <div className={Style.getStyleClassName(headerStyle)}>
      <div style = {{ padding: '0px 20px' }}>
      {
        fullSearch ?
          <div className = {Style.getStyleClassName(toolBarStyle)}>
            <IconButton onClick = {() => { setFullSearch(false); }} value = 'back' icon = {<ArrowBackIcon />} />
            <div style={{ flexGrow: 1, display: 'flex' }}>
              <Search onRouter = {() => { setFullSearch(false); }} focus = {true} />
            </div>
          </div> :
          <div className = {Style.getStyleClassName(toolBarStyle)}>
            <IconButton onClick = {toggleDrawer} containerStyle = {{ marginRight: 16 }} buttonStyle={{ color: '#fff' }} value = 'sidebar' icon = {<MenuIcon />} />
            <Drawer
              open={drawerOpen}
              onClose={toggleDrawer}
            >
              <Sidebar onClick = {toggleDrawer} />
            </Drawer>
            <div style = {Objector.extender({ display: 'flex', marginRight: 5, alignItems: 'center' }, logoStyle)} onClick = {handleHome}>
              {width > 425 ? <img src={sratingLogo.src} width = '20' height = '20' style = {{ marginRight: 5 }} /> : ''}
              <><span style = {{ color: (theme.mode === 'dark' ? logoPrimaryColor : '#fff') }}>S</span><span style = {{ color: (theme.mode === 'dark' ? logoSecondaryColor : '#31ff00') }}>R{shrinkName ? '' : 'ATING'}</span></>
            </div>
            <div style = {{ display: 'flex', marginRight: 5, alignItems: 'center' }}>
              <OrganizationPicker />
            </div>
            <div style={{ flexGrow: 1, display: 'flex' }}>
            </div>
            <div style={{ flexGrow: 0, lineHeight: 'initial' }}>{width > 320 ? <Tooltip onClickRemove text = {'Compare tool'}><IconButton onClick={handleCompare} value = 'compare' icon = {<QueryStatsIcon />} buttonStyle={{ color: (theme.mode === 'light' ? '#fff' : theme.info.main) }} /></Tooltip> : ''}</div>
            <div style={{ flexGrow: 0, marginRight: (width < 600 ? 0 : '5px'), lineHeight: 'initial' }}>
              {width < 625 ? <IconButton onClick={() => { setFullSearch(true); }} buttonStyle={{ color: (theme.mode === 'light' ? '#fff' : theme.info.main) }} value = 'search' icon = {<SearchIcon />} /> : <Search focus={false} />}
            </div>
            <div style={{ flexGrow: 0, lineHeight: 'initial' }}>
              {
              validSession ?
                <>
                  <IconButton onClick={handleMenu} value = 'account' icon = {<AccountCircle />} buttonStyle={{ color: '#fff' }} />
                  <Menu
                    anchor={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    options={menuOptions}
                  />
                </>
                :
                <div>
                  {/* {width >= 425 ? <SignUpButton style = {{'marginRight': 5}} variant = 'outlined' disableElevation onClick={() => {router.push('/pricing');}}>Sign up</SignUpButton> : ''} */}
                  <Button buttonStyle = {{ backgroundColor: (theme.mode === 'light' ? theme.secondary.main : theme.success.dark) }} handleClick={handleAccount} title = {(width > 550 ? 'Signup / Login' : 'Login')} value = 'login' />
                </div>
              }
            </div>
          </div>
        }
        </div>
      <AccountHandler open = {accountOpen} closeHandler = {handleAccountClose} />
    </div>
  );
};

export default Header;
