
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
    { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' }
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode: string) => {
    const selectedLang = languages.find(lang => lang.code === languageCode);
    if (selectedLang) {
      i18n.changeLanguage(languageCode);
      
      // Update document direction for RTL support
      document.documentElement.dir = selectedLang.dir;
      document.documentElement.lang = languageCode;
      
      // Update body class for RTL styling
      if (selectedLang.dir === 'rtl') {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
    }
  };

  useEffect(() => {
    // Set initial direction and language
    const initialLang = languages.find(lang => lang.code === i18n.language) || languages[0];
    document.documentElement.dir = initialLang.dir;
    document.documentElement.lang = i18n.language;
    
    if (initialLang.dir === 'rtl') {
      document.body.classList.add('rtl');
    }
  }, [i18n.language]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">{currentLang.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white dark:bg-gray-800 border shadow-lg z-50"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`cursor-pointer ${i18n.language === lang.code ? 'bg-restaurant-orange/10' : ''}`}
            role="menuitem"
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
