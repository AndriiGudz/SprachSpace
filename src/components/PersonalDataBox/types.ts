export interface PersonalData {
  nickname?: string | null
  name: string | null
  surname: string | null
  birthdayDate: string | null
  foto?: string | null
}

export interface PersonalDataSectionProps {
  data: PersonalData
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onChange: (updatedData: Partial<PersonalData>) => void
}
