import React from 'react';

function AGHLeaveIndicator() {
  return (
    <div className="pointer-events-none absolute left-0 top-0 box-border size-full border-4 border-errorAlert-foreground">
      <div className="absolute bottom-3 left-1/2 w-max max-w-[80%] -translate-x-1/2 rounded-md bg-errorAlert-foreground p-3 text-center">
        Znajdujesz się poza obszarem Dni Otwartych AGH na WEAIiIB
      </div>
    </div>
  );
}

export default AGHLeaveIndicator;
