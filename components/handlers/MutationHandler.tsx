'use client';

import { setLoading } from "@/redux/features/display-slice";
import { useAppDispatch } from "@/redux/hooks";


const MutationHandler = () => {
  const dispatch = useAppDispatch();
  let previousUrl = "";

  const observer = new MutationObserver(() => {
    if (window.location.href !== previousUrl) {
      // console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
      previousUrl = window.location.href;
      dispatch(setLoading(false));
    }
  });
  const config = { subtree: true, childList: true };

  // start observing change
  observer.observe(document, config);

  return null;
};

export default MutationHandler;
