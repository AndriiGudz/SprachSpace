import CardSlider from '../../components/CardSlider/CardSlider'
import HomepageBanner from '../../components/HomepageBanner/HomepageBanner'
import HowItWorks from '../../components/HowItWorks/HowItWorks'
import WhySprachSpace from '../../components/WhySprachSpace/WhySprachSpace'
import { PageBox } from './styles'

function Home() {
  return (
    <PageBox>
      <HomepageBanner />
    <WhySprachSpace />
    <CardSlider />
    <HowItWorks />
  </PageBox>
  )
}

export default Home

// Необходимо добавить проверку к кнопкам на главной странице. Если пользоватьль авторизован, отправлять его на выбор комнаты, если нет - на страницу авторизации.
