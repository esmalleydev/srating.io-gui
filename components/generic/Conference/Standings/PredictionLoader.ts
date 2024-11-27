'use client';

import { useClientAPI } from '@/components/clientAPI';
import { setPredictions, setPredictionsLoading } from '@/redux/features/conference-slice';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect, useState } from 'react';

const PredictionLoader = ({ organization_id, conference_id, season }) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [lastOrganizationID, setLastOrganizationID] = useState<string | null>(null);
  const [lastConferenceID, setConferenceID] = useState<string | null>(null);
  const [lastSeason, setLastSeason] = useState(null);

  useEffect(() => {
    const getData = () => {
      if (loading) {
        return;
      }

      if (!organization_id || !conference_id) {
        return;
      }

      setLastSeason(season);
      setLastOrganizationID(organization_id);
      setConferenceID(conference_id);
      setLoading(true);
      dispatch(setPredictionsLoading(true));

      useClientAPI({
        class: 'conference',
        function: 'getConferencePrediction',
        arguments: {
          organization_id,
          conference_id,
          season,
        },
      }).then((response) => {
        dispatch(setPredictions(response));
        dispatch(setPredictionsLoading(false));
        setLoading(false);
      }).catch((e) => {
        dispatch(setPredictionsLoading(false));
        setLoading(false);
      });
    };

    if (
      lastSeason !== season ||
      lastOrganizationID !== organization_id ||
      lastConferenceID !== conference_id
    ) {
      getData();
    }
  }, [lastOrganizationID, lastConferenceID, lastSeason]);

  return null;
};

export default PredictionLoader;
