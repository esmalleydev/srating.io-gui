'use client';

import { Profiler, useMemo, useState } from 'react';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';
import { useTheme } from '@/components/hooks/useTheme';
import { getNavHeaderHeight } from '../../NavBar';
import Navigation from '@/components/helpers/Navigation';
import TextInput from '@/components/ux/input/TextInput';
import Switch from '@/components/ux/input/Switch';
import Typography from '@/components/ux/text/Typography';
import DateInput from '@/components/ux/input/DateInput';
import Select from '@/components/ux/input/Select';
import { useAppSelector } from '@/redux/hooks';
import Columns from '@/components/ux/layout/Columns';
import MultiPicker, { getTerminologyOptions } from '@/components/ux/input/MultiPicker';
import Wizard from '@/components/ux/layout/Wizard';

/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ padding: 5, maxWidth: 1400, margin: 'auto' }}>
      {children}
    </div>
  );
};


const ClientSkeleton = () => {
  const paddingTop = getNavHeaderHeight();

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 84;
  return (
    <Contents>
      <div style = {{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100vh - ${heightToRemove}px)`,
      }}>
        <LinearProgress color = 'secondary' style={{ width: '50%' }} />
      </div>
    </Contents>
  );
};

const Client = ({ }) => {
  const navigation = new Navigation();
  const theme = useTheme();

  // const player = useAppSelector((state) => state.playerReducer.player);
  const fantasy_payout_rules = useAppSelector((state) => state.dictionaryReducer.fantasy_payout_rule);
  const terminology = useAppSelector((state) => state.dictionaryReducer.terminology);
  // const path = Organization.getPath({ organizations, organization_id });
  // const season = useAppSelector((state) => state.playerReducer.season);
  // const subview = useAppSelector((state) => state.playerReducer.subview);

  const [formData, setFormData] = useState({
    name: '',
    fantasy_payout_rule_id: null,
    fantasy_group_type_terminology_id: null,
    draft_type_terminology_id: null,
    draft_scoring_terminology_id: null,
	  start_date: null,
	  end_date: null,
	  cap: null,
	  entries: null,
	  entries_per_user: 1,
	  free: 1,
	  entry_fee: null,
	  private: 0,
    draft_start_date: null,
	  draft_time_per_user_in_seconds: null,
  });

  const [triggerValidation, setTriggerValidation] = useState(false);


  const payoutOptions = Object.values(fantasy_payout_rules)
    .sort((a, b) => {
      return a.ordinal - b.ordinal;
    })
    .map((r) => {
      return { label: r.name, value: r.fantasy_payout_rule_id };
    });
  
  
  const onChange = (column: string, value: any) => {
    console.log('onChange', column, value)
    setFormData((prev) => ({
      ...prev,
      [column]: value
    }));
  };


  

  const stepBasicInfo = {
    title: 'League setup',
    id: 'basic',
    isValid: () => !!formData.fantasy_group_type_terminology_id && !!formData.name,
    content: (
      <>
        <Typography type = 'body1' style = {{ color: theme.text.secondary }}>Just need a few details about this league...we will guide you through setting it up!</Typography>
        <div style={{ marginBottom: 20, marginTop: 10 }}>
          <MultiPicker
            label='What type of league is this?'
            onChange={(val) => onChange('fantasy_group_type_terminology_id', val)}
            required
            options={getTerminologyOptions('fantasy_group_type')}
            selected={formData.fantasy_group_type_terminology_id ? [formData.fantasy_group_type_terminology_id] : []}
            isRadio
            triggerValidation={triggerValidation}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <Typography type='caption' style={{ color: theme.text.secondary }}>What is the name of the league?</Typography>
          <TextInput
            label='League name'
            onChange={(val) => onChange('name', val)}
            maxLength={255}
            value={formData.name}
            required
            triggerValidation={triggerValidation}
          />
        </div>
      </>
    )
  };

  const stepDraft = {
    title: "Draft Configuration",
    id: 'draft',
    // Logic: If draft type is selected, and if it's the specific draft type that requires date/time, ensure those are filled
    isValid: () => {
      if (!formData.draft_type_terminology_id || !formData.draft_scoring_terminology_id) {
        return false;
      }
      if (formData.draft_type_terminology_id === 'a03bfac9-e11f-11f0-bc34-529c3ffdbb93') {
        return !!formData.draft_start_date && !!formData.draft_time_per_user_in_seconds;
      }
      return true;
    },
    content: (
      <>
        <div style={{ marginBottom: 20 }}>
          <MultiPicker
            label='How will the player draft work?'
            onChange={(val) => onChange('draft_type_terminology_id', val)}
            required
            options={getTerminologyOptions('draft_type')}
            selected={formData.draft_type_terminology_id ? [formData.draft_type_terminology_id] : []}
            isRadio
            triggerValidation={triggerValidation}
          />
          {formData.draft_type_terminology_id && formData.draft_type_terminology_id in terminology ? (
            <Typography type='caption' style={{ color: theme.text.secondary }}>{terminology[formData.draft_type_terminology_id].description}</Typography>
          ) : ''}
        </div>

        {formData.draft_type_terminology_id === 'a03bfac9-e11f-11f0-bc34-529c3ffdbb93' && (
          <div style={{ marginBottom: 20 }}>
            <Columns>
              <div>
                <Typography type='caption' style={{ color: theme.text.secondary }}>When does the draft start?</Typography>
                <DateInput required label='Draft start date' onChange={(val) => onChange('draft_start_date', val)} triggerValidation={triggerValidation} />
              </div>
              <div>
                <Typography type='caption' style={{ color: theme.text.secondary }}>How long does each person have to draft?</Typography>
                <TextInput
                  required
                  label='Draft time (minutes)'
                  onChange={(val) => onChange('draft_time_per_user_in_seconds', (+val * 60))}
                  triggerValidation={triggerValidation}
                  formatter={'number'}
                  min={0.1}
                  max={60 * 5} // todo make this the draft start date - start date / players ?
                />
              </div>
            </Columns>
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <MultiPicker
            label='How will scoring work?'
            onChange={(val) => onChange('draft_scoring_terminology_id', val)}
            required
            options={getTerminologyOptions('draft_scoring')}
            selected={formData.draft_scoring_terminology_id ? [formData.draft_scoring_terminology_id] : []}
            isRadio
            triggerValidation={triggerValidation}
          />
          {formData.draft_scoring_terminology_id && formData.draft_scoring_terminology_id in terminology ? (
            <Typography type='caption' style={{ color: theme.text.secondary, marginTop: 10 }}>{terminology[formData.draft_scoring_terminology_id].description}</Typography>
          ) : ''}
        </div>

        <div style={{ marginBottom: 20 }}>
            <Typography type='caption' style={{ color: theme.text.secondary }}>When does the league start and end?</Typography>
            <Columns>
            <DateInput required label='Start date' onChange={(val) => onChange('start_date', val)} triggerValidation={triggerValidation} />
            <DateInput required label='End date' onChange={(val) => onChange('end_date', val)} triggerValidation={triggerValidation} />
            </Columns>
        </div>
      </>
    )
  };

  const stepSchedule = {
    title: "Participants & Capacity",
    id: 'schedule',
    isValid: () => !!formData.entries_per_user,
    content: (
      <>
        <Typography type='caption' style={{ color: theme.text.secondary }}>Is the group publically available?</Typography>
        <div style={{ maxWidth: 150, marginBottom: 20 }}>
            <Switch
            label="Public"
            labelPlacement='start'
            checked={!formData.private}
            onChange={(val) => onChange('private', !val)}
            />
        </div>

        <div style={{ display: 'flex', marginBottom: 20 }}>
            <Columns breakPoint={575} numberOfColumns={3}>
            <div style={{ alignContent: 'end' }}>
                <Typography type='caption' style={{ color: theme.text.secondary }}>How many people can join?</Typography>
                <TextInput
                label='# of Entries'
                onChange={(val) => onChange('entries', val)}
                formatter='number'
                min={1}
                />
            </div>
            <div style={{ alignContent: 'end' }}>
                <Typography type='caption' style={{ color: theme.text.secondary }}>Total entries allowed?</Typography>
                <TextInput
                label='Max entries in league'
                onChange={(val) => onChange('cap', val)}
                formatter='number'
                min={1}
                />
            </div>
            <div style={{ alignContent: 'end' }}>
                <Typography type='caption' style={{ color: theme.text.secondary }}>Entries per user?</Typography>
                <TextInput
                label='Max entries per user'
                onChange={(val) => onChange('entries_per_user', val)}
                formatter='number'
                value={formData.entries_per_user}
                required
                triggerValidation={triggerValidation}
                />
            </div>
            </Columns>
        </div>
      </>
    )
  };

  const stepFinancials = {
    title: "Fees & Payouts",
    id: 'financials',
    isValid: () => formData.free ? true : (!!formData.entry_fee && !!formData.fantasy_payout_rule_id),
    content: (
        <>
        <Typography type='caption' style={{ color: theme.text.secondary }}>Does the group have an entry fee?</Typography>
        <div style={{ maxWidth: 150, marginBottom: 20 }}>
            <Switch
            label="Entry fee"
            labelPlacement='start'
            checked={!formData.free}
            onChange={(val) => onChange('free', !val)}
            />
        </div>
        {!formData.free && (
            <div style={{ display: 'flex', marginBottom: 20 }}>
            <Columns breakPoint={500}>
                <div>
                <Typography type='caption' style={{ color: theme.text.secondary }}>How much is the entry fee?</Typography>
                <TextInput 
                    label='$ Entry fee' 
                    onChange={(val) => onChange('entry_fee', val)} 
                    required 
                    formatter={'money'} 
                    triggerValidation={triggerValidation} 
                />
                </div>
                <div>
                <Typography type='caption' style={{ color: theme.text.secondary }}>Payout distribution?</Typography>
                <Select
                    label="Payout structure"
                    options={payoutOptions}
                    required
                    value={formData.fantasy_payout_rule_id}
                    onChange={(val) => onChange('fantasy_payout_rule_id', val)}
                    variant="outlined"
                    triggerValidation={triggerValidation}
                />
                </div>
            </Columns>
            </div>
        )}
        </>
    )
  };


  const handleSave = () => {
    console.log(formData);
  }

  // --- Dynamic Step Calculation ---
  // We use useMemo to recalculate the array of steps based on form choices
  const activeSteps = useMemo(() => {
    const steps = [stepBasicInfo];
    
    // Only show Draft step if specific terminology ID is selected
    if (formData.fantasy_group_type_terminology_id === '7ca1ccce-e033-11f0-bc34-529c3ffdbb93') {
      steps.push(stepDraft);
    }
    
    steps.push(stepSchedule);
    steps.push(stepFinancials);
    
    return steps;
  }, [formData.fantasy_group_type_terminology_id, formData.draft_type_terminology_id, formData.free, triggerValidation, formData, theme]);



  return (
    <Profiler id="Fantasy.Contents.Create.Client" onRender={(id, phase, actualDuration) => {
      console.log(id, phase, actualDuration);
    }}>
    <Contents>
      <Wizard 
        steps={activeSteps} 
        validationTrigger = {(valid) => {setTriggerValidation(valid)}}
        onSave={handleSave}
        saveButtonText = 'Create League'
      />
    </Contents>
    </Profiler>
  );
};

export { Client, ClientSkeleton };
