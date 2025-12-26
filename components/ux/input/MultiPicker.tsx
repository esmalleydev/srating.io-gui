
'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Columns from '../layout/Columns';
import Typography from '../text/Typography';
import Paper from '../container/Paper';
import { getStore } from '@/app/StoreProvider';
import { FocusEvent, useEffect, useState } from 'react';

export type MultiPickerOption = {
  label: string;
  value: string | number;
};


interface MultiPickerProps {
  options: MultiPickerOption[];
  selected: (string | number)[];
  label?: string;
  onChange?: (value: (string | number)[] | string | number | null) => void;
  style?: React.CSSProperties;
  isRadio?: boolean;
  required?: boolean;
  error?: boolean; // External error control
  errorMessage?: string; // External error message
  triggerValidation?: boolean;
}

export const getTerminologyOptions = (type: string) => {
  const store = getStore();

  const terminologies = store.getState().dictionaryReducer.terminology || {};

  const options: MultiPickerOption[] = [];

  for (const terminology_id in terminologies) {
    const row = terminologies[terminology_id];

    if (row.inactive) {
      continue;
    }

    if (row.type === type) {
      options.push({
        label: row.name,
        value: row.terminology_id,
      });
    }
  }

  return options;
};
const MultiPicker = ({
  label,
  options,
  selected,
  onChange,
  isRadio = false,
  required = false,
  error: externalError = false,
  errorMessage = 'Selection is required',
  style,
  triggerValidation = false,
}: MultiPickerProps) => {
  const theme = useTheme();

  // Initialize state, but keep it synced with props
  const [internalSelected, setInternalSelected] = useState<(string | number)[]>(selected || []);
  const [isTouched, setIsTouched] = useState(false);

  // Effect to sync internal state if parent props change
  useEffect(() => {
    if (Array.isArray(selected)) {
      setInternalSelected(selected);
    }
  }, [selected]);


  const showError = externalError || (required && (isTouched || triggerValidation) && internalSelected.length === 0);

  const handleSelection = (value: string | number) => {
    let newSelection: (string | number)[] = [];

    if (isRadio) {
      if (internalSelected.includes(value)) {
        newSelection = [];
      } else {
        newSelection = [value];
      }
    } else {
      // Logic: Multi-select toggle
      if (internalSelected.includes(value)) {
        // Remove item (Immutable way)
        newSelection = internalSelected.filter((item) => item !== value);
      } else {
        // Add item (Immutable way)
        newSelection = [...internalSelected, value];
      }
    }

    // Update Internal State
    setInternalSelected(newSelection);

    // Trigger external onChange
    if (onChange) {
      // If radio, usually parents expect a single value, if multi, an array.
      // We pass the structure based on the mode.
      onChange(isRadio ? newSelection[0] || null : newSelection);
    }
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsTouched(true);
    }
  };

  const handleOptionClick = (e: React.SyntheticEvent, value: string | number) => {
    e.preventDefault();
    handleSelection(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, value: string | number) => {
    // 'Enter' or ' ' (Spacebar) are standard for activating buttons
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevent scrolling when pressing Space
      handleSelection(value);
    }
  };

  const getOptionContainer = (option: MultiPickerOption) => {
    const isSelected = internalSelected.includes(option.value);

    // Dynamic Styles
    const paperStyle: React.CSSProperties = {
      textAlign: 'center',
      padding: '8px 16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
      ...style
    };

    // Styling logic for Selection
    if (isSelected) {
      paperStyle.backgroundColor = theme.blue[500];
    }

    // Styling logic for Error (Overrides default border, but maybe not selection fill)
    if (showError && !isSelected) {
      paperStyle.color = theme.error.main;
    }

    return (
      <Paper
        key={option.value} // Always need a key for map
        hover
        style={paperStyle}
        tabIndex={0} // Allows the element to be focused via Tab
        onClick={(e) => handleOptionClick(e, option.value)}
        onKeyDown={(e) => handleKeyDown(e, option.value)}
      >
        <Typography type="body1" style={{ color: 'inherit' }}>
           {option.label}
        </Typography>
      </Paper>
    );
  };

  return (
    <div
      onBlur={handleBlur}
    >
      {/* Label with Required Asterisk */}
      {label && (
        <Typography type="caption" style={{ color: showError ? theme.error.main : theme.text.secondary }}>
          {label} {/*required && <span style={{ color: showError ? theme.error.main : theme.text.secondary }}>*</span>*/}
        </Typography>
      )}

      {/* Option Containers */}
      <Columns style = {{ gap: 10 }}> 
        {options.map((option) => getOptionContainer(option))}
      </Columns>

      {/* Error Message -- keep space so screen does not bounce */}
      <div style={{ height: 20, marginTop: 4 }}>
        {showError && errorMessage && (
          <Typography type="caption" style={{ color: theme.error.main }}>
            {errorMessage}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default MultiPicker;

