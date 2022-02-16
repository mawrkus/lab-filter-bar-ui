import { useState } from 'react';

export const useStateMachine = (stateMachine) => {
  const machineContext = stateMachine.getContext();

  const [props, setProps] = useState(machineContext.get());

  machineContext.onUpdate(setProps);

  return [props];
};
