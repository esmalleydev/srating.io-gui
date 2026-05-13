'use client';

import { getHeaderHeight, getMarginTop } from './Header/ClientWrapper';
import { useAppSelector } from '@/redux/hooks';
import SubNavBar from './SubNavbar';
import { Style } from '@esmalley/ts-utils';
import { useNavigation } from '@/components/hooks/useNavigation';
import { Tab, useTheme } from '@esmalley/react-material-ui';


const getNavHeaderHeight = () => {
  return 42;
};

export { getNavHeaderHeight };

const NavBar = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const view = useAppSelector((state) => state.playerReducer.view) || 'stats';

  const tabOrder = ['stats', 'gamelog', 'trends'];

  const tabOptions = {
    stats: 'Stats',
    gamelog: 'Gamelog',
    trends: 'Trends',
  };

  const backgroundColor = theme.header.main;

  const handleTabClick = (e, value: string) => {
    const newView = value;

    if (newView !== view) {
      navigation.playerView({ view: newView });
    }
  };

  const tabs: React.JSX.Element[] = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(
      <Tab key = {tabOrder[i]} value = {tabOrder[i]} selected = {tabOrder[i] === view} title = {tabOptions[tabOrder[i]]} containerStyle={{ backgroundColor }} onClick = {handleTabClick} />,
    );
  }

  const divStyle = Style.getStyleClassName({
    ...Style.getNavBar(),
    backgroundColor,
    top: getMarginTop() + getHeaderHeight(),
  });

  return (
    <>
      <div className={divStyle}>
        {tabs}
      </div>
      <SubNavBar view = {view} />
    </>
  );
};

export default NavBar;
