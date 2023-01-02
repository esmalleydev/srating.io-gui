import React from 'react';
import { Outlet, useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import rankingImage from './img/Home/ranking.png';
import scoresImage from './img/Home/scores.png';
import picksImage from './img/Home/picks.PNG';
import teamImage from './img/Home/team.PNG';
import gameImage from './img/Home/game.PNG';

const Home = (props) => {

  const navigate = useNavigate();

  const cards = [
    {
      'value': 'cbb_ranking',
      'heading': 'Ranking',
      'image': rankingImage,
      'contents': 'Aggregate rankings for college basketball, combining multiple metrics. Sort by any ranking metric, filter by conference.',
      'action': () => {navigate('/CBB/Ranking');}
    },
    {
      'value': 'cbb_scores',
      'heading': 'Scores',
      'image': scoresImage,
      'contents': 'View scores real time, with live odds. Filter by conference, game status.',
      'action': () => {navigate('/CBB/Games');}
    },
    {
      'value': 'cbb_picks',
      'heading': 'Picks',
      'image': picksImage,
      'contents': 'View my picks for today\'s games, along with a betting calculator to customize.',
      'action': () => {navigate('/CBB/Picks');}
    },
    {
      'value': 'cbb_team',
      'heading': 'Teams',
      'image': teamImage,
      'contents': 'View a team\'s schedule, statistics, trends.',
      'action': () => {navigate('/CBB/Team/87019264-8549-11ed-bf01-5296e1552828');}
    },
    {
      'value': 'cbb_game',
      'heading': 'Game details',
      'image': gameImage,
      'contents': 'View a game\'s boxscore, match up, trends.',
      'action': () => {navigate('/CBB/Games/67c452cc-8551-11ed-bf01-5296e1552828');}
    },
  ];


  return (
    <div>
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Sports ranking
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Aggregate data, clear statistics, better visualization, no ads, open-source.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button onClick = {() => {navigate('/CBB/Ranking')}} variant="contained">CBB ranking</Button>
              <Button onClick = {() => {navigate('/CBB/Games')}} variant="outlined">CBB Scores</Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card.value} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      // 16:9
                      // pt: '56.25%',
                    }}
                    image = {card.image}
                    alt = {card.heading}
                  />
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
      </main>
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          🚂🚂🚂 Boiler up!
        </Typography>
      </Box>
    </div>
  );
}

export default Home;
