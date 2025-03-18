import { useState, useEffect, useMemo } from 'react';
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
  // Хук для переводов (i18n)
  const { t } = useTranslation();
  // Хук для получения функции dispatch для отправки экшенов в Redux
  const dispatch = useDispatch();
  // Получаем данные пользователя из Redux-состояния
  const userData = useSelector((state: RootState) => state.user);

  // Проверяем, что обязательные поля профиля заполнены
  // Если хотя бы одно из этих полей отсутствует, isAnyEmpty будет true
  const isAnyEmpty =
    !userData.name ||
    !userData.surname ||
    !userData.birthdayDate ||
    userData.nativeLanguages.length === 0 ||
    userData.learningLanguages.length === 0;

  // Формируем объект личных данных без языков,
  // который используется для заполнения формы в компоненте PersonalDataBox
  const userPersonalData: PersonalData = {
    nickname: userData.nickname || '',
    name: userData.name || '',
    surname: userData.surname || '',
    birthdayDate: userData.birthdayDate || '',
    avatar: userData.avatar || '',
    // Поля nativeLanguage/learningLanguage убраны, т.к. языки обрабатываются отдельно
  };

  // Состояния для хранения массивов языков (родных и изучаемых)
  const [nativeLanguages, setNativeLanguages] = useState(userData.nativeLanguages || []);
  const [learningLanguages, setLearningLanguages] = useState(userData.learningLanguages || []);

  // Состояние для личных данных, которые редактируются в форме
  const [data, setData] = useState<PersonalData>(userPersonalData);

  // Состояния, отвечающие за режим редактирования каждого блока:
  // - личные данные
  // - языки
  // - безопасность
  const [isEditingPersonalData, setIsEditingPersonalData] = useState(false);
  const [isEditingLanguages, setIsEditingLanguages] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);

  // Исходные данные безопасности (email, резервный email и пароль)
  // Пароль изначально пустой, редактируется отдельно
  const initialSecurityData = {
    email: userData.email || '',
    backupEmail: userData.backupEmail || null,
    password: '',
  };
  // Состояние для данных безопасности
  const [securityData, setSecurityData] = useState(initialSecurityData);

  // useMemo помогает мемоизировать userPersonalData и initialSecurityData, чтобы
  // они не пересоздавались при каждом рендере и не генерировали лишние срабатывания useEffect
  const memoizedUserPersonalData = useMemo(() => userPersonalData, [userData]);
  const memoizedInitialSecurityData = useMemo(() => initialSecurityData, [userData]);

  // useEffect обновляет состояния, когда изменяются данные пользователя
  // Обновляются личные данные, языки и данные безопасности
  useEffect(() => {
    setData(memoizedUserPersonalData);
    setNativeLanguages(userData.nativeLanguages || []);
    setLearningLanguages(userData.learningLanguages || []);
    setSecurityData(memoizedInitialSecurityData);
  }, [userData, memoizedUserPersonalData, memoizedInitialSecurityData]);

  // Функции для включения режима редактирования соответствующих блоков
  const handleEditPersonalData = () => setIsEditingPersonalData(true);
  const handleEditLanguages = () => setIsEditingLanguages(true);
  const handleEditSecurity = () => setIsEditingSecurity(true);

  // Функции для отмены режима редактирования
  const handleCancelPersonalData = () => setIsEditingPersonalData(false);
  const handleCancelLanguages = () => setIsEditingLanguages(false);
  const handleCancelSecurity = () => setIsEditingSecurity(false);

  // Функция для сохранения изменений профиля
  // Выполняется отправка обновлённых данных на сервер через API
  const handleSave = async () => {
    // Форматирование даты рождения в нужный формат (YYYY-MM-DD)
    const formattedBirthdayDate = data.birthdayDate
      ? dayjs(data.birthdayDate).format('YYYY-MM-DD')
      : null;

    // Формирование объекта данных, который будет отправлен на сервер
    const dataToSend = {
      ...data,
      id: userData.id,
      foto: data.avatar,
      nickName: data.nickname,
      birthdayDate: formattedBirthdayDate,
      // Передаются обновлённые массивы языков
      nativeLanguages,
      learningLanguages,
      email: securityData.email,
      backupEmail: securityData.backupEmail,
    };

    try {
      // Отправка PUT-запроса для обновления профиля
      const response = await fetch('http://localhost:8080/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        // Если обновление прошло успешно, получаем обновлённые данные и обновляем Redux
        const updatedUser = await response.json();
        dispatch(updateUser(updatedUser));
        toast.success(t('profile.updatedSuccess'));
      } else {
        // Если произошла ошибка, показываем сообщение об ошибке
        const errorData = await response.json();
        toast.error(errorData.message || (t('profile.updateFailed')));
      }
    } catch (error) {
      // Обработка ошибок сети или других ошибок
      console.error('Error during profile update:', error);
      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        toast.error(t('profile.networkError'));
      } else {
        toast.error(t('profile.unexpectedError'));
      }
    }

    // После сохранения выключаем режим редактирования для всех блоков
    setIsEditingPersonalData(false);
    setIsEditingLanguages(false);
    setIsEditingSecurity(false);
  };

  // Функция для обработки изменений в личных данных формы
  const handleChange = (updatedData: Partial<PersonalData>) => {
    setData((prevData) => ({ ...prevData, ...updatedData }));
  };

  // Обработчики для изменения языков.
  // При выборе нового языка обновляются соответствующие состояния.
  // Функция handleNativeLanguagesChange обновляет массив родных языков
  const handleNativeLanguagesChange = (newLanguages: any) => {
    setNativeLanguages(newLanguages);
  };

  // Функция handleLearningLanguagesChange обновляет массив изучаемых языков
  const handleLearningLanguagesChange = (newLanguages: any) => {
    setLearningLanguages(newLanguages);
  };

  // Обработчик для изменения данных безопасности
  const handleSecurityChange = (updatedData: Partial<typeof securityData>) => {
    setSecurityData((prevData) => ({ ...prevData, ...updatedData }));
  };

  return (
    <PageContainer>
      <>
        {/* Если обязательные поля профиля не заполнены, показываем предупреждение */}
        {isAnyEmpty && (
          <Alert
            severity="error"
            sx={{
              p: 3,
              borderRadius: 1,
              border: 1,
              borderColor: '#B80C0C',
              boxShadow: '0px 0px 24px 0px rgba(184, 12, 12, 0.25)',
            }}
          >
            {t('profile.alert')}
          </Alert>
        )}
        <ProfileContainer>
          <DataBox>
            {/* Компонент для отображения и редактирования личных данных */}
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
            {/* Компонент для отображения и редактирования языков.
                Передаём массивы языков, преобразованные к требуемому формату,
                где поле name является объектом с полями id и name. */}
            <LanguageSectionBox
              nativeLanguages={nativeLanguages}
              learningLanguages={learningLanguages}
              isEditing={isEditingLanguages}
              onEdit={handleEditLanguages}
              onSave={handleSave}
              onCancel={handleCancelLanguages}
              onNativeLanguagesChange={handleNativeLanguagesChange}
              onLearningLanguagesChange={handleLearningLanguagesChange}
            />
            {/* Компонент для отображения и редактирования данных безопасности */}
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
