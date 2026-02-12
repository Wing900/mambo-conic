import { Blackboard } from '../Blackboard/Blackboard';

interface BlackboardAreaProps {
  blackboard?: any;
}

export function BlackboardArea({ blackboard }: BlackboardAreaProps) {
  const isLab = blackboard?.type === 'lab';

  return (
    <div className={`flex-1 sketch-border paper-texture rounded-lg ${
      isLab ? 'min-h-[400px] p-2' : 'min-h-[300px] p-3'
    }`}>
      <Blackboard content={blackboard} />
    </div>
  );
}
