export interface PersonalData {
  nickname: string
  name: string
  surname: string
  dateOfBirth: string | null
  avatar?: string
}

export interface PersonalDataSectionProps {
  data: PersonalData
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onChange: (updatedData: Partial<PersonalData>) => void;
}