import HomepageBanner from '../../components/HomepageBanner/HomepageBanner'
import HowItWorks from '../../components/HowItWorks/HowItWorks'
import WhySprachSpace from '../../components/WhySprachSpace/WhySprachSpace'
import { PageBox } from './styles'

function Home() {
  return <PageBox>
    <HomepageBanner />
    <WhySprachSpace />
    <HowItWorks />
  </PageBox>
}

export default Home
