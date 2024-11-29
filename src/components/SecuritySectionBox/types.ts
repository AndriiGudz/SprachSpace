interface SecurityData {
  email: string
  backupEmail?: string | null
}

export interface SecuritySectionProps {
  data: SecurityData
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onChange: (updatedData: Partial<SecurityData>) => void;
}
