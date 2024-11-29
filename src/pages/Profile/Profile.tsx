import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { updateUser } from '../../store/redux/userSlice/userSlice';
import PersonalDataBox from '../../components/PersonalDataBox/PersonalDataBox';
import LanguageSectionBox from '../../components/LanguageSectionBox/LanguageSectionBox';
import SecuritySectionBox from '../../components/SecuritySectionBox/SecuritySectionBox';
import { PersonalData } from '../../components/PersonalDataBox/types';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { DataBox, PageContainer, ProfileContainer } from './styles';
import { Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

function Profile() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user);

  // Проверка на пустое значение хотя бы одного из полей
  const isAnyEmpty =
    !userData.name ||
    !userData.surname ||
    !userData.birthdayDate ||
    !userData.nativeLanguage ||
    !userData.learningLanguage;

  const userPersonalData: PersonalData = {
    nickname: userData.nickname || '',
    name: userData.name || '',
    surname: userData.surname || '',
    birthdayDate: userData.birthdayDate || '',
    avatar: userData.avatar || '',
    nativeLanguage: userData.nativeLanguage || '',
    learningLanguage: userData.learningLanguage || '',
  };

  // Состояние для языков
  const [nativeLanguage, setNativeLanguage] = useState(
    userData.nativeLanguage || ''
  );
  const [learningLanguage, setLearningLanguage] = useState(
    userData.learningLanguage || ''
  );

  // Состояние для личных данных
  const [data, setData] = useState<PersonalData>(userPersonalData);

  // Состояние для редактирования
  const [isEditingPersonalData, setIsEditingPersonalData] = useState(false);
  const [isEditingLanguages, setIsEditingLanguages] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);

  // Состояние для данных безопасности
  const initialSecurityData = {
    email: userData.email || '',
    backupEmail: userData.backupEmail || null,
    password: '', // Пароль, возможно, будет редактироваться отдельно
  };
  const [securityData, setSecurityData] = useState(initialSecurityData);

  useEffect(() => {
    setData(userPersonalData);
    setNativeLanguage(userData.nativeLanguage || '');
    setLearningLanguage(userData.learningLanguage || '');
    setSecurityData(initialSecurityData);
  }, [userData]);

  // Функции редактирования
  const handleEditPersonalData = () => setIsEditingPersonalData(true);
  const handleEditLanguages = () => setIsEditingLanguages(true);
  const handleEditSecurity = () => setIsEditingSecurity(true);

  // Функции отмены редактирования
  const handleCancelPersonalData = () => setIsEditingPersonalData(false);
  const handleCancelLanguages = () => setIsEditingLanguages(false);
  const handleCancelSecurity = () => setIsEditingSecurity(false);

  const handleSave = async () => {
    const formattedBirthdayDate = data.birthdayDate
      ? dayjs(data.birthdayDate).format('YYYY-MM-DD')
      : null;

    const dataToSend = {
      ...data,
      id: userData.id,
      foto: data.avatar,
      nickName: data.nickname,
      birthdayDate: formattedBirthdayDate,
      nativeLanguage,
      learningLanguage,
      email: securityData.email,
      backupEmail: securityData.backupEmail,
    };

    delete dataToSend.nickname;

    try {
      const response = await fetch('http://localhost:8080/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        dispatch(updateUser(updatedUser));
        toast.success('Profile updated successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error during profile update:', error);
      if (
        error instanceof TypeError &&
        error.message.includes('NetworkError')
      ) {
        toast.error('Network error occurred. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred');
      }
    }

    setIsEditingPersonalData(false);
    setIsEditingLanguages(false);
    setIsEditingSecurity(false);
  };

  const handleChange = (updatedData: Partial<PersonalData>) => {
    setData((prevData) => ({ ...prevData, ...updatedData }));
  };

  const handleNativeLanguageChange = (newLanguage: string) => {
    setNativeLanguage(newLanguage);
  };

  const handleLearningLanguageChange = (newLanguage: string) => {
    setLearningLanguage(newLanguage);
  };

  const handleSecurityChange = (updatedData: Partial<typeof securityData>) => {
    setSecurityData((prevData) => ({ ...prevData, ...updatedData }));
  };

  return (
    <PageContainer>
      <>
        {isAnyEmpty && (
          <Alert
            severity="error"
            sx={{ p: 3, borderRadius: 1, border: 1, borderColor: '#B80C0C', boxShadow: '0px 0px 24px 0px rgba(184, 12, 12, 0.25)' }}
          >
            {t('profile.alert')}
          </Alert>
        )}
        <ProfileContainer>
          <DataBox>
            <PersonalDataBox
              data={data}
              isEditing={isEditingPersonalData}
              onEdit={handleEditPersonalData}
              onSave={handleSave}
              onCancel={handleCancelPersonalData}
              onChange={handleChange}
            />
          </DataBox>
          <DataBox>
            <LanguageSectionBox
              nativeLanguage={nativeLanguage}
              learningLanguage={learningLanguage}
              isEditing={isEditingLanguages}
              onEdit={handleEditLanguages}
              onSave={handleSave}
              onCancel={handleCancelLanguages}
              onNativeLanguageChange={handleNativeLanguageChange}
              onLearningLanguageChange={handleLearningLanguageChange}
            />
            <SecuritySectionBox
              data={securityData}
              isEditing={isEditingSecurity}
              onEdit={handleEditSecurity}
              onSave={handleSave}
              onCancel={handleCancelSecurity}
              onChange={handleSecurityChange}
            />
          </DataBox>
        </ProfileContainer>
      </>
    </PageContainer>
  );
}

export default Profile;
