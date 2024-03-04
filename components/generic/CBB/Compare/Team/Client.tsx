'use client';
import React from 'react';
import TableView from './TableView';
import CompareView from './CompareView';


const Client = ({ home_team_id, away_team_id, teams, season, subview }) => {
  return (
    <>
    {subview === 'table' ? <TableView teams = {teams} season = {season} /> : <CompareView home_team_id = {home_team_id} away_team_id = {away_team_id} teams = {teams} season = {season} />}
    </>
  );
}

export default Client;
