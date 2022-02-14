import { useState } from 'react';

export const useMachineContext = (stateMachine) => {
  const machineContext = stateMachine.getCurrentContext();

  const [props, setProps] = useState(machineContext.get());

  machineContext.onUpdate(setProps);

  return [props];
};
