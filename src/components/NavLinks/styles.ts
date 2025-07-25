import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

export const LinksContainer = styled.nav`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  padding: 0 16px;

  /* @media (max-width: 900px) {
    padding: 16px;
  } */
`

export const NavLink = styled(Link)`
  color: #212121;
  text-decoration: none;
  font-weight: 400;
  font-style: normal;
  line-height: 100%;
  letter-spacing: 0.32px;
  transition: color 0.3s ease;
  font-size: 16px;
  padding: 8px 0;

  /* @media (max-width: 900px) {
    font-size: 18px;
  } */

  &:hover {
    color: #01579b;
    text-decoration: underline;
  }
`
