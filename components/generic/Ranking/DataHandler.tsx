'use client';

import { setDataKey } from '@/redux/features/ranking-slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Organization from '@/components/helpers/Organization';
import { CBBRankingTable } from '@/types/cbb';
import { CFBRankingTable } from '@/types/cfb';
import { useEffect } from 'react';

const getData = ({ view }) => {
  // console.time('getData')
  const data = useAppSelector((state) => state.rankingReducer.data);
  const positions = useAppSelector((state) => state.displayReducer.positions);
  const selectedConferences = useAppSelector((state) => state.displayReducer.conferences);
  const hideCommitted = useAppSelector((state) => state.rankingReducer.hideCommitted);
  const hideUnderTwoMPG = useAppSelector((state) => state.rankingReducer.hideUnderTwoMPG);
  const filterCommittedConf = useAppSelector((state) => state.rankingReducer.filterCommittedConf);
  const filterOriginalConf = useAppSelector((state) => state.rankingReducer.filterOriginalConf);
  const conferences = useAppSelector((state) => state.dictionaryReducer.conference);
  const isCBB = Organization.isCBB();
  const isCFB = Organization.isCFB();

  const args = {
    view, data, positions, selectedConferences, hideCommitted, hideUnderTwoMPG, filterCommittedConf, filterOriginalConf, conferences,
  };

  // you have to pass the functions the same arguments or on re-render it complains about hooks being different (re-rendering from CFB to CBB organization)
  if (isCBB) {
    return formatCBBData(args);
    // console.time('formatCBBData')
    // console.timeEnd('formatCBBData')
  }
  if (isCFB) {
    return formatCFBData(args);
  }

  return { rows: [], lastUpdated: null };
};

const formatCBBData = (args) => {
  const {
    view, data, positions, selectedConferences, hideCommitted, hideUnderTwoMPG, filterCommittedConf, filterOriginalConf, conferences,
  } = args;
  const rows: CBBRankingTable[] = [];
  let lastUpdated: string | null = null;

  for (const id in data) {
    // Fixes - TypeError: Cannot add property name, object is not extensible
    const row = { ...data[id] };

    row.rank_delta_combo = `${row.rank_delta_one || '-'}/${row.rank_delta_seven || '-'}`;

    if (
      view !== 'transfer' &&
      selectedConferences.length &&
      selectedConferences.indexOf(row.conference_id) === -1
    ) {
      continue;
    }

    // if transfer and conference is not in original or new conf conference, remove them
    if (
      view === 'transfer' &&
      selectedConferences.length &&
      (
        (
          filterOriginalConf && filterCommittedConf && (selectedConferences.indexOf(row.conference_id) === -1 && selectedConferences.indexOf(row.committed_conference_id) === -1)
        ) ||
        (
          (!filterCommittedConf && filterOriginalConf && selectedConferences.indexOf(row.conference_id) === -1) || (!filterOriginalConf && filterCommittedConf && selectedConferences.indexOf(row.committed_conference_id) === -1)
        )
      )
    ) {
      continue;
    }


    // transfers
    if (hideCommitted && +row.committed === 1) {
      continue;
    }

    if (view === 'player' || view === 'transfer') {
      if (hideUnderTwoMPG && row.minutes_per_game < 2) {
        continue;
      }
    }

    if (view === 'team') {
      if (
        !lastUpdated ||
        lastUpdated < row.updated_at
      ) {
        lastUpdated = row.updated_at;
      }

      const wins = row.wins || 0;
      const losses = row.losses || 0;
      const confwins = row.confwins || 0;
      const conflosses = row.conflosses || 0;

      row.record = `${wins}-${losses}`;
      row.conf_record = `${confwins}-${conflosses}`;
      row.conference_code = (row.conference_id && row.conference_id in conferences) ? conferences[row.conference_id].code : 'Unknown';

      rows.push(row);
    } else if (view === 'player' || view === 'transfer') {
      if (
        !lastUpdated ||
        lastUpdated < row.updated_at
      ) {
        lastUpdated = row.updated_at;
      }

      row.name = row.player ? (`${row.player.first_name.charAt(0)}. ${row.player.last_name}`) : null;
      row.number = row.player ? row.player.number : null;
      row.position = row.player ? row.player.position : null;
      row.height = row.player ? row.player.height : null;

      if (row.conference_id && row.conference_id in conferences) {
        row.conference_code = conferences[row.conference_id].code;
      }

      if (
        positions.length &&
        positions.indexOf(row.position) === -1
      ) {
        continue;
      }

      rows.push(row);
    } else if (view === 'conference') {
      if (
        !lastUpdated ||
        lastUpdated < row.updated_at
      ) {
        lastUpdated = row.updated_at;
      }
      row.name = conferences[row.conference_id].code;

      // row.adj_elo = +(+row.elo - +row.elo_sos).toFixed(2);

      rows.push(row);
    } else if (view === 'coach') {
      if (
        !lastUpdated ||
        lastUpdated < row.updated_at
      ) {
        lastUpdated = row.updated_at;
      }

      rows.push(row);
    }
  }

  return { rows, lastUpdated };
};

