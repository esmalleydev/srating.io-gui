'use client';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import Team from './Team';
import { getNavHeaderHeight } from '../NavBar';
import { getSubNavHeaderHeight } from '../SubNavbar';
import Roster from './Roster';


const Client = ({ teamStats, rosterStats}) => {
  const searchParams = useSearchParams();
  let subView = searchParams?.get('subview') || 'team';

  const paddingTop = getNavHeaderHeight() + getSubNavHeaderHeight();

  return (
    <div style ={{'paddingTop': paddingTop}}>
      {subView === 'team' ? <Team teamStats = {teamStats} /> : ''}
      {subView === 'player' ? <Roster rosterStats = {rosterStats} /> : ''}
    </div>
  );
}

export default Client;
