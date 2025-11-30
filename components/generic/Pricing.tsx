'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
  Box,
  CardActionArea,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LaunchIcon from '@mui/icons-material/Launch';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
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
      features: [
        'Predicted win %',
        'Predicted score / spread / over',
        'Betting calculator tool',
      ],
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
      features: [
        'Predicted win %',
        'Predicted score / spread / over',
        'Betting calculator tool',
      ],
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
    const buttonColor = (option.disabled ? theme.grey[500] : theme.blue[700]);
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
      <Stack spacing={3} style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
        <Typography type='body1' style={{ maxWidth: '600px', margin: 'auto', color: theme.text.secondary }}>
          Start making data-driven decisions with our AI-powered sports predictions.
        </Typography>
        <Box style={{ maxWidth: '600px', margin: 0 }}>
          <List style = {{ padding: 0 }}>
            <ListItem>
              <ListItemIcon>
                <SmartToyIcon color='primary' />
              </ListItemIcon>
              <ListItemText
                primary='AI-Powered Predictive Models'
                secondary='Our algorithms are trained on historical datasets: 10+ years of 🏀 (75,000+ games) and 20+ years of 🏈 (20,000+ games).'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AnalyticsIcon color='primary' />
              </ListItemIcon>
              <ListItemText
                primary='Daily Data-Driven Picks'
                secondary='Receive daily, unbiased picks for College Basketball and Football, generated by our sophisticated analytics engine.'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon color='primary' />
              </ListItemIcon>
              <ListItemText
                primary='Proven & Transparent'
                secondary={
                  <>
                    We believe in transparency. View our {' '}
                    <a style={{ cursor: 'pointer', color: theme.link.primary }} onClick={(e) => { e.preventDefault(); router.push('/cbb/picks?view=stats'); }} href='/cbb/picks?view=stats'>
                      live CBB win-rate stats
                    </a>
                    {' '} or {' '}
                    <a style={{ cursor: 'pointer', color: theme.link.primary }} onClick={(e) => { e.preventDefault(); router.push('/cfb/picks?view=stats'); }} href='/cfb/picks?view=stats'>
                      live CFB
                    </a>
                    {' '}. Live win rate is broken down by season, month, week, and day. Also read our {' '}
                    <a style={{ cursor: 'pointer', color: theme.link.primary }} onClick={(e) => { e.preventDefault(); router.push('/blog/picks-2023-review'); }} href='/blog/picks-2023-review'>
                      2023 blog season review
                    </a>. Check out the code on <a style = {{ color: theme.link.primary }} href = "https://github.com/esmalleydev/srating.io-gui" target = "_blank">Github</a>.
                  </>
                }
              />
            </ListItem>
          </List>
        </Box>
      </Stack>
      <Divider style = {{ margin: '8px 0px' }}>
        <Typography type="h5">Choose Your Plan</Typography>
      </Divider>
      <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
        {picksOptions.map((option) => {
          return getPriceCard(option);
        })}
      </Grid>
    </> :
    <>
      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} type='h5'>API access <sup style = {{ fontSize: '14px' }}>beta</sup></Typography>
      <Stack spacing={3} style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
        <Typography type='body1' style={{ maxWidth: '600px', margin: 'auto', color: theme.text.secondary }}>
          Integrate our powerful sports data and predictions directly into your applications with our flexible API.
        </Typography>
        <Box style={{ maxWidth: '600px', margin: 0 }}>
          <List style = {{ padding: 0 }}>
            <ListItem>
              <ListItemIcon><DataObjectIcon color='primary' /></ListItemIcon>
              <ListItemText
                primary='Flexible & Powerful Data'
                secondary='Access comprehensive data for games, teams, players, stats, live scores, and our AI-powered picks.'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><ShowChartIcon color='primary' /></ListItemIcon>
              <ListItemText
                primary='Live Scores & Betting Odds'
                secondary='Get up-to-the-minute game scores and betting odds to power real-time applications and analysis.'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><IntegrationInstructionsIcon color='primary' /></ListItemIcon>
              <ListItemText
                primary='Simple & Fast Integration'
                secondary={
                  <>
                    Start building in minutes. Read our {' '}
                    <a
                      style={{ cursor: 'pointer', color: theme.link.primary }}
                      onClick={(e) => { e.preventDefault(); window.open('https://docs.srating.io/', '_blank'); }}
                      href='https://docs.srating.io/'
                      target="_blank"
                      rel="noopener noreferrer"
                    >API Documentation</a>
                    {' '} and try it free.
                  </>
                }
              />
            </ListItem>
          </List>
        </Box>
      </Stack>
      <Grid container spacing={4} style = {{ justifyContent: 'center' }}>
        {apiOptions.map((option) => {
          return getPriceCard(option);
        })}
      </Grid>
    </>
    }
  </div>
  );
};

export default Pricing;
