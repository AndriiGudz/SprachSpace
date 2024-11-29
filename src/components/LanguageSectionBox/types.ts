export interface Language {
    id?: string;
    name: string;
    level?: string;
  }
  
  export interface LanguageSectionProps {
    nativeLanguage: string;
    learningLanguage: string;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onNativeLanguageChange: (newLanguage: string) => void;
    onLearningLanguageChange: (newLanguage: string) => void;
  }