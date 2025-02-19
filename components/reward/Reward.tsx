import { Progress } from '@/components/ui/progress';
import './Reward.css'

interface RewardProps {
  reward: string;
  requirement: string;
  completion: number;
}

function Reward({ reward, requirement, completion }: RewardProps) {

  const displayInfo = () => {
    if (completion < 1) {
      return <>{requirement}</>
    }
    return <i>Odbiór nagrody w namiocie wrss</i>
  }

  return (
    <>
      <div className="rewardPanelSingle">
        <b>{reward}</b>
        {displayInfo()}
        <div style={{ width: '95%' }}>
          <Progress value={completion * 100}></Progress>
        </div>
      </div>
    </>
  )
}

export default Reward