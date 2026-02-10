'use client';

import Navigation from '@/components/helpers/Navigation';
import Button from '@/components/ux/buttons/Button';
import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import AccountHandler from '@/components/generic/AccountHandler';
import Wizard, { WizardStep } from '@/components/ux/layout/Wizard';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';

const CreateGroup = () => {
  const theme = useTheme();
  const navigation = new Navigation();
  const session_id = useAppSelector((state) => state.userReducer.session_id);
  const [showModal, setShowModal] = useState(false);

  const handleCreate = () => {
    setShowModal(false);
    navigation.fantasyView({ view: 'create' });
  };

  const steps: WizardStep[] = [];

  const stepOne = {
    title: 'Welcome!',
    id: 'welcome',
    isValid: () => {
      return true;
    },
    content: (
      <>
        <Typography type = 'body1' style = {{ color: theme.text.secondary }}>Here you can become a fantasy league manager. Create your own free or paid league for NCAA tournamanet brackets or draft players to a team. Below are open groups that anyone can join!</Typography>
      </>
    ),
  };

  const stepTwo = {
    title: 'Leagues made easy',
    id: 'easy',
    isValid: () => {
      return true;
    },
    content: (
      <>
        <Typography type = 'body1' style = {{ color: theme.text.secondary }}>We made is super easy to configure, manage and participate is fantasy leagues. You can invite all your friends, make public or private groups, automatically handle rankings and payouts!</Typography>
        <Typography type = 'body1' style = {{ color: theme.text.secondary, marginTop: 10 }}>Try creating a league for free today!</Typography>
      </>
    ),
  };

  steps.push(stepOne);
  steps.push(stepTwo);


  return (
    <>
      <Wizard
        steps={steps}
        useArrowButton
      />
      <div style = {{ margin: 'auto', textAlign: 'center' }}>
        <Button title = 'Create fantasy league' value = 'create' handleClick = {() => {
          if (!session_id) {
            setShowModal(true);
            return;
          }
          handleCreate();
        }} />
      </div>
      <AccountHandler open = {showModal} closeHandler={() => setShowModal(false)} loginCallback={handleCreate} title='Account required to create a fantasy group' />
    </>
  );
};

export default CreateGroup;
