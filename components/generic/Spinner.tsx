

import { useAppSelector } from '@/redux/hooks';
import { Backdrop, CircularProgress } from '@esmalley/react-material-ui';


const Spinner = () => {
  const loading = useAppSelector((state) => state.loadingReducer.loading);

  return (
    <Backdrop style={{ zIndex: 9000 }} open={loading}>
      <CircularProgress color = {'#fff'} />
    </Backdrop>
  );
};

export default Spinner;




