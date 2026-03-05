
import Typography from '@/components/ux/text/Typography';

export const dynamic = 'force-dynamic';


export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography type = 'h3'>404</Typography>
        <Typography type='body1'>This page does not exist! Double check the url</Typography>
      </div>
    </div>
  );
}
