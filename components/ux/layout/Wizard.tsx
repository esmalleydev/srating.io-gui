'use client';

import Style from '@/components/utils/Style';
import Typography from '../text/Typography';
import Button from '../buttons/Button';
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/hooks/useTheme';

import CheckIcon from '@mui/icons-material/Check';

type Step = {
  title: string;
  id: string;
  isValid: () => boolean;
  onBack?: () => void;
  content: React.JSX.Element;
}


const Wizard = (
  {
    steps,
    validationTrigger,
    onSave,
    onBack,
    saveButtonText = 'Save',
    isLoading,
    style = {},
    // children,
  }:
  {
    steps: Step[];
    validationTrigger: (valid: boolean) => void;
    onSave: () => void;
    onBack?: () => void;
    saveButtonText?: string;
    isLoading?: boolean;
    style?: React.CSSProperties;
    // children: React.ReactNode;
  },
) => {
  const initialStep = 0;
  const theme = useTheme();

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [nextStep, setNextStep] = useState(initialStep);
  const [displaySteps, setDisplaySteps] = useState<[number | null, number]>([null, initialStep]);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const prevStepRef = useRef(currentStep);

  const isLastStep = steps.length - 1 === currentStep;

  const tranistionMS = 500;

  useEffect(() => {
    // Detect step change
    if (prevStepRef.current !== nextStep) {
      const isMovingForward = nextStep > prevStepRef.current;
      setDirection(isMovingForward ? 'forward' : 'backward');
      
      setIsAnimating(true);
      setIsExiting(true);
      

      const timer = setTimeout(() => {
        setIsAnimating(false);
        setCurrentStep(nextStep);
      }, tranistionMS);

      return () => clearTimeout(timer);
    }
  }, [nextStep]);

  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      const isMovingForward = currentStep > prevStepRef.current;
      setDirection(isMovingForward ? 'forward' : 'backward');
      
      setIsAnimating(true);
      setIsEntering(true);
      setIsExiting(false);
      setDisplaySteps([null, currentStep]);
      
      const timer = setTimeout(() => {
        setIsEntering(false);
        setDisplaySteps([prevStepRef.current, currentStep]);
        setIsAnimating(false);
      }, tranistionMS);

      prevStepRef.current = currentStep;
      return () => clearTimeout(timer);
    }
  }, [currentStep, nextStep]);

  const handleNext = () => {
    const currentStepObj = steps[currentStep];

    // Check validity logic defined in step object
    if (currentStepObj.isValid && !currentStepObj.isValid()) {
      validationTrigger(true);
      return; 
    }
    
    // If valid, move on
    if (currentStep < steps.length - 1) {
      validationTrigger(false);
      setNextStep( currentStep + 1)
    } else {
      onSave();
    }
  };

  const handleBack = () => {
    const currentStepObj = steps[currentStep];
  
    if (currentStepObj.onBack) {
      currentStepObj.onBack();
    }

    if (currentStep > 0) {
      setNextStep(prev => prev - 1);
    }

    if (onBack) {
      onBack();
    }
  };

  const getStepIcon = (index: number) => {
    const isCompleted = index < currentStep;
    const isCurrent = index === currentStep;

    if (isCompleted) {
      return (
        <span style = {{ display: 'flex' }}><CheckIcon style = {{ fontSize: 20 }} /></span>
      );
    }
    return (
      <span style={{ 
        color: isCurrent ? 'white' : 'black', 
        fontSize: '12px' 
      }}>
        {index + 1}
      </span>
    );
  };

  // Determine which animation to play
  let animation = 'none';

  if (isAnimating) {
    if (isExiting) {
      // Existing slide moving OUT
      animation = `${direction === 'forward' ? 'slideOutLeft' : 'slideOutRight'} ${tranistionMS}ms`;
    } else if (isEntering) {
      // New slide moving IN
      animation = `${direction === 'forward' ? 'slideInRight' : 'slideInLeft'} ${tranistionMS}ms`;
    }
  }

  const wizardStyle = {
    gridRowStart: 1,
    gridColumnStart: 1,
    width: '100%',
    // transition: `transform ${tranistionMS}ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity ${tranistionMS}ms`,
    animation,
    opacity: isExiting ? 0 : 1,
    // transform: isExiting 
    //   ? `translateX(${direction === 'forward' ? '-100%' : '100%'})` // Exit
    //   : isAnimating 
    //     ? `translateX(0%)` // Target (handled by CSS animation trick usually, but here relies on entering state)
    //     : `translateX(0%)`, 
    // We need an animation for the entering slide to start FROM offscreen
    // animation: isEntering && isAnimating 
    //   ? `${direction === 'forward' ? 'slideInRight' : 'slideInLeft'} ${tranistionMS}ms forwards` 
    //   : 'none',
    pointerEvents: isExiting ? 'none' : 'auto',
    padding: 10,
  };


  const keyframesStyle = {
    '@keyframes slideInRight': {
      'from': { transform: 'translateX(100%)', opacity: 0 },
      'to': { transform: 'translateX(0)', opacity: 1 },
    },
    '@keyframes slideInLeft': {
      'from': { transform: 'translateX(-100%)', opacity: 0 },
      'to': { transform: 'translateX(0)', opacity: 1 },
    },
    '@keyframes slideOutLeft': {
      'from': { transform: 'translateX(0)', opacity: 1 },
      'to': { transform: 'translateX(-100%)', opacity: 0 },
    },
    '@keyframes slideOutRight': {
      'from': { transform: 'translateX(0)', opacity: 1 },
      'to': { transform: 'translateX(100%)', opacity: 0 },
    },
  }

  let display: React.JSX.Element | null = null;

  if (steps.length && steps[currentStep]) {
    const step = steps[currentStep];
    display = (
      <div className = {`${Style.getStyleClassName(wizardStyle)} ${Style.getStyleClassName(keyframesStyle)}`}>
        <Typography type="h5" style={{ marginBottom: 20 }}>{step.title}</Typography>
        {step.content}
        <div style={{ 
          marginTop: 20, 
          display: 'flex', 
          justifyContent: 'space-between', 
        }}>
          <div>
            {currentStep > 0 && (
              <Button 
                title="Back" 
                value = 'back'
                ink
                handleClick={handleBack}
                disabled={isAnimating}
              />
            )}
          </div>
          <div>
            <Button 
              title={isLastStep ? saveButtonText : 'Next'}
              value = 'next'
              handleClick={handleNext} 
              // isLoading={isLoading}
              disabled={isAnimating}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', overflow: 'hidden' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
      }}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;
          const color = theme.mode === 'dark' ? theme.info.dark: theme.info.main;
          const backgroundColor = theme.grey[400];

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isCompleted || isCurrent ? color : backgroundColor,
                border: isCurrent ? `2px solid ${color}` : 'none',
                transition: 'all 0.3s ease',
                flexShrink: 0,
                zIndex: 2,
              }}>
                {getStepIcon(index)}
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div style={{
                  flex: 1,
                  height: 2,
                  backgroundColor: isCompleted ? color : backgroundColor,
                  transition: 'background-color 0.3s ease',
                  margin: '0 -2px', // Slight overlap to prevent gaps
                  zIndex: 1
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
        {display}
      </div>
    </div>
  );
};

export default Wizard;
