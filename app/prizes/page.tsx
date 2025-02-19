import Reward from "@/components/reward/Reward";

export default function Prizes() {

  const tempNagroda = {
    reward: 'Kubek z Uśmieszkiem',
    requirement: 'Wykonaj 5 zadań rangi średniej lub trudnej.',
    completion: 0.33,
  }

  const tempNagrodaFull = {
    reward: 'Kubek z Uśmieszkiem',
    requirement: 'Wykonaj 5 zadań rangi średniej lub trudnej.',
    completion: 1,
  }

  return (
    <>
      <div>Nagrody</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div><Reward {...tempNagroda}></Reward></div>
        <div><Reward {...tempNagroda}></Reward></div>
        <div><Reward {...tempNagrodaFull}></Reward></div>
      </div>
    </>
  )
}
