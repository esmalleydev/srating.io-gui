'use client';

import React, { useState, useRef, useTransition, RefObject } from 'react';
import { useRouter } from 'next/navigation';

import Image from 'next/image'
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

import Footer from '../components/generic/Footer';

import apiImage from '../public/static/images/api.png';
import rankingImage from '../public/static/images/ranking.png';
import scoresImage from '../public/static/images/scores.png';
import picksImage from '../public/static/images/picks.png';
import teamImage from '../public/static/images/team.png';
import gameImage from '../public/static/images/statcompare.png';
import playerImage from '../public/static/images/player.png';

import Pricing from '../components/generic/Pricing';
import BackdropLoader from '@/components/generic/BackdropLoader';
import { getLogoColorPrimary, getLogoColorSecondary } from '@/components/utils/Color';

const Home = () => {

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [spin, setSpin] = useState(false);

  const ref: RefObject<HTMLDivElement> = useRef(null);

  const handlePath = (path) => {
    setSpin(true);
    startTransition(() => {
      router.push(path);
      setSpin(false);
    });
  };

  const cards = [
    {
      'value': 'docs',
      'heading': 'API',
      'image': apiImage,
      'contents': 'Follow the API documentation to set up and send a request in 3 steps.',
      'action': () => {/*ref.current?.scrollIntoView({ behavior: 'smooth' })*/window.open('https://docs.srating.io/', '_blank')}
    },
    {
      'value': 'cbb_ranking',
      'heading': 'Ranking',
      'image': rankingImage,
      'contents': 'Aggregate rankings for college basketball teams and players. Sort by any ranking metric, filter by conference, season.',
      'action': () => {handlePath('/cbb/ranking');}
    },
    {
      'value': 'cbb_scores',
      'heading': 'Scores',
      'image': scoresImage,
      'contents': 'View scores real time, with live odds. Filter by conference, game status.',
      'action': () => {handlePath('/cbb/games');}
    },
    {
      'value': 'cbb_game',
      'heading': 'Game details',
      'image': gameImage,
      'contents': 'View a game\'s boxscore, match up, trends.',
      'action': () => {handlePath('/cbb/games/81a20ec9-8551-11ed-bf01-5296e1552828');}
    },
    {
      'value': 'cbb_team',
      'heading': 'Teams',
      'image': teamImage,
      'contents': 'View a team\'s schedule, statistics, trends.',
      'action': () => {handlePath('/cbb/team/87019264-8549-11ed-bf01-5296e1552828');}
    },
    {
      'value': 'cbb_picks',
      'heading': 'Picks',
      'image': picksImage,
      'contents': 'View my picks for today\'s games, along with a betting calculator to customize odds.',
      'action': () => {handlePath('/cbb/picks');}
    },
    {
      'value': 'cbb_player',
      'heading': 'Players',
      'image': playerImage,
      'contents': 'View a player\'s statistics, ranking, game log, trends.',
      'action': () => {handlePath('/cbb/player/dff6dce2-ad5a-11ed-9185-b6be2f39279c');}
    },
  ];


  return (
    <div>
      <main>
        <BackdropLoader open = {spin} />
        <Box
          sx={{
            pt: 2,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              style = {{'fontWeight': 600, 'fontStyle': 'italic'}}
              gutterBottom
            >
              {<><span style = {{'color': getLogoColorPrimary()}}>s</span><span style = {{'color': getLogoColorSecondary()}}>Rating</span></>}
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              College basketball live scores, odds, picks, API, <br /> no ads, <Link underline="hover" href = "https://github.com/esmalleydev/srating.io-gui" target = "_blank">open-source</Link>
            </Typography>
            <Stack
              // sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button onClick = {() => {handlePath('/cbb/ranking');}} variant="outlined">Ranking</Button>
              <Button onClick = {() => {handlePath('/cbb/games')}} variant="outlined">Scores</Button>
              <Button onClick = {() => {handlePath('/cbb/picks')}} variant="outlined">Picks</Button>
            </Stack>
          </Container>
          <div style = {{'textAlign': 'center', 'padding': 20}}>
            <Button style = {{'width': '100%', 'maxWidth': 400}} onClick = {() => {ref.current?.scrollIntoView({ behavior: 'smooth' })}} variant="contained">Get Picks / API access</Button>
          </div>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card.value} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia sx = {{'height': 175}}>
                    <div style={{ 'position': 'relative', 'width': '100%', 'height': '100%' }}>
                      <Image
                        alt = {card.heading}
                        src = {card.image}
                        fill = {true}
                        sizes = 'max-width: 100%'
                        style = {{
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.heading}
                    </Typography>
                    <Typography>
                      {card.contents}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button onClick = {card.action} size="small">View</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <div ref = {ref} style = {{'padding': '0px 20px', 'scrollMargin': 85}}>
          <Pricing />
        </div>
      </main>
      <div style = {{'padding': '20px 0px 0px 0px'}}><Footer /></div>
    </div>
  );
}

export default Home;
