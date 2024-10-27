import { useTranslation } from 'react-i18next';
import { ReactComponent as Logo } from '../../assets/Logo-sprachspace.svg';
import ButtonSign from '../ButtonSign/ButtonSign';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { HeaderBox } from './styles';
import NavLinks from '../NavLinks/NavLinks';

function Header() {
    const { t, i18n } = useTranslation()
    
  return (
    <HeaderBox>
      <Logo width="252" height="70" />
      <NavLinks />
      <ButtonSign text={t('header.signIn')} />
      <LanguageSelector />
    </HeaderBox>
  )
}

export default Header
