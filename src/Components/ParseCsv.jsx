import React, { useState, useEffect } from "react";
import Papa from "papaparse";

// https://stats.govt.nz/assets/Uploads/Annual-enterprise-survey/Annual-enterprise-survey-2021-financial-year-provisional/Download-data/annual-enterprise-survey-2021-financial-year-provisional-csv.csv

const ParseCsv = () => {
  const [columnToFilter, setColumnToFilter] = useState("");
  const [parsedData, setParsedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [nameSearch, setNameSrerach] = useState("");
  const [inputFilter, setInputFilter] = useState("");

  const getDataFromParsedFile = (result) => {
    console.log(result);
    setParsedData(result.data);
    setFilteredData(result.data);
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
      setColumnToFilter(columns[0]);
    }
  }, [columns]);

  useEffect(() => {
    if (nameSearch.length > 0) {
      console.log("nameSearch ====> ", nameSearch);
    }
  }, [nameSearch]);

  useEffect(() => {
    if (columnToFilter.length > 0) {
      console.log("columnToFilter ====> ", columnToFilter);
    }
  }, [columnToFilter]);

  useEffect(() => {
    // usefull ?
    if (columnToFilter.length === 0 && columns.length > 0) {
      setColumnToFilter(columns[0]);
    }
    if (
      parsedData.length > 0 &&
      columnToFilter.length > 0 &&
      inputFilter.length > 0
    ) {
      let result = parsedData.filter((row) =>
        row[columnToFilter].toLowerCase().includes(inputFilter.toLowerCase())
      );
      setFilteredData(result);
    }
  }, [columnToFilter, columns, inputFilter, parsedData]);

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
          <select
            name="filterColumn"
            id="filterColumn"
            value={columnToFilter}
            onChange={(event) => setColumnToFilter(event.target.value)}>
            {columns.map((column, index) => (
              <option key={index} value={column}>
                {column}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="filter"
            id="filter"
            onChange={(event) => setInputFilter(event.target.value)}
          />

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
              {filteredData.map((value, indexRow) => (
                <tr key={indexRow}>
                  {columns.map((column, indexCol) => (
                    <td key={`col${indexCol}rox${indexRow}`}>
                      {value[column]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div>
        <label htmlFor="search">Recherchez : {columnToFilter}</label>
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
                  row[columnToFilter]
                    .toLowerCase()
                    .includes(event.target.value.toLowerCase())
                );
                if (result.length > 0) {
                  setNameSrerach(result[0][columnToFilter]);
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
