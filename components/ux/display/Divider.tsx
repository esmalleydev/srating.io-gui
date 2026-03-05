
import { useTheme } from '@/components/hooks/useTheme';


const Divider = () => {
  const theme = useTheme();

  return <hr style = {{ margin: 0, borderWidth: 0, borderStyle: 'solid', borderColor: theme.grey[600], borderBottomWidth: 'thin' }} />;
};

export default Divider;
