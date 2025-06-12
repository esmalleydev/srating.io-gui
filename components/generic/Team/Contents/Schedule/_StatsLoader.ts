'use client';

import { useClientAPI } from '@/components/clientAPI';
import { setDataKey } from '@/redux/features/team-slice';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect, useState } from 'react';

// this is no longer used, but it is well written, keep around for references

/**
 * Gets the stats data.
 * You might think this runs twice, but its just a react thing
 * @param {object} args
 * @param {string} args.team_id
 * @param {number} args.season
 * @param {array} args.game_ids
 * @return {void}
 */
const StatsLoader = ({ team_id, season, game_ids }) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [lastTeamID, setLastTeamID] = useState(null);
  const [lastSeason, setLastSeason] = useState(null);

  const getData = () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setLastTeamID(team_id);
    setLastSeason(season);
    dispatch(setDataKey({ key: 'scheduleStatsLoading', value: true }));

    useClientAPI({
      class: 'game',
      function: 'getAllStats',
      arguments: {
        game_ids,
      },
    }).then((response) => {
      dispatch(setDataKey({ key: 'scheduleStats', value: response }));
      dispatch(setDataKey({ key: 'scheduleStatsLoading', value: false }));
      setLoading(false);
    }).catch((e) => {
      dispatch(setDataKey({ key: 'scheduleStatsLoading', value: false }));
      setLoading(false);
    });
  };


  useEffect(() => {
    if (lastTeamID !== team_id || lastSeason !== season) {
      getData();
    }
  }, [team_id, season]);

  return null;
};

export default StatsLoader;
