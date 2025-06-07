import styled from '@emotion/styled'
import { Divider, MenuItem } from '@mui/material'
import { Link } from 'react-router-dom'

export const LinkStyle = styled(Link)`
  color: #212121;
  text-decoration: none;
`

export const UserMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  width: auto;
  padding: 14px 16px;
  border-radius: var(--none, 0px) var(--none, 0px) var(--none, 0px) 4px;
  /* border: var(--none, 1px) solid var(--grey-darken-1, #757575); */
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.2),
    -6px 6px 10px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
`

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;

  p {
    margin: 0;
    color: #757575;
  }
`

export const MenuItemStyled = styled(MenuItem)`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 14px;
  padding: 0;

  &:hover {
    color: #01579b;
    text-decoration: underline;
    background-color: #fff;
  }
`

export const DividerStyled = styled(Divider)`
  width: 100%;
  height: 1px;
  background: var(--divider, rgba(0, 0, 0, 0.12));
`

export const UserNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 900px) {
    gap: 0px;
  }
`

export const MobOnly = styled.div`
  display: none;

  @media (max-width: 900px) {
    width: 100%;
    display: block;
    display: flex;
    flex-direction: column;
  }
`

export const MobLangSel = styled.div`
  display: none;

  @media (max-width: 900px) {
    width: 100%;
    display: block;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
`
