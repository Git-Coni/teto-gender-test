import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";
import Home from "./pages/Home";
import Survey from "./pages/Survey";
import Result from "./pages/Result";
import "./styles/App.css";
import { LanguageProvider, useLanguage } from "./utils/LanguageContext";

const AppContent = () => {
  const { lang, setLang, translations } = useLanguage();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleLanguageChange = (e) => {
    setLang(e.target.value);
  };

  return (
    <div className='app-container'>
      <div className='top-right-controls'>
        <button className='theme-toggle-button' onClick={toggleColorMode}>
          {colorMode === "light"
            ? translations["app.dark_mode_button"]
            : translations["app.light_mode_button"]}
        </button>
        <select
          onChange={handleLanguageChange}
          value={lang}
          className='lang-select'
        >
          <option value='ko'>한국어</option>
          <option value='en'>English</option>
          <option value='jp'>日本語</option>
          <option value='vn'>Tiếng Việt</option>
        </select>
      </div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/survey' element={<Survey />} />
        <Route path='/result' element={<Result />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </Router>
  );
};

export default App;
