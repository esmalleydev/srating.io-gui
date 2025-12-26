'use client';

import { useState, useRef, RefObject } from 'react';

import Footer from '../components/generic/Footer';

import Pricing from '@/components/generic/Pricing';
import { getLogoColorPrimary, getLogoColorSecondary } from '@/components/utils/Color';

import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BuildIcon from '@mui/icons-material/Build';
import TrendsExample from '@/components/generic/Home/TrendsExample';
import RankingExample from '@/components/generic/Home/RankingExample';
import ToolsExample from '@/components/generic/Home/ToolsExample';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { useTheme } from '@/components/hooks/useTheme';
import Typography from '@/components/ux/text/Typography';
import Paper from '@/components/ux/container/Paper';

const Home = () => {
  const [selectedHero, setSelectedHero] = useState('trends');

  const theme = useTheme();

  const { width } = useWindowDimensions() as Dimensions;

  const ref: RefObject<HTMLDivElement | null> = useRef(null);

  const cards = [
    {
      id: 'trends',
      name: 'Trends',
      icon: <TrendingUpIcon fontSize = 'medium' style = {{ display: 'inline-block', color: theme.success.dark }} />,
      description: 'View trends of any statistic. See data at any point in time and how it compares to league and conference averages.',
    },
    {
      id: 'rankings',
      name: 'Rankings',
      icon: <EmojiEventsIcon fontSize = 'medium' style = {{ display: 'inline-block', color: theme.warning.dark }} />,
      description: 'Rank every team, coach, player, conference. Also view ranks of each individual metric.',
    },
    {
      id: 'tools',
      name: 'Tools',
      icon: <BuildIcon fontSize = 'medium' style = {{ display: 'inline-block', color: theme.secondary.dark }} />,
      description: 'Powerful comparison and prediction tools to scout any match up. Compare stats, roster, trends.',
    },
  ];

  const getHero = () => {
    const contents: React.JSX.Element[] = [];

    if (selectedHero === 'trends') {
      contents.push(
        <Paper key = {'trends'} style = {{ width: '100%', padding: '0px 0px 10px 0px' }}>
          <TrendsExample />
        </Paper>,
      );
    }

    if (selectedHero === 'rankings') {
      contents.push(
        <Paper key = {'rankings'} style = {{ width: '100%', padding: '0px' }}>
          <RankingExample />
        </Paper>,
      );
    }

    if (selectedHero === 'tools') {
      contents.push(
        <Paper key = {'tools'} style = {{ width: '100%' }}>
          <ToolsExample />
        </Paper>,
      );
    }

    return (
      <div style = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {contents}
      </div>
    );
  };

  let cardWidth = width <= 900 ? 250 : 300;
  const breakPoint = 475;

  const hitBreakPoint = (width <= breakPoint);

  if (hitBreakPoint) {
    cardWidth = 120;
  }

  return (
    <div>
      <main>
        <div style = {{ padding: 8 }}>
          <Typography
            type="h2"
            style = {{ textAlign: 'center', color: theme.text.primary, fontWeight: 600, fontStyle: 'italic', marginBottom: 16 }}
          >
            {<><span style = {{ color: getLogoColorPrimary() }}>s</span><span style = {{ color: getLogoColorSecondary() }}>Rating</span></>}
          </Typography>
          <Typography type="h5" style = {{ textAlign: 'center', color: theme.text.secondary, marginBottom: 16 }}>
            Analysis tools, picks for 🏀 & 🏈, <br /> no ads, <a style = {{ color: theme.link.primary }} href = "https://github.com/esmalleydev/srating.io-gui" target = "_blank">open-source</a>
          </Typography>
        </div>
        <div style = {{ padding: '0px 5px 5px 5px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {cards.map((card) => {
            const cardStyle: React.CSSProperties = {
              maxWidth: cardWidth,
              minWidth: cardWidth,
              margin: '5px',
              border: `2px solid ${card.id === selectedHero ? theme.info.dark : 'transparent'}`,
              padding: 8,
              cursor: 'pointer',
            };


            return (
              <Paper key = {card.id} hover onClick={() => setSelectedHero(card.id)} style={cardStyle}>
                <div style = {{ display: 'flex', alignItems: 'center' }}>
                  <span style = {{ display: 'flex', marginRight: 10 }}>{card.icon}</span>
                  <Typography type={(hitBreakPoint ? 'body1' : 'h6')} style = {{ display: 'inline-block' }}>{card.name}</Typography>
                </div>
                {
                hitBreakPoint ? '' :
                <Typography type="body2" style={{ color: theme.text.secondary }}>
                  {card.description}
                </Typography>
                }
              </Paper>
            );
          })}
        </div>
        <div style = {{ width: '100%', maxWidth: 900, margin: 'auto', padding: '0px 5px 5px 5px' }}>
          {getHero()}
        </div>
        <div ref = {ref} style = {{ padding: '10px 10px' }}>
          <Pricing view = {null} />
        </div>
      </main>
      <div style = {{ padding: '20px 0px 0px 0px' }}><Footer /></div>
    </div>
  );
};

export default Home;
