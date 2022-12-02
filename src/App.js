import "./App.css";
import Home from "./Components/Home";
import ParseExcel from "./Components/ParseExcel";
import { Routes, Route } from "react-router-dom";
import ParseCsv from "./Components/ParseCsv";

function App() {
  return (
    // <Routes>
    //   <Route path="/" element={<Home />} />
    //   <Route path="/parse-excel" element={<ParseExcel />} />
    // </Routes>
    <>
      {/* <ParseExcel /> */}
      <ParseCsv />
    </>
  );
}

export default App;
