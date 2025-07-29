export interface LanguageData {
  id: number
  skillLevel: string
  language: {
    id: number
    name: string
  }
  originalLanguageId?: number // для поиска названия в availableLanguages
}

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
