// Импортируем LanguageData из общих утилит
import type { LanguageData } from '../../utils/languageUtils'

export type { LanguageData }

export interface LanguageSectionProps {
  nativeLanguages: LanguageData[]
  learningLanguages: LanguageData[]
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onNativeLanguagesChange: (newLanguages: LanguageData[]) => void
  onLearningLanguagesChange: (newLanguages: LanguageData[]) => void
}
