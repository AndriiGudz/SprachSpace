import { Box, TextField, Avatar, IconButton } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import EditIcon from '@mui/icons-material/Edit'
import { PersonalDataSectionProps } from './types'
import dayjs from 'dayjs'
import EditableSection from '../EditableSection/EditableSection'

function PersonalDataBox({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
}: PersonalDataSectionProps) {
  const isEmpty =
    !data.nickname && !data.name && !data.surname && !data.dateOfBirth

  return (
    <EditableSection
      title="Personal data"
      isEditing={isEditing}
      isEmpty={isEmpty}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Box position="relative" width="fit-content">
          <Avatar src={data.avatar} sx={{ width: 100, height: 100, mb: 2 }} />
          {isEditing && (
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                bottom: 16,
                right: -8,
                backgroundColor: 'white',
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <TextField
          label="Nickname"
          value={data.nickname}
          onChange={(e) => onChange({ nickname: e.target.value })}
          disabled={!isEditing}
          fullWidth
        />
        <TextField
          label="Name"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          disabled={!isEditing}
          fullWidth
        />
        <TextField
          label="Surname"
          value={data.surname}
          onChange={(e) => onChange({ surname: e.target.value })}
          disabled={!isEditing}
          fullWidth
        />
        <DatePicker
          label="Date of birth"
          value={data.dateOfBirth ? dayjs(data.dateOfBirth) : null}
          onChange={(date) =>
            onChange({ dateOfBirth: date?.toISOString() || null })
          }
          disabled={!isEditing}
        />
      </Box>
    </EditableSection>
  )
}

export default PersonalDataBox
