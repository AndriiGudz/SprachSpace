import { useTranslation } from 'react-i18next';
import { LinksContainer, NavLink } from './styles';

function NavLinks() {
  const { t } = useTranslation();

  return (
    <LinksContainer>
      <NavLink to="/meetings">{t('nav.meet')}</NavLink>
      <NavLink to="/about">{t('nav.about')}</NavLink>
    </LinksContainer>
  );
}

export default NavLinks;
