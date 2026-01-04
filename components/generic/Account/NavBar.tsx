'use client';

import { useAppSelector } from '@/redux/hooks';
import Tab from '@/components/ux/buttons/Tab';
import Navigation from '@/components/helpers/Navigation';
import Style from '@/components/utils/Style';
import { useTheme } from '@/components/hooks/useTheme';

const getNavHeaderHeight = () => {
  return 48;
};

export { getNavHeaderHeight };

const NavBar = () => {
  const theme = useTheme();
  const navigation = new Navigation();

  const view = useAppSelector((state) => state.userReducer.view) || 'subscriptions';
  const tabOrder = ['subscriptions', 'fantasy', 'settings'];

  const tabOptions = {
    subscriptions: 'Subscriptions',
    fantasy: 'Fantasy',
    settings: 'Settings',
  };

  const handleTabClick = (e, value) => {
    const newView = value;

    if (newView !== view) {
      navigation.userView({ view: newView });
    }
  };

  const tabs: React.JSX.Element[] = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(
      <Tab key = {tabOrder[i]} value = {tabOrder[i]} selected = {tabOrder[i] === view} title = {tabOptions[tabOrder[i]]}  handleClick = {handleTabClick} />,
    );
  }

  const divStyle = Style.getStyleClassName({
    ...Style.getNavBar(),
    // top: getMarginTop() + getHeaderHeight(),
    backgroundColor: theme.background.main,
  });

  return (
    <>
      <div className={divStyle}>
        {tabs}
      </div>
    </>
  );
};

export default NavBar;
