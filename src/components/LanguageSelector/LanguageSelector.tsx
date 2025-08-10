import { useTranslation } from 'react-i18next'
import { MenuItem, Select, Box, SelectChangeEvent } from '@mui/material'
import './styles.css'

import enFlag from '../../assets/flag/en.png'
import deFlag from '../../assets/flag/de.png'
import ukFlag from '../../assets/flag/ua.png'
import ruFlag from '../../assets/flag/ru.png'

const flagMap: Record<string, { src: string; alt: string }> = {
  en: { src: enFlag, alt: 'English' },
  de: { src: deFlag, alt: 'Deutsch' },
  uk: { src: ukFlag, alt: 'Українська' },
  ru: { src: ruFlag, alt: 'Русский' },
}

function LanguageSelector() {
  const { i18n } = useTranslation()

  const changeLanguage = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value)
  }

  const renderValue = (selected: unknown) => {
    const lang = selected as string
    const flag = flagMap[lang] || flagMap['en'] // Используем английский как fallback

    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={flag.src}
          alt={flag.alt}
          className="language-selector-flag"
          loading="lazy"
        />
      </Box>
    )
  }

  return (
    <Select
      value={i18n.language}
      onChange={changeLanguage}
      variant="standard"
      renderValue={renderValue}
      sx={{
        minWidth: 'auto',
        '& .MuiSelect-select': {
          padding: '4px',
          paddingRight: '24px !important',
        },
        '&:before': {
          display: 'none',
        },
        '&:after': {
          display: 'none',
        },
        '& .MuiSelect-icon': {
          color: '#01579b',
        },
      }}
    >
      <MenuItem value="en">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src={enFlag}
            alt="English"
            className="language-selector-flag"
            loading="lazy"
          />
          <span className="language-title">English</span>
        </Box>
      </MenuItem>
      <MenuItem value="de">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src={deFlag}
            alt="Deutsch"
            className="language-selector-flag"
            loading="lazy"
          />
          <span className="language-title">Deutsch</span>
        </Box>
      </MenuItem>
      <MenuItem value="uk">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src={ukFlag}
            alt="Українська"
            className="language-selector-flag"
            loading="lazy"
          />
          <span className="language-title">Українська</span>
        </Box>
      </MenuItem>
      <MenuItem value="ru">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src={ruFlag}
            alt="Русский"
            className="language-selector-flag"
            loading="lazy"
          />
          <span className="language-title">Русский</span>
        </Box>
      </MenuItem>
    </Select>
  )
}

export default LanguageSelector