const formatCFBData = (args) => {
  const { view, data, positions, selectedConferences, hideUnderTwoMPG, conferences } = args;
  const rows: CFBRankingTable[] = [];
  let lastUpdated: string | null = null;

  for (const id in data) {
    // Fixes - TypeError: Cannot add property name, object is not extensible
    const row = { ...data[id] };

    row.rank_delta_combo = `${row.rank_delta_one || '-'}/${row.rank_delta_seven || '-'}`;

    if (
      selectedConferences.length &&
      selectedConferences.indexOf(row.conference_id) === -1
    ) {
      continue;
    }

    if (view === 'player') {
      if (hideUnderTwoMPG && row.minutes_per_game < 2) {
        continue;
      }
    }

    if (view === 'team') {
      if (
        !lastUpdated ||
        lastUpdated < row.updated_at
      ) {
        lastUpdated = row.updated_at;
      }

      const wins = row.wins || 0;
      const losses = row.losses || 0;
      const confwins = row.confwins || 0;
      const conflosses = row.conflosses || 0;

      row.record = `${wins}-${losses}`;
      row.conf_record = `${confwins}-${conflosses}`;
      row.conference_code = (row.conference_id && row.conference_id in conferences) ? conferences[row.conference_id].code : 'Unknown';

      rows.push(row);
    } else if (view === 'player') {
      if (
        !lastUpdated ||
        lastUpdated < row.updated_at
      ) {
        lastUpdated = row.updated_at;
      }

      row.name = row.player ? (`${row.player.first_name.charAt(0)}. ${row.player.last_name}`) : null;
      row.number = row.player ? row.player.number : null;
      row.position = row.player ? row.player.position : null;
      row.height = row.player ? row.player.height : null;

      if (row.conference_id && row.conference_id in conferences) {
        row.conference_code = conferences[row.conference_id].code;
      }

      row.rank = row.efficiency_rating_rank;

      if (
        positions.length &&
        positions.indexOf(row.position) === -1
      ) {
        continue;
      }

      rows.push(row);
    } else if (view === 'conference') {
      if (
        !lastUpdated ||
        lastUpdated < row.updated_at
      ) {
        lastUpdated = row.updated_at;
      }
      row.name = conferences[row.conference_id].code;

      rows.push(row);
    } else if (view === 'coach') {
      if (
        !lastUpdated ||
        lastUpdated < row.updated_at
      ) {
        lastUpdated = row.updated_at;
      }

      rows.push(row);
    }
  }

  return { rows, lastUpdated };
};


export const getRows = ({ view }) => {
  return getData({ view }).rows;
};

export const getLastUpdated = ({ view }) => {
  return getData({ view }).lastUpdated;
};


const DataHandler = ({ data }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setDataKey({ key: 'data', value: data }));
  }, [dispatch]);

  return null;
};

export default DataHandler;
