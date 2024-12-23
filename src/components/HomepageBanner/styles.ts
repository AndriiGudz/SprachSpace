import styled from '@emotion/styled'
import bannerImage from '../../assets/hp-banner.webp'

export const BannerBox = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 700px;
  background-image: url(${bannerImage});
  background-size: cover;
  background-position: center;
`

export const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 1200px;
  padding-bottom: 20px
`

export const BannerContent = styled.div`
  display: flex;
  width: 800px;
  padding: 32px;
  flex-direction: column;
  align-items: flex-start;
  gap: 42px;

  border-radius: 4px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 16px 0px rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px);

  h1 {
    margin: 0;
  }

  p {
    margin: 0;
  }
`
