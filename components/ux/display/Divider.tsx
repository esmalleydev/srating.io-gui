
import { useTheme } from '@/components/ux/contexts/themeContext';


const Divider = () => {
  const theme = useTheme();

  return <hr style = {{ margin: 0, borderWidth: 0, borderStyle: 'solid', borderColor: theme.grey[600], borderBottomWidth: 'thin' }} />;
};

export default Divider;
