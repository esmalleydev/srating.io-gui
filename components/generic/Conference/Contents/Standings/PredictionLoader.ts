'use client';

import { useClientAPI } from '@/components/clientAPI';
import { setDataKey } from '@/redux/features/conference-slice';
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
      dispatch(setDataKey({ key: 'predictionsLoading', value: true }));

      useClientAPI({
        class: 'conference',
        function: 'getConferencePrediction',
        arguments: {
          organization_id,
          conference_id,
          season,
        },
      }).then((response) => {
        dispatch(setDataKey({ key: 'predictions', value: response }));
        dispatch(setDataKey({ key: 'predictionsLoading', value: false }));
        setLoading(false);
      }).catch((e) => {
        dispatch(setDataKey({ key: 'predictionsLoading', value: false }));
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
  }, [organization_id, conference_id, season]);

  return null;
};

export default PredictionLoader;
