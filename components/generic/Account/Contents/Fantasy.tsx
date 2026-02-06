'use client';

import Navigation from '@/components/helpers/Navigation';
import { useTheme } from '@/components/hooks/useTheme';
import Button from '@/components/ux/buttons/Button';
import Paper from '@/components/ux/container/Paper';
import Tile from '@/components/ux/container/Tile';
import Typography from '@/components/ux/text/Typography';
import { useAppSelector } from '@/redux/hooks';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PayoutMethod from './Fantasy/PayoutMethod';

import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe-client';
import { Appearance, StripeElementsOptions } from '@stripe/stripe-js';



const Fantasy = () => {
  const navigation = new Navigation();
  const theme = useTheme();
  const fantasy_groups = useAppSelector((state) => state.userReducer.fantasy_group);
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);

  const handleTileClick = (e, fantasy_group_id) => {
    const fantasy_group = fantasy_groups[fantasy_group_id];
    navigation.fantasy_group(`/fantasy_group/${fantasy_group.fantasy_group_id}`);
  };

  const tiles = fantasy_groups ? Object.values(fantasy_groups).map((fantasy_group) => {
    const organization = organizations[fantasy_group.organization_id];
    return (
      <Tile
        icon = {<SportsEsportsIcon />}
        primary = {fantasy_group.name}
        secondary = {`${organization.name} ${fantasy_group.season} fantasy league`}
        buttons = {[
          <Button title = 'View' value = {fantasy_group.fantasy_group_id} ink handleClick={handleTileClick} />,
        ]}
      />
    );
  }) : [];

  const getContents = () => {
    if (tiles.length) {
      return tiles;
    }

    return (
      <div style = {{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontStyle: 'italic', color: theme.text.secondary }}>
        <span style = {{ display: 'flex', marginRight: 10 }}><SentimentVeryDissatisfiedIcon /></span>
        <Typography type = 'body1' style = {{ color: theme.text.secondary }}>You are not in any groups!</Typography>
      </div>
    );
  };

  const appearance: Appearance = {
    theme: (theme.mode === 'dark' ? 'night' : 'stripe'),
    labels: 'floating',
    variables: {
      colorBackground: theme.mode === 'dark' ? '#383838' : theme.background.main,
    },
    rules: {
      '.Input': {
        padding: '5px',
        // 'boxShadow': 'none',
        // 'border': 'none'
      },
      '.Tab': {
        padding: '5px',
      },
    },
  };

  const options: StripeElementsOptions = {
    // clientSecret,
    // mode: 'subscription',
    // amount: pricing.price * 100,
    currency: 'usd',
    appearance,
  };


  return (
    <div style = {{ maxWidth: 800, margin: 'auto' }}>
      <Typography type = 'h6'>My fantasy groups</Typography>
      <Paper style = {{ padding: 16 }}>
        {getContents()}
      </Paper>

      <Elements stripe={stripePromise} options={options}>
        <PayoutMethod />
      </Elements>
    </div>
  );
};

export default Fantasy;
