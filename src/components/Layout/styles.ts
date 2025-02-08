import styled from "@emotion/styled";

export const LayoutComponent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
`

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  width: 100%;
  background: var(--light-blue-lighten-5, #E1F5FE);
  
  padding-top: 90px;

  @media (max-width: 900px) {
    padding-top: 60px;
  }
`