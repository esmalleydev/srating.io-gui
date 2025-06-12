'use client';

import { useEffect, useState, useTransition } from 'react';
import Legend from './Legend';
import FloatingButtons from './FloatingButtons';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import CheckIcon from '@mui/icons-material/Check';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import OptionPicker from '../OptionPicker';
import { setLoading as setLoadingDisplay, clearPositions, updatePositions } from '@/redux/features/display-slice';
import { setDataKey } from '@/redux/features/ranking-slice';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import AdditionalOptions from './AdditionalOptions';
import PositionPicker from '../PositionPicker';
import Search from './Search';
import { getViewableColumns } from './columns';
import LastUpdated from './LastUpdated';
import Organization from '@/components/helpers/Organization';
import ColumnChipPicker from './ColumnChipPicker';
import DownloadOption from './DownloadOption';
import ConferenceChips from '../ConferenceChips';
import ConferencePicker from '../ConferencePicker';
import Chip from '@/components/ux/container/Chip';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';


const Base = (
  { organization_id, division_id, season, view, children }:
  { organization_id: string, division_id: string, season: number, view: string, children: React.JSX.Element | React.JSX.Element[] },
) => {
  // console.time('Base')
  // console.time('Base.logic')
  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();

  const positions = useAppSelector((state) => state.displayReducer.positions);
  const tableFullscreen = useAppSelector((state) => state.rankingReducer.tableFullscreen);
  const columnView = useAppSelector((state) => state.rankingReducer.columnView);
  const customColumns = useAppSelector((state) => state.rankingReducer.customColumns);

  const [legendOpen, setLegendOpen] = useState(false);

  const columns = getViewableColumns({ organization_id, view, columnView, customColumns });

  // todo grab this on page load
  let seasons = Organization.getCBBID() === organization_id ? [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011] : [2024, 2025];

  if (view === 'transfer') {
    seasons = [2024];
  }

  const { width } = useWindowDimensions() as Dimensions;

  // useEffect(() => {
  //   console.timeEnd('Base')
  // })
  // const breakPoint = 425;

  const rankViewOptions = [
    { value: 'team', label: 'Team rankings' },
    { value: 'conference', label: 'Conference rankings' },
    { value: 'coach', label: 'Coach rankings' },
  ];

  if (Organization.getCBBID() === organization_id) {
    rankViewOptions.push({ value: 'player', label: 'Player rankings' });
    rankViewOptions.push({ value: 'transfer', label: 'Transfer rankings' });
  }

  let sport = 'basketball';
  if (Organization.getCFBID() === organization_id) {
    sport = 'football';
  }


  const positionChips: React.JSX.Element[] = [];
  for (let i = 0; i < positions.length; i++) {
    positionChips.push(<Chip key = {positions[i]} value = {positions[i]} style = {{ margin: '5px' }} title={positions[i]} onDelete={() => { dispatch(updatePositions(positions[i])); }} />);
  }

  const handleRankView = (newRankView) => {
    if (newRankView !== view) {
      localStorage.removeItem(`${organization_id}.RANKING.COLUMNS.${view}`);
      dispatch(setDataKey({ key: 'data', value: null }));
      dispatch(setDataKey({ key: 'customColumns', value: ['rank', 'name'] }));
      dispatch(clearPositions());
      dispatch(setDataKey({ key: 'order', value: 'asc' }));
      dispatch(setDataKey({ key: 'orderBy', value: 'rank' }));
      dispatch(setDataKey({ key: 'tableScrollTop', value: 0 }));
      dispatch(setDataKey({ key: 'columnView', value: 'composite' }));

      if (searchParams) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('view', newRankView);
        current.delete('hideCommitted');
        current.delete('hideUnderTwoMPG');
        const search = current.toString();
        const query = search ? `?${search}` : '';
        startTransition(() => {
          router.push(`${pathName}${query}`);
        });
      }
    }
  };

  const handleSeason = (newSeason) => {
    if (newSeason !== season) {
      if (searchParams) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('season', newSeason);
        const search = current.toString();
        const query = search ? `?${search}` : '';
        dispatch(setLoadingDisplay(true));
        startTransition(() => {
          router.push(`${pathName}${query}`);
        });
      }
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

  // console.timeEnd('Base.logic')
  return (
    <div>
      <Legend open = {legendOpen} onClose={handleLegend} columns={columns} view={view} organization_id = {organization_id} />
      <FloatingButtons />
      {
        !tableFullscreen ?
            <div style = {{ padding: '5px 20px 0px 20px' }}>
              <div style = {{ display: 'flex', justifyContent: 'right', flexWrap: 'wrap' }}>
                <OptionPicker buttonName = {`${view} rankings`} options = {rankViewOptions} selected = {[view]} actionHandler = {handleRankView} isRadio = {true} />
                <OptionPicker buttonName = {season.toString()} options = {seasonOptions} selected = {[season.toString()]} actionHandler = {handleSeason} isRadio = {true} />
              </div>
              <Typography type = {width < 500 ? 'h6' : 'h5'}>{title}</Typography>
              {Organization.getCFBID() === organization_id && view === 'coach' ? <Typography type = 'body1' style = {{ fontStyle: 'italic', color: theme.text.secondary }}>Games since Aug '23</Typography> : ''}
              <LastUpdated view = {view} handleLegend={handleLegend} />
              <ColumnChipPicker view = {view} organization_id={organization_id} />
              <div style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  {view === 'player' || view === 'transfer' ? <AdditionalOptions view = {view} /> : ''}
                  {view !== 'conference' ? <ConferencePicker /> : ''}
                  {view === 'player' || view === 'transfer' ? <PositionPicker selected = {positions} /> : ''}
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
  );
};

export default Base;
