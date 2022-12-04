import { createContext, useContext, useState } from "react";

const Context = createContext();

const ImageProvider = ({ children }) => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleResetImage = () => {
    setImage(null);
  };

  const handleReset = () => {
    setImage(null);
    setPrediction(null);
  };

  return (
    <Context.Provider value={{ image, setImage, prediction, setPrediction, handleReset, handleResetImage }}>
      {children}
    </Context.Provider>
  );
};

const useImage = () => useContext(Context);

export { ImageProvider, useImage };
