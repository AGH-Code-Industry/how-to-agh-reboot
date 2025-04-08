import React from 'react';

function AGHLeaveIndicator() {
  return (
    <div className="pointer-events-none absolute left-0 top-0 box-border size-full border-4 border-errorAlert-foreground">
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-errorAlert-foreground p-3">
        Znajdujesz się poza AGH
      </div>
    </div>
  );
}

export default AGHLeaveIndicator;
