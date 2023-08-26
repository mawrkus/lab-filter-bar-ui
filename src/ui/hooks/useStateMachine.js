import { useEffect, useState } from 'react';

export const useStateMachine = (stateMachine) => {
  const machineContext = stateMachine.getContext();
  const [props, setProps] = useState(machineContext.get());

  useEffect(() => {
    setProps(machineContext.get());
    machineContext.onUpdate(setProps);
  }, [machineContext]);

  return [props];
};
