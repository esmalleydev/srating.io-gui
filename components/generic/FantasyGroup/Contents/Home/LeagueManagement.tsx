'use client';


import Columns from '@/components/ux/layout/Columns';
import Typography from '@/components/ux/text/Typography';
import { useAppSelector } from '@/redux/hooks';

import FantasyGroup from '@/components/helpers/FantasyGroup';
import GeneralDetails from '../../Card/GeneralDetails';
import EntriesAndFees from '../../Card/EntriesAndFees';
import DraftSettings from '../../Card/DraftSettings';
import BracketInfo from '../../Card/BracketInfo';
import PayoutInfo from '../../Card/PayoutInfo';

const LeagueManagement = () => {
  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);
  const fantasy_entrys = useAppSelector((state) => state.fantasyGroupReducer.fantasy_entrys);

  const FantasyGroupHelper = new FantasyGroup({ fantasy_group });

  const breakPoint = 700;


  return (
    <div>
      <Typography type = 'h6' style={{ marginBottom: 12 }}>League Management</Typography>
      <Columns numberOfColumns={2} breakPoint = {breakPoint} style = {{ gap: 10 }}>
        <GeneralDetails fantasy_group = {fantasy_group} />
        <EntriesAndFees fantasy_group = {fantasy_group} />
        {
          FantasyGroupHelper.isDraft() ?
            <DraftSettings fantasy_group = {fantasy_group} />
            : ''
        }
        {
          FantasyGroupHelper.isNCAABracket() ?
            <BracketInfo fantasy_group = {fantasy_group} />
            : ''
        }
        {
          fantasy_group.fantasy_payout_rule_id ?
            <PayoutInfo fantasy_group = {fantasy_group} fantasy_entrys = {fantasy_entrys} />
            : ''
          }
      </Columns>
    </div>
  );
};

export default LeagueManagement;
