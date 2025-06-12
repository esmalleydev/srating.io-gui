'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, CardActionArea } from '@mui/material';
import PicksIcon from '@mui/icons-material/Casino';
import LaunchIcon from '@mui/icons-material/Launch';
import Billing from './Billing';
import ButtonSwitch from './ButtonSwitch';
import { useTheme } from '../hooks/useTheme';
import Color from '../utils/Color';
import Typography from '../ux/text/Typography';

type priceOption = {
  code: string;
  name: string;
  description: string;
  price: number;
  type: string;
  price_description: string;
  features: string[];
  requests?: string;
  missing_features: string[];
  priceId?: string;
  disabled?: boolean;
}

const Pricing = ({ view }: { view: string | null; }) => {
  const router = useRouter();
  const theme = useTheme();
  const [billingOpen, setBillingOpen] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState({});

  const leftSwitch = 'Picks';
  const rightSwitch = 'API';

  let s = leftSwitch;
  if (view === 'api') {
    s = rightSwitch;
  }

  const [selectedView, setSelectedView] = useState(s);

  const handleBilling = (priceOption: priceOption) => {
    setSelectedPricing(priceOption);
    setBillingOpen(true);
  };

  const handleBillingClose = () => {
    setBillingOpen(false);
  };

  const picksOptions: priceOption[] = [
    {
      code: 'picks_monthly',
      name: 'Monthly',
      description: '$5 USD per month for picks access',
      price: 5,
      type: 'picks',
      price_description: 'USD per month',
      features: ['Access to picks'],
      missing_features: ['API access'],
      priceId: process.env.NEXT_PUBLIC_ENV === 'dev' ? 'price_1NcziSDIZlrOiqc2TY4NEiXc' : 'price_1NczWWDIZlrOiqc2QdE6mTdf',
    },
    {
      code: 'picks_yearly',
      name: 'Yearly',
      description: '$20 USD per year for picks access',
      price: 20,
      type: 'picks',
      price_description: 'USD per year',
      features: ['Access to picks'],
      missing_features: ['API access'],
      priceId: process.env.NEXT_PUBLIC_ENV === 'dev' ? 'price_1NcziSDIZlrOiqc2A9maKQwi' : 'price_1NczWWDIZlrOiqc2pKPXv8aj',
    },
  ];

  const apiOptions: priceOption[] = [
    {
      code: 'api_trial',
      name: 'Trial',
      description: 'Free trial limited api access',
      price: 0,
      type: 'api',
      price_description: '',
      requests: '500',
      features: ['Limited access', 'Scrambled data'],
      missing_features: ['Access to picks'],
    },
    {
      code: 'api_basic',
      name: 'Basic',
      description: '$25 USD per month for basic API access',
      price: 25,
      type: 'api',
      price_description: 'USD per month',
      requests: '20,000',
      features: [
        'Access to picks',
        'CSV downloads',
        'Games / Teams / Players / Stats',
        'Live scores',
        'Live odds',
      ],
      disabled: false,
      missing_features: [],
      priceId: process.env.NEXT_PUBLIC_ENV === 'dev' ? 'price_1NehA8DIZlrOiqc2XVZLRjzc' : 'price_1NczfoDIZlrOiqc27QjIZfmt',
    },
    {
      code: 'api_pro',
      name: 'Pro',
      description: '$49 USD per month for pro API access',
      price: 49,
      type: 'api',
      price_description: 'USD per month',
      requests: '100,000',
      features: [
        'Access to picks',
        'CSV downloads',
        'Games / Teams / Players / Stats',
        'Live scores',
        'Live odds',
      ],
      disabled: false,
      missing_features: [],
      priceId: process.env.NEXT_PUBLIC_ENV === 'dev' ? 'price_1NehA8DIZlrOiqc2zPZ8Ikaa' : 'price_1NczfoDIZlrOiqc2eH6dGdGK',
    },
    {
      code: 'api_elite',
      name: 'Elite',
      description: '$99 USD per month for elite API access',
      price: 99,
      type: 'api',
      price_description: 'USD per month',
      requests: '4 Million',
      features: [
        'Access to picks',
        'CSV downloads',
        'Games / Teams / Players / Stats',
        'Live scores',
        'Live odds',
      ],
      disabled: true,
      missing_features: [],
      priceId: process.env.NEXT_PUBLIC_ENV === 'dev' ? 'price_1NqdsnDIZlrOiqc2Jr2BQJ9N' : 'price_1NqdqfDIZlrOiqc2w0H1MYrv',
    },
  ];

  const getPriceCard = (option: priceOption) => {
    const trial = (option.code === 'api_trial');
    const buttonColor = (option.disabled ? theme.grey[500] : theme.info.main);
    const textColor = Color.getTextColor('#ffffff', buttonColor);
    return (
      <Grid key={option.code} size = {{ xs: 12, sm: 5, md: 3 }}>
        <Card sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
          <CardActionArea onClick = {() => { handleBilling(option); }} disabled = {option.disabled}>
            <CardContent>
              {option.disabled ? <Typography style = {{ color: theme.error.main }} type = 'h6'>Coming soon</Typography> : ''}
              <Typography style = {{ color: theme.text.secondary }} type = 'body1'>{option.name}</Typography>
              <Typography style = {{ color: theme.primary.main }} type = 'h3'><Typography style = {{ fontSize: 16, display: 'inline-block', color: theme.primary.main }} type='caption'>$</Typography>{option.price}</Typography>
              <Typography style = {{ color: theme.text.secondary }} type = 'caption'>{option.price_description}</Typography>
              {option.requests ? <div><Typography style = {{ color: theme.primary.main, display: 'inline-block', marginRight: 2.5 }} type = 'caption'>{option.requests}</Typography><Typography style = {{ color: theme.text.secondary, display: 'inline-block' }} type = 'caption'> requests per month</Typography></div> : ''}
              {option.features.map((feature) => {
                return (
                  <div key = {feature}>
                    <hr />
                    <Typography type = 'body2'>{feature}</Typography>
                  </div>
                );
              })}
              {option.missing_features.map((missing) => {
                return (
                  <div key = {missing}>
                    <hr />
                    <Typography style = {{ textDecoration: 'line-through', color: theme.text.secondary }} type = 'body2'>{missing}</Typography>
                  </div>
                );
              })}
              <div style = {{
                width: '100%',
                marginTop: 10,
                backgroundColor: buttonColor,
                color: textColor,
                height: 30,
                borderRadius: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>{trial ? 'Try now' : 'Subscribe'}</div>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  return (
   <div>
    <Billing open = {billingOpen} closeHandler = {handleBillingClose} pricing = {selectedPricing} />
    <ButtonSwitch leftTitle={leftSwitch} rightTitle={rightSwitch} selected = {selectedView} handleClick={(e) => setSelectedView(e)} />
    {
    selectedView === leftSwitch ?
    <>
      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} type='h5'>Picks access</Typography>
      <div style = {{ textAlign: 'center', margin: '10px 0px' }}><Button startIcon = {<PicksIcon />} variant='outlined' onClick={() => { router.push('/cbb/picks'); }}>View Picks</Button></div>
      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} type='body1'>View our <a style = {{ cursor: 'pointer', color: theme.link.primary }} onClick = {(e) => { e.preventDefault(); router.push('/cbb/picks?view=stats'); }} href = '/cbb/picks?view=stats'>live win rate</a> stats and read our blog about <a style = {{ cursor: 'pointer', color: theme.link.primary }} onClick = {(e) => { e.preventDefault(); router.push('/blog/picks-2023-review'); }} href = '/blog/picks-2023-review'>2023 picks breakdown</a></Typography>
      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} type='body1'>Algorithm trained on 10+ years of data (75000+ games)</Typography>
      <Grid container spacing={4} style = {{ justifyContent: 'center' }}>
        {picksOptions.map((option) => {
          return getPriceCard(option);
        })}
      </Grid>
    </> :
    <>
      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} type='h5'>API access <sup style = {{ fontSize: '14px' }}>beta</sup></Typography>
      <div style = {{ textAlign: 'center', margin: '10px 0px' }}><Button endIcon = {<LaunchIcon />} variant='outlined' onClick={() => { window.open('https://docs.srating.io/', '_blank'); }}>API Documentation</Button></div>
      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} type='body1'>Set up takes less than 5 mins!</Typography>
      <Grid container spacing={4} style = {{ justifyContent: 'center' }}>
        {apiOptions.map((option) => {
          return getPriceCard(option);
        })}
      </Grid>
    </>
    }
    {/* <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} type='h5'>Features</Typography>
    <div>
      <Typography type='h6'>Live scores</Typography>
      <ul>
        <li><Typography type='body1'>Get live scores for all college basketball games.</Typography></li>
      </ul>
    </div>
    <hr />
    <div>
      <Typography type='h6'>Betting odds</Typography>
      <Typography type='body1'>Our API supports pre game and live odds.</Typography>
      <ul>
        <li><Typography type='body1'>Money line</Typography></li>
        <li><Typography type='body1'>Spread</Typography></li>
        <li><Typography type='body1'>Over / Under</Typography></li>
      </ul>
    </div>
    <hr />
    <div>
      <Typography type='h6'>Teams and Players</Typography>
      <ul>
        <li><Typography type='body1'>Get all the college basketball D1 teams</Typography></li>
        <li><Typography type='body1'>Get all the players on every team</Typography></li>
      </ul>
    </div>
    <hr />
    <div>
      <Typography type='h6'>Stats + Picks</Typography>
      <ul>
        <li><Typography type='body1'>Get team statistics</Typography></li>
        <li><Typography type='body1'>Get player statistics</Typography></li>
        <li><Typography type='body1'>Get picks win percentage</Typography></li>
      </ul>
    </div> */}
   </div>
  );
};

export default Pricing;
