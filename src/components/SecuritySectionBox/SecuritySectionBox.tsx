import { Box, TextField, Button } from '@mui/material';
import { SecuritySectionProps } from './types';
import EditableSection from '../EditableSection/EditableSection';
import { useTranslation } from 'react-i18next';

function SecuritySectionBox({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
}: SecuritySectionProps) {
  const { t } = useTranslation();
  const isEmpty = !data.email;

  return (
    <EditableSection
      title={t('securitySection.title')}
      isEditing={isEditing}
      isEmpty={isEmpty}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label={t('securitySection.emailLabel')}
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          disabled
          fullWidth
          className="inputGrey"
        />

        {data.backupEmail && (
          <TextField
            label={t('securitySection.backupEmailLabel')}
            type="email"
            value={data.backupEmail}
            onChange={(e) => onChange({ backupEmail: e.target.value })}
            disabled={!isEditing}
            fullWidth
            className="inputGrey"
          />
        )}

        {isEditing && !data.backupEmail && (
          <Button
            variant="text"
            onClick={() => onChange({ backupEmail: '' })}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('securitySection.addBackupEmail')}
          </Button>
        )}

        {/* Кнопка для изменения пароля */}
        {!isEditing && (
          <Button
            variant="text"
            onClick={() => {
              // Заглушка для изменения пароля
              console.log('Change password action triggered');
            }}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('securitySection.changePassword')}
          </Button>
        )}
      </Box>
    </EditableSection>
  );
}

export default SecuritySectionBox;