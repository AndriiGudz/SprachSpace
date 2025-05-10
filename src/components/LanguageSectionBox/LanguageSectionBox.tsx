import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Chip,
  Button,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import EditableSection from '../EditableSection/EditableSection'
import { LanguageData, LanguageSectionProps } from './types'
import { toast } from 'react-toastify'
import { updateUser } from '../../store/redux/userSlice/userSlice'

// Массив допустимых вариантов уровней владения языком
const LEVEL_OPTIONS = ['beginner', 'intermediate', 'advanced', 'default']

function LanguageSectionBox({
  nativeLanguages,
  learningLanguages,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onNativeLanguagesChange,
  onLearningLanguagesChange,
}: LanguageSectionProps) {
  const { t } = useTranslation()

  // Получаем userId из глобального состояния для использования в запросе удаления изучаемого языка
  const userId = useSelector((state: RootState) => state.user.id)

  // Хук для получения функции dispatch для отправки экшенов в Redux
  const dispatch = useDispatch()

  // Локальное состояние для списка доступных языков, загружаемых с сервера
  const [availableLanguages, setAvailableLanguages] = useState<LanguageData[]>(
    []
  )

  useEffect(() => {
    // GET-запрос к API для получения списка языков
    fetch('http://localhost:8080/api/language')
      .then((response) => response.json())
      .then((data) => {
        // Преобразуем данные с сервера в нужную структуру:
        // каждому языку добавляем поле level со значением 'default'
        // Здесь предполагается, что lang.name уже имеет нужную структуру (либо объект, либо строку)
        const languages = data.map((lang: any) => ({
          id: lang.id,
          skillLevel: 'default', // или другое значение по умолчанию
          language: {
            id: lang.id,
            name: lang.name,
          },
        }))
        setAvailableLanguages(languages)
      })
      .catch((error) =>
        console.error('Ошибка при загрузке языков с сервера:', error)
      )
  }, [])

  // Локальные состояния для хранения выбранных идентификаторов новых языков и уровня нового изучаемого языка
  const [newNativeLangId, setNewNativeLangId] = useState<number | ''>('')
  const [newLearningLangId, setNewLearningLangId] = useState<number | ''>('')
  const [newLearningLangLevel, setNewLearningLangLevel] =
    useState<string>('default')

  // Функция для добавления нового родного языка
  const handleAddNativeLanguage = () => {
    // Если значение не выбрано или язык уже добавлен — ничего не делаем
    if (newNativeLangId === '') return
    if (nativeLanguages.find((lang) => lang.id === newNativeLangId)) return
    if (!userId) {
      console.error('User id is not available')
      return
    }

    // Находим выбранный язык в списке доступных языков
    const langObj = availableLanguages.find((l) => l.id === newNativeLangId)
    // Извлекаем название языка. Если langObj.name — объект, обращаемся к его свойству name.
    const languageName = langObj
      ? typeof langObj.language === 'string'
        ? langObj.language
        : langObj.language.name
      : String(newNativeLangId)

    // Готовим тело запроса с идентификатором пользователя и названием языка
    const requestBody = {
      userId: userId,
      languageName: languageName,
    }

    // Отправляем POST-запрос на сервер
    fetch('http://localhost:8080/api/language/addNativeLanguage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Failed to add native language')
      })
      .then((data) => {
        // Предположим, что сервер возвращает успешно добавленный язык.
        // Обновляем локальный список родных языков.
        const newLang: LanguageData = langObj
          ? { ...langObj }
          : {
              id: newNativeLangId,
              skillLevel: 'default',
              language: { id: newNativeLangId, name: languageName },
            }
        const updated = [...nativeLanguages, newLang]
        onNativeLanguagesChange(updated)
        // Обновляем глобальное состояние, чтобы userData.nativeLanguages содержало новый язык
        dispatch(updateUser({ nativeLanguages: updated }))
        // Сбрасываем значение выбора нового языка
        setNewNativeLangId('')
        toast.success(t('languageSection.nativeLanguageAdded'))
      })
      .catch((error) => {
        console.error(t('languageSection.nativeLanguageAddError'), error)
      })
  }

  // Функция для добавления нового изучаемого языка с выбранным уровнем
  const handleAddLearningLanguage = () => {
    if (newLearningLangId === '') return
    if (learningLanguages.find((lang) => lang.id === newLearningLangId)) return
    if (!userId) {
      console.error('User id is not available')
      return
    }

    // Находим выбранный язык в списке доступных языков
    const langObj = availableLanguages.find((l) => l.id === newLearningLangId)
    // Извлекаем название языка, как и ранее
    const languageName = langObj
      ? typeof langObj.language === 'string'
        ? langObj.language
        : langObj.language.name
      : String(newLearningLangId)

    // Готовим тело запроса с дополнительным полем skillLevel для изучаемого языка
    const requestBody = {
      userId: userId,
      languageName: languageName,
      skillLevel: newLearningLangLevel,
    }

    // Отправляем POST-запрос на эндпоинт для добавления изучаемого языка
    fetch('http://localhost:8080/api/language/addLearningLanguage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Failed to add learning language')
      })
      .then((data) => {
        // Обновляем локальный список изучаемых языков.
        const newLang = langObj
          ? { ...langObj, skillLevel: newLearningLangLevel }
          : {
              id: newLearningLangId,
              skillLevel: newLearningLangLevel,
              language: { id: newLearningLangId, name: languageName },
            }
        const updated = [...learningLanguages, newLang]
        onLearningLanguagesChange(updated)
        toast.success(t('languageSection.learningLanguageAdded'))
        setNewLearningLangId('')
        setNewLearningLangLevel('default')
      })
      .catch((error) => {
        console.error(t('languageSection.learningLanguageAddError'), error)
        toast.error(t('languageSection.learningLanguageAddError'))
      })
  }

  // Функция для удаления родного языка с вызовом DELETE-запроса на сервер
  const handleDeleteNativeLanguage = (langId: number) => {
    if (!userId) {
      console.error('User id is not available')
      return
    }
    // Формируем URL с параметрами userId и languagesId
    const url = `http://localhost:8080/api/language/deleteNative?userId=${userId}&languagesId=${langId}`
    // Выполняем DELETE-запрос
    fetch(url, { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          // Если удаление прошло успешно, обновляем список родных языков
          const updated = nativeLanguages.filter(
            (lang) => lang.language.id !== langId
          )
          onNativeLanguagesChange(updated)
          toast.success(t('languageSection.nativeLanguageRemoved'))
        } else {
          console.error(t('languageSection.nativeLanguageRemoveError'))
          toast.error(t('languageSection.nativeLanguageRemoveError'))
        }
      })
      .catch((error) => {
        console.error(t('languageSection.nativeLanguageDeleteError'), error)
        toast.error(t('languageSection.nativeLanguageDeleteError'))
      })
  }

  // Функция для удаления изучаемого языка с вызовом DELETE-запроса на сервер
  const handleDeleteLearningLanguage = (langId: number) => {
    if (!userId) {
      console.error('User id is not available')
      return
    }
    // Формируем URL с параметрами
    const url = `http://localhost:8080/api/language/deleteLearning?userId=${userId}&languagesId=${langId}`
    // Выполняем DELETE-запрос
    fetch(url, { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          // Если удаление прошло успешно, обновляем список изучаемых языков
          const updated = learningLanguages.filter(
            (lang) => lang.language.id !== langId
          )
          onLearningLanguagesChange(updated)
          toast.success(t('languageSection.learningLanguageRemoved'))
        } else {
          console.error(t('languageSection.learningLanguageRemoveError'))
          toast.error(t('languageSection.learningLanguageRemoveError'))
        }
      })
      .catch((error) => {
        console.error(t('languageSection.learningLanguageDeleteError'), error)
        toast.error(t('languageSection.learningLanguageDeleteError'))
      })
  }

  return (
    <EditableSection
      title={t('languageSection.title')}
      isEditing={isEditing}
      // Если оба массива пусты, считаем, что данных нет
      isEmpty={nativeLanguages.length === 0 && learningLanguages.length === 0}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
    >
      {isEditing ? (
        // Режим редактирования
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Блок родных языков */}
          <Typography variant="subtitle1">
            {t('languageSection.speakFluently')}
          </Typography>
          {/* Список добавленных родных языков в виде Chip'ов с кнопками удаления */}
          <Box display="flex" flexWrap="wrap" gap={1}>
            {nativeLanguages.map((lang) => (
              <Chip
                key={lang.id}
                label={lang.language.name}
                onDelete={() => handleDeleteNativeLanguage(lang.language.id)}
                sx={{
                  '& .MuiChip-deleteIcon:hover': {
                    color: 'rgba(211, 47, 47, 1)', // Цвет при наведении
                  },
                }}
              />
            ))}
          </Box>
          {/* Форма для добавления нового родного языка */}
          <Box
            display="flex"
            gap={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <FormControl
              variant="outlined"
              sx={{
                width: '150px',
              }}
            >
              <InputLabel>{t('languageSection.language')}</InputLabel>
              <Select
                variant="outlined"
                value={newNativeLangId}
                label={t('languageSection.language')}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E0E0E0',
                  },
                }}
                onChange={(e) =>
                  setNewNativeLangId(
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
              >
                {/* Выводим только те языки, которые ещё не добавлены */}
                {availableLanguages
                  .filter(
                    (lang) =>
                      !nativeLanguages.some(
                        (nl) => nl.language.id === lang.id
                      ) &&
                      !learningLanguages.some(
                        (ll) => ll.language.id === lang.id
                      )
                  )
                  .map((lang) => (
                    <MenuItem key={lang.id} value={lang.id}>
                      {lang.language.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleAddNativeLanguage}>
              {t('languageSection.add')}
            </Button>
          </Box>

          {/* Блок изучаемых языков */}
          <Typography variant="subtitle1">
            {t('languageSection.learning')}
          </Typography>
          {/* Список изучаемых языков с кнопками удаления и выбором уровня */}
          <Box display="flex" flexWrap="wrap" gap={1}>
            {learningLanguages.map((lang) => (
              <Box key={lang.id} display="flex" alignItems="center" gap={1}>
                <Chip
                  label={lang.language.name + ' - ' + lang.skillLevel}
                  onDelete={() =>
                    handleDeleteLearningLanguage(lang.language.id)
                  }
                  sx={{
                    '& .MuiChip-deleteIcon:hover': {
                      color: 'rgba(211, 47, 47, 1)', // Цвет при наведении
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
          {/* Форма для добавления нового изучаемого языка */}
          <Box
            display="flex"
            gap={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <FormControl
              variant="outlined"
              sx={{
                width: '150px',
              }}
            >
              <InputLabel>{t('languageSection.language')}</InputLabel>
              <Select
                variant="outlined"
                value={newLearningLangId}
                label={t('languageSection.language')}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E0E0E0',
                  },
                }}
                onChange={(e) =>
                  setNewLearningLangId(
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
              >
                {availableLanguages
                  .filter(
                    (lang) =>
                      !nativeLanguages.some(
                        (nl) => nl.language.id === lang.id
                      ) &&
                      !learningLanguages.some(
                        (ll) => ll.language.id === lang.id
                      )
                  )
                  .map((lang) => (
                    <MenuItem key={lang.id} value={lang.id}>
                      {lang.language.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined">
              <InputLabel>{t('languageSection.level')}</InputLabel>
              <Select
                variant="outlined"
                value={newLearningLangLevel}
                label={t('languageSection.level')}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E0E0E0',
                  },
                }}
                onChange={(e) => setNewLearningLangLevel(e.target.value)}
              >
                {LEVEL_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleAddLearningLanguage}>
              {t('languageSection.add')}
            </Button>
          </Box>
        </Box>
      ) : (
        // Режим просмотра (не редактирования)
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="subtitle1">
            {t('languageSection.speakFluently')}
          </Typography>
          {nativeLanguages.length > 0 ? (
            nativeLanguages.map((lang) => (
              <Typography
                key={lang.id}
                variant="body1"
                sx={{ color: '#757575' }}
              >
                {lang.language.name}
              </Typography>
            ))
          ) : (
            <Typography variant="body1" sx={{ color: '#757575' }}>
              {t('languageSection.noLanguageSelected')}
            </Typography>
          )}
          <Typography variant="subtitle1">
            {t('languageSection.learning')}
          </Typography>
          {learningLanguages.length > 0 ? (
            learningLanguages.map((lang) => (
              <Typography
                key={lang.id}
                variant="body1"
                sx={{ color: '#757575' }}
              >
                {lang.language.name} - {lang.skillLevel}
              </Typography>
            ))
          ) : (
            <Typography variant="body1" sx={{ color: '#757575' }}>
              {t('languageSection.noLanguageSelected')}
            </Typography>
          )}
        </Box>
      )}
    </EditableSection>
  )
}

export default LanguageSectionBox
