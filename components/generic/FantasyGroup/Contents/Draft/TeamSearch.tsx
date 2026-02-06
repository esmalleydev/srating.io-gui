'use client';

import { useClientAPI } from '@/components/clientAPI';
import Inputs from '@/components/helpers/Inputs';
import useDebounce from '@/components/hooks/useDebounce';
import Text from '@/components/utils/Text';
import TextInput from '@/components/ux/input/TextInput';
import Menu, { MenuOption } from '@/components/ux/menu/Menu';
import { FantasyGroup, Team } from '@/types/general';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';


const TeamSearch = (
  {
    inputHandler,
    fantasy_group,
    handleSelect,
  }:
  {
    inputHandler: Inputs;
    fantasy_group: FantasyGroup;
    handleSelect: (team_id: string) => void;
  },
) => {
  const [teamSearchValue, setTeamSearchValue] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [anchorTeam, setAnchorTeam] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [teamMenuOpen, setTeamMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTeamSelect = (team_id) => {
    setAnchorTeam(null);
    setTeamMenuOpen(false);
    handleSelect(team_id);
  };

  const menuOptions: MenuOption[] = teams.map((row) => {
    return {
      value: row.team_id,
      selectable: true,
      label: row.alt_name || row.name,
      onSelect: handleTeamSelect,
    };
  });

  menuOptions.sort((a, b) => {
    if (a.label && b.label) {
      return Text.levenshtein(teamSearchValue, a.label) - Text.levenshtein(teamSearchValue, b.label);
    }
    return 0;
  });

  if (!menuOptions.length && loading && teamSearchValue) {
    menuOptions.push({
      value: null,
      selectable: false,
      disabled: true,
      label: 'Loading...',
      onSelect: handleTeamSelect,
      style: {
        textAlign: 'center',
        opacity: 1,
      },
    });
  }

  if (!menuOptions.length && !loading && teamSearchValue) {
    menuOptions.push({
      value: null,
      selectable: false,
      disabled: true,
      label: 'No results...',
      onSelect: handleTeamSelect,
      style: {
        textAlign: 'center',
        opacity: 1,
      },
    });
  }

  const debouncedRequest = useDebounce(() => {
    setLoading(true);
    useClientAPI({
      class: 'search',
      function: 'search',
      arguments: {
        organization_id: fantasy_group.organization_id,
        division_id: fantasy_group.division_id,
        name: teamSearchValue,
        team: 1,
        player: 0,
        coach: 0,
      },
    }).then((response) => {
      setTeams((response && response.teams) || []);
      setLoading(false);
    }).catch((e) => {
      setTeams([]);
      setLoading(false);
    });
  }, 200);


  return (
    <>
      <TextInput
        inputHandler={inputHandler}
        placeholder='Team search'
        variant='filled'
        clear
        icon = {<SearchIcon />}
        style = {{ borderRadius: 5 }}
        // value = {teamSearchValue}
        onClick={(e) => {
          setAnchorTeam(e.currentTarget);
          if (teamSearchValue.length) {
            setTeamMenuOpen(true);
          }
        }}
        onFocus={(e) => {
          setAnchorTeam(e.currentTarget);
          if (teamSearchValue.length) {
            setTeamMenuOpen(true);
          }
        }}
        onChange={(val) => {
          setTeamSearchValue(val);
          if (!val) {
            setTeams([]);
            setTeamMenuOpen(false);
            handleTeamSelect(null);
          } else {
            setTeamMenuOpen(true);
            setLoading(true);
            debouncedRequest();
          }
        }}
        />
        <Menu
          open = {teamMenuOpen}
          options={menuOptions}
          anchor={anchorTeam}
          onClose={() => {
            setAnchorTeam(null);
            setTeamMenuOpen(false);
          }}
          style = {{ marginTop: 15, width: (anchorTeam?.clientWidth) }}
        />
      </>
  );
};

export default TeamSearch;
