import { Box, TextField, Avatar, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import { PersonalDataSectionProps } from './types';
import dayjs from 'dayjs';
import EditableSection from '../EditableSection/EditableSection';

function PersonalDataBox({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
}: PersonalDataSectionProps) {
  const { t } = useTranslation();

  const isEmpty =
    !data.nickname || !data.name || !data.surname || !data.birthdayDate;

  const avatarSrc = data.avatar ? data.avatar : undefined;

  return (
    <EditableSection
      title={t('personalData.title')}
      isEditing={isEditing}
      isEmpty={isEmpty}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Box position="relative" width="fit-content">
          <Avatar src={avatarSrc} sx={{ width: 100, height: 100, mb: 2 }} />
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
          label={t('personalData.nickname')}
          value={data.nickname}
          onChange={(e) => onChange({ nickname: e.target.value })}
          disabled={!isEditing}
          fullWidth
          className="inputGrey"
        />
        <TextField
          label={t('personalData.name')}
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          disabled={!isEditing}
          fullWidth
          className="inputGrey"
        />
        <TextField
          label={t('personalData.surname')}
          value={data.surname}
          onChange={(e) => onChange({ surname: e.target.value })}
          disabled={!isEditing}
          fullWidth
          className="inputGrey"
        />
        <DatePicker
          label={t('personalData.birthdayDate')}
          value={data.birthdayDate ? dayjs(data.birthdayDate) : null}
          onChange={(date) =>
            onChange({ birthdayDate: date?.toISOString() || null })
          }
          disabled={!isEditing}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: '#EEE', // Цвет фона для инпута
            },
          }}
        />
      </Box>
    </EditableSection>
  );
}

export default PersonalDataBox;