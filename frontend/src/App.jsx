import { use, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Main } from "./main.js";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MAP_CONTAINER } from "./components/Elements.js";
import RightPanel from "./components/RightPanel.jsx";
import FloatingLogo from "./components/FloatingLogo.jsx";
import FileViewer from "./components/FileViewer.jsx";
import FileUploader from "./components/FileUploader.jsx";
import Cookies from "js-cookie";
import UserInterface from "./components/UserInferface.jsx";

function App() {
  useEffect(() => {
    Main();
  }, []);

  return (
    <div>
      <div id="map" className="w-screen h-screen"></div>
      <UserInterface />
      <RightPanel />
      <FloatingLogo />
      <FileViewer />
      <FileUploader />
    </div>
  );
}

export default App;
