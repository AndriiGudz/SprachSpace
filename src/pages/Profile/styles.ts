import styled from '@emotion/styled'

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  padding-top: 64px;

  @media (max-width: 900px) {
    padding: 24px;
  }
`

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`

export const DataBox = styled.div`
  display: flex;
  width: 400px;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;

  @media (max-width: 448px) {
    width: 100%;
  }
`
