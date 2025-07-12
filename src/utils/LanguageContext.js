import React, { useState, useEffect, createContext, useContext } from "react";

const LanguageContext = createContext();

const getInitialLanguage = () => {
  const supportedLangs = ["ko", "en", "jp", "vn"];
  const browserLang = navigator.language.split("-")[0];
  if (supportedLangs.includes(browserLang)) {
    return browserLang;
  }
  return "en";
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(
    () => localStorage.getItem("language") || getInitialLanguage()
  );
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    localStorage.setItem("language", lang);
    const fetchTranslations = async () => {
      try {
        // 저장된 번역을 서버에서 불러옵니다
        const response = await fetch(`/api/i18n?lang=${lang}`);
        if (!response.ok) {
          throw new Error("번역 데이터를 불러오는 데 실패했습니다.");
        }
        const data = await response.json();
        setTranslations(data);
      } catch (err) {
        console.error(
          "Failed to fetch translations, falling back to English:",
          err
        );
        setTranslations({
          "home.title": "Gender Test",
          "home.description":
            "Let's find out your type. Please select your gender.",
          "home.male_button": "Male",
          "home.female_button": "Female",
          "home.start_button": "Start Survey",
          "home.gender_select_alert": "Please select a gender.",
          "survey.title": "Survey",
          "survey.description": "Please answer all questions.",
          "survey.loading": "Loading questions...",
          "survey.error": "Error:",
          "survey.not_found": "No questions found.",
          "survey.submit_button": "View Result",
          "survey.submitting": "Submitting...",
          "survey.go_home_button": "Go to Home",
          "result.title": "Your Type Is...",
          "result.explanation_label": "Explanation:",
          "result.advice_label": "Advice:",
          "result.not_found":
            "Could not retrieve results. Please take the survey again.",
          "result.go_home_button": "Retake Survey",
          "result.save_button": "Save Result",
          "result.copy_text": "Copy Text",
          "result.save_image": "Save as Image",
          "result.save_html": "Save as HTML",
          "result.share_button": "Share",
          "result.share_copied": "Link copied to clipboard",
          "app.dark_mode_button": "Dark Mode",
          "app.light_mode_button": "Light Mode",
        });
      }
    };
    fetchTranslations();
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
