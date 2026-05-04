'use client';

import Paper from '@/components/ux/container/Paper';
import { useKontororu } from '@/components/ux/hooks/useKontororu';
import Inputs from '@/components/ux/input/Inputs';
import TextInput from '@/components/ux/input/TextInput';
import Columns from '@/components/ux/layout/Columns';
import Wizard, { WizardStep } from '@/components/ux/layout/Wizard';
import Typography from '@/components/ux/text/Typography';
import { useState } from 'react';


export default function Page() {
  const Kontororu = useKontororu();
  const stepOneInputHandler = new Inputs();
  const steps: WizardStep[] = [];

  const initialFormData = Object.freeze({
    question_one: '',
    question_two: '',
  });
  type FormData = {
    question_one: string;
    question_two: string;
  }

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [triggerValidation, setTriggerValidation] = useState(false);
  const onChange = <K extends keyof FormData>(column: K, value: FormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const stepOne = {
    title: 'Step 1 title',
    id: 'step_1',
    isValid: () => {
      const errors = stepOneInputHandler.getErrors();

      if (errors.length) {
        return false;
      }

      // put any other custom error handling here
      return true;
    },
    content: (
      <>
        <Columns>
          <TextInput
            inputHandler={stepOneInputHandler}
            placeholder='Example question 1'
            required
            value = {formData.question_one}
            onChange={(val) => onChange('question_one', val as string)}
            triggerValidation = {triggerValidation}
            />
          <TextInput
            inputHandler={stepOneInputHandler}
            placeholder='Example question 2'
            value = {formData.question_two}
            onChange={(val) => onChange('question_two', val as string)}
            triggerValidation = {triggerValidation}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                Kontororu.dispatchEvent(new CustomEvent('next'));
              }
            }}
          />

        </Columns>
      </>
    ),
  };

  const stepTwo = {
    title: 'Step 2',
    id: 'easy',
    isValid: () => {
      return true;
    },
    content: (
      <>
      <Paper style = {{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography type = 'body1'>You made it to the end of the wizard!</Typography>
      </Paper>
      </>
    ),
  };

  steps.push(stepOne);
  steps.push(stepTwo);

  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Wizard</Typography>
      <Typography type = 'body1' style={{ marginBottom: 10 }}>The wizard component can be used to create a step by step guide that checks validation after each step. It will transition through each step and handles the back and next buttons, which can also be customized.</Typography>
      <Wizard
        steps={steps}
        validationTrigger={setTriggerValidation}
      />

    </div>
  );
}
