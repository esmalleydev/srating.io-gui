'use client';

import { useState, useEffect } from 'react';
import { useScrollContext } from '@/contexts/scrollContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateGameSort } from '@/redux/features/favorite-slice';
import { Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import { useScrollPosition } from '@n8tb1t/use-scroll-position';


const FloatingButtons = () => {
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
      {showScrollFAB ? <div style = {{ position: 'absolute', bottom: 70, left: 15 }}><Fab size = 'small' color = 'secondary' onClick={handleScrollToTop}>{<KeyboardArrowUpIcon />}</Fab></div> : ''}
    </div>
  );
};

export default FloatingButtons;
