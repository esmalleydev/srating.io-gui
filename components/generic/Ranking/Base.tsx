'use client';

import { Profiler, useEffect, useState } from 'react';
import Legend from './Legend';
import FloatingButtons from './FloatingButtons';
// import CheckIcon from '@mui/icons-material/Check';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import OptionPicker from '../OptionPicker';
import { updateDataKey } from '@/redux/features/display-slice';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import AdditionalOptions from './AdditionalOptions';
import Search from './Search';
import LastUpdated from './LastUpdated';
import Organization from '@/components/helpers/Organization';
import ColumnChipPicker from './ColumnChipPicker';
import DownloadOption from './DownloadOption';
import ConferenceChips from '../ConferenceChips';
import ConferencePicker from '../ConferencePicker';
import Chip from '@/components/ux/container/Chip';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';
import PositionPicker from './PositionPicker';
import TableColumns from '@/components/helpers/TableColumns';
import Navigation from '@/components/helpers/Navigation';


const Base = (
  { organization_id, division_id, season, view, children }:
  { organization_id: string, division_id: string, season: number, view: string, children: React.JSX.Element | React.JSX.Element[] },
) => {
  const navigation = new Navigation();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const organization_id_x_division_id_x_ranking_seasons = useAppSelector((state) => state.dictionaryReducer.organization_id_x_division_id_x_ranking_seasons);
  const positions = useAppSelector((state) => state.displayReducer.positions);
  const tableFullscreen = useAppSelector((state) => state.rankingReducer.tableFullscreen);
  const columnView = useAppSelector((state) => state.rankingReducer.columnView);
  const customColumns = useAppSelector((state) => state.rankingReducer.customColumns);

  const [legendOpen, setLegendOpen] = useState(false);

  const columns = TableColumns.getViewableColumns({ organization_id, view, columnView, customColumns, positions });

  let seasons = (
    organization_id in organization_id_x_division_id_x_ranking_seasons &&
    division_id in organization_id_x_division_id_x_ranking_seasons[organization_id] &&
    organization_id_x_division_id_x_ranking_seasons[organization_id][division_id]
  ) || [];

  if (view === 'transfer') {
    seasons = [2025, 2024];
  }

  const { width } = useWindowDimensions() as Dimensions;

  useEffect(() => {
    if (
      Organization.getCFBID() === organization_id &&
      view === 'player' &&
      !positions.length
    ) {
      dispatch(updateDataKey({ key: 'positions', value: 'QB' }));
    }
    // console.timeEnd('Base')
  }, [view]);
  // const breakPoint = 425;

  const rankViewOptions = [
    { value: 'team', label: 'Team rankings' },
    { value: 'conference', label: 'Conference rankings' },
    { value: 'coach', label: 'Coach rankings' },
    { value: 'player', label: 'Player rankings' },
  ];

  if (Organization.getCBBID() === organization_id) {
    rankViewOptions.push({ value: 'transfer', label: 'Transfer rankings' });
  }

  let sport = 'basketball';
  if (Organization.getCFBID() === organization_id) {
    sport = 'football';
  }


  const positionChips: React.JSX.Element[] = [];
  if (Organization.getCFBID() !== organization_id) {
    for (let i = 0; i < positions.length; i++) {
      positionChips.push(<Chip key = {positions[i]} value = {positions[i]} style = {{ margin: '5px' }} title={positions[i]} onDelete={() => { dispatch(updateDataKey({ key: 'positions', value: positions[i] })); }} />);
    }
  }

  const handleRankView = (newRankView: string) => {
    if (newRankView !== view) {
      // todo move this to the state or navigation component
      localStorage.removeItem(`${organization_id}.RANKING.COLUMNS.${view}`);
      navigation.rankingView({ view: newRankView });
    }
  };

  const handleSeason = (newSeason) => {
    if (newSeason !== season) {
      navigation.rankingView({ season: newSeason });
    }
  };

  const handleLegend = () => {
    setLegendOpen(!legendOpen);
  };

  const seasonOptions = seasons.map((value) => {
    return {
      value: value.toString(),
      label: `${value - 1} - ${value}`,
    };
  });
  const title = `College ${sport} ${view} rankings.`;


  return (
    <Profiler id="Ranking.Base" onRender={(id, phase, actualDuration) => {
      console.log(id, phase, actualDuration);
    }}>
    <div>
      <Legend open = {legendOpen} onClose={handleLegend} columns={columns} view={view} organization_id = {organization_id} />
      <FloatingButtons />
      {
        !tableFullscreen ?
            <div style = {{ padding: '5px 10px 0px 10px' }}>
              <div style = {{ display: 'flex', justifyContent: 'right', flexWrap: 'wrap' }}>
                <OptionPicker buttonName = {`${view} rankings`} options = {rankViewOptions} selected = {[view]} actionHandler = {handleRankView} isRadio = {true} />
                <OptionPicker buttonName = {season.toString()} options = {seasonOptions} selected = {[season.toString()]} actionHandler = {handleSeason} isRadio = {true} />
              </div>
              <Typography type = {width < 500 ? 'h6' : 'h5'}>{title}</Typography>
              {Organization.getCFBID() === organization_id && view === 'coach' ? <Typography type = 'body1' style = {{ fontStyle: 'italic', color: theme.text.secondary }}>Games since Aug '00</Typography> : ''}
              <LastUpdated view = {view} handleLegend={handleLegend} />
              <ColumnChipPicker view = {view} organization_id={organization_id} />
              <div style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  {view === 'player' || view === 'transfer' ? <AdditionalOptions view = {view} /> : ''}
                  {view !== 'conference' ? <ConferencePicker /> : ''}
                  {view === 'player' || view === 'transfer' ? <PositionPicker selected = {positions} isRadio = {Organization.getCFBID() === organization_id} /> : ''}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Search view = {view} />
                  {width >= 385 ? <DownloadOption view={view} organization_id={organization_id} division_id={division_id} season={season} /> : ''}
                </div>
              </div>
              <ConferenceChips />
              {positionChips}
            </div>
          : ''
      }
      {children}
    </div>
    </Profiler>
  );
};

export default Base;
