import styled from '@emotion/styled'

export const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 1200px;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
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

  @media (max-width: 900px) {
    width: 600px;
  }

  @media (max-width: 680px) {
    width: 100%;
    h1 {
      font-size: 32px;
    }
  }
`
