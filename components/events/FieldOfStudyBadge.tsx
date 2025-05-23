'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { FieldOfStudyDTO } from '@/types/Event';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
  fieldOfStudy: FieldOfStudyDTO;
};

export default function FieldOfStudyBadge({ fieldOfStudy }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowTooltip(false);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showTooltip]);

  const handleBadgeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent the click event from bubbling up to the document
    setShowTooltip((prev) => !prev);
  };

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip}>
        <TooltipTrigger asChild>
          <Badge data-testid="field-of-study-badge" onClick={handleBadgeClick}>
            {fieldOfStudy.name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent data-testid="tooltip-content">{fieldOfStudy.faculty.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
