import { useTranslation } from 'react-i18next'
import { MenuItem, Select, Box, SelectChangeEvent } from '@mui/material'
import './styles.css'

import enFlag from '../../assets/flag/en.png'
import deFlag from '../../assets/flag/de.png'
import ukFlag from '../../assets/flag/ua.png'
import ruFlag from '../../assets/flag/ru.png'

function LanguageSelector() {
  const { i18n } = useTranslation()

  const changeLanguage = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value)
  }

  return (
    <Select
      value={i18n.language}
      onChange={changeLanguage}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: 0,
        border: 'none',
        '& .MuiSelect-select': {
          padding: 0,
        },
        '& .MuiBox-root': {
          padding: 0,
        },
        '& .MuiSelect-icon': {
          display: 'none',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
      }}
    >
      <MenuItem value="en">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={enFlag}
            alt="English"
          />
          En
        </Box>
      </MenuItem>
      <MenuItem value="de">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={deFlag}
            alt="Deutsch"
          />
          De
        </Box>
      </MenuItem>
      <MenuItem value="uk">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={ukFlag}
            alt="Українська"
          />
          Uk
        </Box>
      </MenuItem>
      <MenuItem value="ru">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={ruFlag}
            alt="Русский"
          />
          Ru
        </Box>
      </MenuItem>
    </Select>
  )
}

export default LanguageSelector
