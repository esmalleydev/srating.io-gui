'use client';

import { useState, useEffect } from 'react';
import { useScrollContext } from '@/contexts/scrollContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateGameSort } from '@/redux/features/favorite-slice';
import KeyboardArrowUpIcon from '@esmalley/react-material-icons/KeyboardArrowUp';
// import Tooltip from '@/components/ux/hover/Tooltip';
import IconButton from '@/components/ux/buttons/IconButton';
import { Style } from '@esmalley/ts-utils';
import { useTheme } from '@/components/ux/contexts/themeContext';
// import { useScrollPosition } from '@n8tb1t/use-scroll-position';


const FloatingButtons = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const displaySlice = useAppSelector((state) => state.displayReducer);

  // todo figure out scroll thing
  const [showScrollFAB, setShowScrolledFAB] = useState(true);
  const scrollRef = useScrollContext();

  const handleScrollToTop = () => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      dispatch(updateGameSort(null));
    }
  };

  useEffect(() => {
    handleScrollToTop();
  }, [displaySlice]);

  // todo figure out this scroll thing
  /*
  useScrollPosition(
    ({ prevPos, currPos }) => {
      console.log(currPos)
      // if (currPos > 300) {
      //   setShowScrolledFAB(true);
      // }
    },
    [showScrollFAB],
    undefined,
    true
  );
  */



  return (
    <div>
      {showScrollFAB ?
        <div style = {{ position: 'absolute', bottom: 70, left: 15 }}>
          {/* <Tooltip position = 'top' text={'Scroll to top'}> */}
            <IconButton
              containerStyle = {{
                zIndex: Style.getZIndex().fab,
                backgroundColor: theme.secondary.main,
                boxShadow: Style.getShadow(6),
                '&:hover': {
                  backgroundColor: (theme.mode === 'dark' ? theme.secondary.dark : theme.secondary.dark),
                },
              }}
              buttonStyle = {{ color: theme.mode === 'dark' ? '#000' : '#fff' }}
              type = 'circle'
              value = 'scroll-to-top'
              onClick = {handleScrollToTop}
              icon={<KeyboardArrowUpIcon style = {{ fontSize: 24 }} />}
            />
          {/* </Tooltip> */}
        </div>
        : ''
      }
    </div>
  );
};

export default FloatingButtons;
