'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { X } from 'lucide-react';
import Cookies from 'js-cookie';
import { welcomeSteps } from '@/data/welcomeStepsData';
import { WelcomeStep } from '@/data/welcomeStepsData';
import ImageWithPlaceholder from './ImageWithPlaceholder';
import ScreenOverlay from './ScreenOverlay';
import { ScrollArea } from '@/components/ui/scroll-area';

type WelcomeOverlayProps = {
  forceOpen?: boolean;
  onClose?: () => void;
};

export default function WelcomeOverlay({ forceOpen = false, onClose }: WelcomeOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [currStepId, setCurrStepId] = useState(welcomeSteps[0]?.id ?? 1);
  const cardContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forceOpen) {
      setVisible(true);
    } else if (!Cookies.get('seen_welcome')) {
      setVisible(true);
      Cookies.set('seen_welcome', 'true', { expires: 365 });
    }
  }, [forceOpen]);

  const handleClose = () => {
    setVisible(false);
    setCurrStepId(welcomeSteps[0]?.id ?? 1);
    if (onClose) onClose();
  };

  if (!visible) return null;

  const currentStep = welcomeSteps.find((step: WelcomeStep) => step.id === currStepId);
  const currentIndex = welcomeSteps.findIndex((step: WelcomeStep) => step.id === currStepId);
  const nextStep = welcomeSteps[currentIndex + 1];
  const prevStep = welcomeSteps[currentIndex - 1];

  const changeStep = (stepId: number) => {
    setCurrStepId(stepId);
    cardContent.current?.scrollIntoView(true);
  };

  return (
    <ScreenOverlay>
      <Card className="relative flex size-full flex-col gap-y-4 p-6">
        <CardHeader className="m-0 shrink-0 p-0">
          <div className="flex justify-end">
            <button onClick={handleClose}>
              <X size={24} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="flex grow flex-col items-center justify-center overflow-auto p-1">
          <ScrollArea className="w-full">
            {currentStep && (
              <div
                className="flex flex-col items-center justify-center gap-y-12 text-center"
                ref={cardContent}
              >
                <h2 className="text-2xl font-bold">{currentStep.title}</h2>
                {currentStep?.image && (
                  <ImageWithPlaceholder
                    src={currentStep.image.src}
                    alt="Step image"
                    width={currentStep.image.width}
                    height={currentStep.image.height}
                    className="rounded-lg"
                  />
                )}
                <p className="text-justify">{currentStep.description}</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="m-0 flex w-full shrink-0 flex-col gap-4 p-0">
          <div className="flex justify-center gap-2">
            {welcomeSteps.map((step: WelcomeStep) => (
              <span
                key={step.id}
                className={`size-2 rounded-full ${step.id === currStepId ? 'bg-foreground' : 'bg-muted'}`}
              />
            ))}
          </div>
          <div className="flex w-full justify-between gap-x-4">
            <Button
              disabled={!prevStep}
              onClick={() => changeStep(prevStep?.id ?? currStepId)}
              className="w-1/2"
            >
              Cofnij
            </Button>
            {nextStep ? (
              <Button onClick={() => changeStep(nextStep.id)} className="w-1/2">
                Dalej
              </Button>
            ) : (
              <Button onClick={handleClose} className="w-1/2">
                Zamknij
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </ScreenOverlay>
  );
}
