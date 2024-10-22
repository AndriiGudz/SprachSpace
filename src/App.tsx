import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n'; // Импорт i18n для инициализации

function App() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Установка значения title и мета description
    document.title = t('app.title');
    const descriptionMetaTag = document.querySelector('meta[name="description"]');
    if (descriptionMetaTag) {
      descriptionMetaTag.setAttribute('content', t('app.description'));
    }

    // Обновление атрибута lang у <html>
    document.documentElement.setAttribute('lang', i18n.language);

    // Отслеживание изменений языка
    i18n.on('languageChanged', (lng) => {
      document.title = t('app.title');
      if (descriptionMetaTag) {
        descriptionMetaTag.setAttribute('content', t('app.description'));
      }
      document.documentElement.setAttribute('lang', lng);
    });

    // Очистка подписки на событие при размонтировании компонента
    return () => {
      i18n.off('languageChanged');
    };
  }, [t, i18n]); // Обновляем title и description при изменении перевода

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        {/* Остальное приложение */}
      </div>
    </Suspense>
  );
}

export default App;
