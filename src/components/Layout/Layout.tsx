import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Header from '../Header/Header'
import { LayoutComponent, Main } from './styles'
import { LayoutProps } from './types'

function Layout({ children }: LayoutProps) {
  return (
    <LayoutComponent>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </LayoutComponent>
  )
}

export default Layout
