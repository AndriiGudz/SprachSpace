import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { LanguageSectionProps } from './types'
import EditableSection from '../EditableSection/EditableSection'

const AVAILABLE_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Russian',
  'Ukrainian',
  'Chinese',
]

function LanguageSectionBox({
  nativeLanguage,
  learningLanguage,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onNativeLanguageChange,
  onLearningLanguageChange,
}: LanguageSectionProps) {
  const { t } = useTranslation()

  return (
    <EditableSection
      title={t('languageSection.title')}
      isEditing={isEditing}
      isEmpty={!nativeLanguage || !learningLanguage}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="subtitle1">
          {t('languageSection.speakFluently')}
        </Typography>

        <FormControl fullWidth>
          <InputLabel
            sx={{
              color: !isEditing ? 'rgba(0, 0, 0, 0.38)' : '#212121',
              '&.Mui-focused': {
                color: '#01579B',
              },
            }}
          >
            {t('languageSection.language')}
          </InputLabel>
          <Select
            value={nativeLanguage}
            label={t('languageSection.language')}
            onChange={(e) => onNativeLanguageChange(e.target.value)}
            disabled={!isEditing}
            sx={{
              '&.MuiOutlinedInput-root': {
                backgroundColor: '#EEE',
              },
            }}
          >
            {AVAILABLE_LANGUAGES.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="subtitle1">
          {t('languageSection.learning')}
        </Typography>

        <FormControl fullWidth>
          <InputLabel
            sx={{
              color: !isEditing ? 'rgba(0, 0, 0, 0.38)' : '#212121',
              '&.Mui-focused': {
                color: '#01579B',
              },
            }}
          >
            {t('languageSection.language')}
          </InputLabel>
          <Select
            value={learningLanguage}
            label={t('languageSection.language')}
            onChange={(e) => onLearningLanguageChange(e.target.value)}
            disabled={!isEditing}
            sx={{
              '&.MuiOutlinedInput-root': {
                backgroundColor: '#EEE',
              },
            }}
          >
            {AVAILABLE_LANGUAGES.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </EditableSection>
  )
}

export default LanguageSectionBox
