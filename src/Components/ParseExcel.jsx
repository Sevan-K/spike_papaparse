import { event } from "jquery";
import React, { useState, useEffect } from "react";
import { read, utils } from "xlsx";
import excel from "../assets/devs.xlsx";

const ParseExcel = () => {
  const [parsedFile, setParsedFile] = useState(null);
  const [nameSerach, setNameSerach] = useState(null);
  
  const handlefile = async (e) => {
    const [file] = e.target.files;
    const data = await file.arrayBuffer();
    const workbook = read(data);
    console.log("workbook", workbook);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    console.log("worksheet", worksheet);
    setParsedFile(utils.sheet_to_json(worksheet));
  };

  const handleClick = async () => {
    const file = await (
      await fetch("http://localhost:3000/excel/devs.xlsx")
    ).arrayBuffer();
    const workbook = read(file);
    console.log("workbook", workbook);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    console.log("worksheet", worksheet);
    setParsedFile(utils.sheet_to_json(worksheet));
  };

  useEffect(() => {
    console.log(parsedFile);
    if (!!parsedFile) {
      console.log(parsedFile[0].Nom);
    }
  }, [parsedFile]);

  useEffect(() => {
    console.log(nameSerach);
  }, [nameSerach]);

  return (
    <div>
      <h2>ParseExcel</h2>
      <input type="file" onChange={(e) => handlefile(e)} />
      <br />
      <button onClick={handleClick}>Test</button>

      <div>
        <label htmlFor="search">Recherche nom</label>
        <input
          type="text"
          name="search"
          id="search"
          onChange={(event) => {
            if (!!parsedFile) {
              let result = parsedFile.filter((row) =>
                row.Nom.includes(event.target.value)
              );
              if (!!result) {
                setNameSerach(result[0].Nom);
              } else {
                setNameSerach("Pas de résultats");
              }
            } else {
              setNameSerach("Pas de fichier");
            }
          }}
        />
        <br />
        {nameSerach && <p>{nameSerach}</p>}
      </div>
    </div>
  );
};

export default ParseExcel;
