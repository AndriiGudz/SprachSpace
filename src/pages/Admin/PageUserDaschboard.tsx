import { useParams } from 'react-router-dom'
import UserDashboard from '../../components/UserDaschboard/UserDashboard'

function PageUserDaschboard() {
  const { userId } = useParams()

  return <UserDashboard userId={userId} />
}

export default PageUserDaschboard
