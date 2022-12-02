import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const ParseCsv = () => {
  const [parsedData, setParsedData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [nameSearch, setNameSrerach] = useState("");

  const getDataFromParsedFile = (result) => {
    console.log(result);
    setParsedData(result.data);
    setColumns(result.meta.fields);
  };

  const parseFile = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => getDataFromParsedFile(result),
    });
  };

  const handleOnChange = (e) => {
    const [file] = e.target.files;
    parseFile(file);
  };

  const handleClick = async () => {
    // const response = await fetch("http://localhost:3000/excel/devs.csv");
    // let reader = response.body.getReader();
    // let readResponse = await reader.read();
    // let decoder = new TextDecoder("utf-8");
    // let file = decoder.decode(readResponse.value);
    // parseFile(file);

    Papa.parse("http://localhost:3000/excel/devs.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => getDataFromParsedFile(result),
    });
  };

  useEffect(() => {
    if (parsedData.length > 0) {
      console.log("parsedData ====> ", parsedData);
    }
  }, [parsedData]);
  useEffect(() => {
    if (columns.length > 0) {
      console.log("columns ====> ", columns);
    }
  }, [columns]);

  useEffect(() => {
    if (nameSearch.length > 0) {
      console.log("nameSearch ====> ", nameSearch);
    }
  }, [nameSearch]);

  return (
    <div>
      <h2>ParseCsv</h2>
      <input type="file" accept=".csv" onChange={handleOnChange} />
      <br />

      <button onClick={handleClick}>Test</button>
      <br />

      {parsedData.length > 0 && columns.length > 0 && (
        <>
          {/* Filter */}
          <label htmlFor="filterColumn">
            Selectionnez une colonne à filtrer
          </label>
          <select name="filterColumn" id="filterColumn">
            {columns.map((column, index) => (
              <option key={index} value={column}>
                {column}
              </option>
            ))}
          </select>
          

          {/* Table */}
          <table>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={`col${index}`}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsedData.map((value, indexRow) => (
                <tr key={indexRow}>
                  {columns.map((column, indexCol) => (
                    <th key={`col${indexCol}rox${indexRow}`}>
                      {value[column]}
                    </th>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div>
        <label htmlFor="search">Recherchez un nom</label>
        <input
          type="text"
          name="search"
          id="search"
          onChange={(event) => {
            if (event.target.value === "") {
              setNameSrerach("");
            } else {
              if (parsedData.length > 0) {
                let result = parsedData.filter((row) =>
                  row.nom
                    .toLowerCase()
                    .includes(event.target.value.toLowerCase())
                );
                if (result.length > 0) {
                  setNameSrerach(result[0].nom);
                } else {
                  setNameSrerach("Pas de résultats");
                }
              } else {
                setNameSrerach("Pas de fichier");
              }
            }
          }}
        />
        <br />
        {nameSearch && <p>{nameSearch}</p>}
      </div>
    </div>
  );
};

export default ParseCsv;
