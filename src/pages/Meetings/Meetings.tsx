import MeetingCards from "../../components/MeetingCard/MeetingCards"
import { MeetingsBox } from "./styles"

function Meetings() {
  return (
    <MeetingsBox>
      <h2>Meetings</h2>
      <h4>Join scheduled meetings or create your own room</h4>
        <MeetingCards />
    </MeetingsBox>
    
  )
}

export default Meetings
