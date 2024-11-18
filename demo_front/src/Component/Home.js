import BoardList from './Board/BoardList'
import BackGroundColor from './UI/BackGroundColor'

export default function Home() {
  return (
    <BackGroundColor component={<BoardList />} />
  )
}