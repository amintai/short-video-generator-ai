import React, { useState } from "react";

const SelectLanguage = ({ onHandleInputChange = () => {} }) => {
  const languageOptions = [
    { label: "English", code: "en" },
    { label: "Hindi", code: "hi" },
    { label: "Spanish", code: "es" },
    { label: "French", code: "fr" },
    { label: "German", code: "de" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState("");

  const handleLanguageChange = (e) => {
    const selectedCode = e.target.value;
    setSelectedLanguage(selectedCode);
    onHandleInputChange("language", selectedCode);
  };

  return (
    <div className="mt-7">
      <h2 className="font-bold text-xl text-primary">Language</h2>
      <p className="text-gray-500">Select your preferred language</p>
      <select
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className="mt-3 border border-gray-300 rounded-lg p-2 w-full max-w-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="" disabled>
          Select Language
        </option>
        {languageOptions.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectLanguage;
