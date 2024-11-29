export interface PersonalData {
  nickname?: string | null
  name: string | null
  surname: string | null
  birthdayDate: string | null
  avatar?: string | null
  nativeLanguage?: string
  learningLanguage?: string
  backupEmail?: string | null
}

export interface PersonalDataSectionProps {
  data: PersonalData
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onChange: (updatedData: Partial<PersonalData>) => void
}
