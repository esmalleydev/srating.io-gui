'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, CardActionArea, Link } from '@mui/material';
import PicksIcon from '@mui/icons-material/Casino';
import LaunchIcon from '@mui/icons-material/Launch';
import Billing from './Billing';
import ButtonSwitch from './ButtonSwitch';


const Pricing = ({ view }) => {
  const router = useRouter();
  const [billingOpen, setBillingOpen] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState({});

  const [selectedView, setSelectedView] = useState(view || 'picks');

  const handleBilling = (priceOption) => {
    setSelectedPricing(priceOption);
    setBillingOpen(true);
  };

  const handleBillingClose = () => {
    setBillingOpen(false);
  };

  const handleSelectedView = (value) => {
    if (value === 'left') {
      setSelectedView('picks');
    }
    if (value === 'right') {
      setSelectedView('api');
    }
  };

  const picksOptions = [
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

  const apiOptions = [
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

  const getPriceCard = (option) => {
    const trial = (option.code === 'api_trial');
    return (
      <Grid item key={option.code} xs={12} sm={5} md={3}>
        <Card sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
          <CardActionArea onClick = {() => { handleBilling(option); }} disabled = {option.disabled}>
            <CardContent>
              {option.disabled ? <Typography color = 'error.main' variant = 'h5'>Coming soon</Typography> : ''}
              <Typography color = 'text.secondary' variant = 'body1'>{option.name}</Typography>
              <Typography color = 'primary.main' variant = 'h3'><Typography sx = {{ fontSize: 16 }} variant='caption'>$</Typography>{option.price}</Typography>
              <Typography color = 'text.secondary' variant = 'caption'>{option.price_description}</Typography>
              {option.requests ? <div><Typography color = 'primary.main' variant = 'caption'>{option.requests}</Typography><Typography color = 'text.secondary' variant = 'caption'> requests per month</Typography></div> : ''}
              {option.features.map((feature) => {
                return (
                  <div key = {feature}>
                    <hr />
                    <Typography variant = 'body1'>{feature}</Typography>
                  </div>
                );
              })}
              {option.missing_features.map((missing) => {
                return (
                  <div key = {missing}>
                    <hr />
                    <Typography style = {{ textDecoration: 'line-through' }} color = 'text.secondary' variant = 'body1'>{missing}</Typography>
                  </div>
                );
              })}
              <Button style = {{ width: '100%', marginTop: 10 }} variant = 'contained' disabled = {option.disabled}>{trial ? 'Try now' : 'Subscribe'}</Button>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  return (
   <div>
    <Billing open = {billingOpen} closeHandler = {handleBillingClose} pricing = {selectedPricing} />
    <ButtonSwitch leftTitle='Picks' rightTitle='API' selected = {selectedView === 'picks' ? 'left' : 'right'} handleClick={handleSelectedView} />
    {
    selectedView === 'picks' ?
    <>
      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant='h5'>Picks access</Typography>
      <div style = {{ textAlign: 'center', margin: '10px 0px' }}><Button startIcon = {<PicksIcon />} variant='outlined' onClick={() => { router.push('/cbb/picks'); }}>View Picks</Button></div>
      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant='body1'>View our <Link style = {{ cursor: 'pointer' }} underline="hover" onClick = {() => { router.push('/cbb/picks?view=stats'); }}>live win rate</Link> stats and read our blog about <Link style = {{ cursor: 'pointer' }} underline="hover" onClick = {() => { router.push('/blog/picks-2023-review'); }}>2023 picks breakdown</Link></Typography>
      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant='body1'>Algorithm trained on 10+ years of data (75000+ games)</Typography>
      <Grid container spacing={4} style = {{ justifyContent: 'center' }}>
        {picksOptions.map((option) => {
          return getPriceCard(option);
        })}
      </Grid>
    </> :
    <>
      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant='h5'>API access <sup style = {{ fontSize: '14px' }}>beta</sup></Typography>
      <div style = {{ textAlign: 'center', margin: '10px 0px' }}><Button endIcon = {<LaunchIcon />} variant='outlined' onClick={() => { window.open('https://docs.srating.io/', '_blank'); }}>API Documentation</Button></div>
      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant='body1'>Our <Link style = {{ cursor: 'pointer' }} underline="hover" onClick = {() => { router.push('/cbb/picks'); }}>GUI</Link> uses this same API!</Typography>
      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant='body1'>Set up takes less than 5 mins</Typography>
      <Grid container spacing={4} style = {{ justifyContent: 'center' }}>
        {apiOptions.map((option) => {
          return getPriceCard(option);
        })}
      </Grid>
    </>
    }
    {/* <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant='h5'>Features</Typography>
    <div>
      <Typography variant='h6'>Live scores</Typography>
      <ul>
        <li><Typography variant='body1'>Get live scores for all college basketball games.</Typography></li>
      </ul>
    </div>
    <hr />
    <div>
      <Typography variant='h6'>Betting odds</Typography>
      <Typography variant='body1'>Our API supports pre game and live odds.</Typography>
      <ul>
        <li><Typography variant='body1'>Money line</Typography></li>
        <li><Typography variant='body1'>Spread</Typography></li>
        <li><Typography variant='body1'>Over / Under</Typography></li>
      </ul>
    </div>
    <hr />
    <div>
      <Typography variant='h6'>Teams and Players</Typography>
      <ul>
        <li><Typography variant='body1'>Get all the college basketball D1 teams</Typography></li>
        <li><Typography variant='body1'>Get all the players on every team</Typography></li>
      </ul>
    </div>
    <hr />
    <div>
      <Typography variant='h6'>Stats + Picks</Typography>
      <ul>
        <li><Typography variant='body1'>Get team statistics</Typography></li>
        <li><Typography variant='body1'>Get player statistics</Typography></li>
        <li><Typography variant='body1'>Get picks win percentage</Typography></li>
      </ul>
    </div> */}
   </div>
  );
};

export default Pricing;
