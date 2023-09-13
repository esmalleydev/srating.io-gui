import React, { useState } from 'react';
import { useRouter } from 'next/router';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, CardActionArea } from '@mui/material';
import PicksIcon from '@mui/icons-material/Casino';
import LaunchIcon from '@mui/icons-material/Launch';
import Billing from './Billing';


const Pricing = (props) => {
  const self = this;

  const router = useRouter();
  const [billingOpen, setBillingOpen] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState(null);

  const handleBilling = (priceOption) => {
    setSelectedPricing(priceOption);
    setBillingOpen(true);
  };

  const handleBillingClose = () => {
    setBillingOpen(false);
  };

  const picksOptions = [
    {
      'code': 'picks_monthly',
      'name': 'Monthly',
      'description': '$5 USD per month for picks access',
      'price': 5,
      'type': 'picks',
      'price_description': 'USD per month',
      'features': ['Access to picks'],
      'missing_features': ['API access'],
      // 'priceId': 'price_1NcziSDIZlrOiqc2TY4NEiXc', // dev price_id
      'priceId': 'price_1NczWWDIZlrOiqc2QdE6mTdf', // live price_id
    },
    {
      'code': 'picks_yearly',
      'name': 'Yearly',
      'description': '$20 USD per year for picks access',
      'price': 20,
      'type': 'picks',
      'price_description': 'USD per year',
      'features': ['Access to picks'],
      'missing_features': ['API access'],
      // 'priceId': 'price_1NcziSDIZlrOiqc2A9maKQwi', // dev price_id
      'priceId': 'price_1NczWWDIZlrOiqc2pKPXv8aj', // live price_id
    },
  ];
  
  const apiOptions = [
    {
      'code': 'api_trial',
      'name': 'Trial',
      'description': 'Free trial limited api access',
      'price': 0,
      'type': 'api',
      'price_description': '',
      'requests': '500 requests per month',
      'features': ['Limited access', 'Scrambled data'],
      'missing_features': ['Access to picks'],
    },
    {
      'code': 'api_basic',
      'name': 'Basic',
      'description': '$25 USD per month for basic API access',
      'price': 25,
      'type': 'api',
      'price_description': 'USD per month',
      'requests': '20,000 requests per month',
      'features': [
        'Access to picks',
        'Games / Teams / Players / Stats',
        'Live scores',
        'Live odds',
      ],
      'disabled': true,
      'missing_features': [],
      // 'priceId': 'price_1NehA8DIZlrOiqc2XVZLRjzc', // dev price_id,
      'priceId': 'price_1NczfoDIZlrOiqc27QjIZfmt', // live price_id,
    },
    {
      'code': 'api_pro',
      'name': 'Pro',
      'description': '$49 USD per month for pro API access',
      'price': 49,
      'type': 'api',
      'price_description': 'USD per month',
      'requests': '100,000 requests per month',
      'features': [
        'Access to picks',
        'Games / Teams / Players / Stats',
        'Live scores',
        'Live odds',
      ],
      'disabled': true,
      'missing_features': [],
      // 'priceId': 'price_1NehA8DIZlrOiqc2zPZ8Ikaa', // dev price_id,
      'priceId': 'price_1NczfoDIZlrOiqc2eH6dGdGK', // live price_id,
    },
  ];

  const getPriceCard = (option) => {
    const trial = (option.code === 'api_trial');
    return (
      <Grid item key={option.code} xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', flexDirection: 'column', 'textAlign': 'center' }}>
          <CardActionArea onClick = {() => {handleBilling(option)}} disabled = {option.disabled}>
            <CardContent>
              {option.disabled ? <Typography color = 'error.main' variant = 'h5'>Coming soon</Typography> : ''}
              <Typography color = 'text.secondary' variant = 'body1'>{option.name}</Typography>
              <Typography color = 'primary.main' variant = 'h3'><Typography sx = {{'fontSize': 16}} variant='caption'>$</Typography>{option.price}</Typography>
              <Typography color = 'text.secondary' variant = 'caption'>{option.price_description}</Typography>
              {option.requests ? <div><Typography color = 'text.secondary' variant = 'caption'>{option.requests}</Typography></div> : ''}
              {option.features.map((feature) => {
                return (
                  <div>
                    <hr />
                    <Typography variant = 'body1'>{feature}</Typography>
                  </div>
                );
              })}
              {option.missing_features.map((missing) => {
                return (
                  <div>
                    <hr />
                    <Typography style = {{'textDecoration': 'line-through'}} color = 'text.secondary' variant = 'body1'>{missing}</Typography>
                  </div>
                );
              })}
              <Button style = {{'width': '100%', 'marginTop': 10}} variant = 'contained' disabled = {option.disabled}>{trial ? 'Try now' : 'Subscribe'}</Button>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    )
  };


  return (
   <div>
    <Billing open = {billingOpen} closeHandler = {handleBillingClose} pricing = {selectedPricing} />
    <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant='h5'>Picks access</Typography>
    <div style = {{'textAlign': 'center', 'margin': '10px 0px'}}><Button startIcon = {<PicksIcon />} variant='outlined' onClick={() => {router.push('/cbb/picks')}}>View Picks</Button></div>
    <Grid container spacing={4} style = {{'justifyContent': 'center'}}>
      {picksOptions.map((option) => {
        return getPriceCard(option);
      })}
    </Grid>
    <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant='h5'>API access</Typography>
    <div style = {{'textAlign': 'center', 'margin': '10px 0px'}}><Button endIcon = {<LaunchIcon />} variant='outlined' onClick={() => {window.open('https://docs.srating.io/', '_blank')}}>API Documentation</Button></div>
    <Grid container spacing={4} style = {{'justifyContent': 'center'}}>
      {apiOptions.map((option) => {
        return getPriceCard(option);
      })}
    </Grid>
   </div>
  );
}

export default Pricing;