import React, { useState } from "react";
import logo from "./images/gitstart-brand.svg";
import { useHandleCsv } from "./hooks";
import { CSVParsedDataType } from "./hooks/useHandleCsv";
import { BarChart } from "./BarChart";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [nonStackColumnNames, setNonStackColumnNames] = useState<string>("Submission ID,Respondent ID,Submitted at,Role,Languages/Stack you are familiar with  (not necessarily an expert at) ,Email (Gitstart mail)");
  const [emailColumnName, setEmailColumnName] = useState<string>();
  const [languageData, setLanguageData] = useState<CSVParsedDataType>();
  const [error, setError] = useState<string>("");
  const { parseCsv, getColumnNames } = useHandleCsv();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      const names = await getColumnNames(files[0]);
      setEmailColumnName(() =>
        names?.find((name) => name.toLowerCase().includes("email"))
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (selectedFile) {
      try {
        const stackData = await parseCsv(emailColumnName || "", nonStackColumnNames);
        setLanguageData(stackData);
      } catch (error: any) {
        throw Error(error);
      }
    }
  };

  return (
    <div className="App">
      <header className="p-8 border-b">
        <img src={logo} className="" alt="logo" />
      </header>

      <main className="p-8">
        <h1 className="font-semibold text-2xl md:text-3xl">Tech Stack Audit</h1>

        <form
          className="flex flex-col gap-4 items-start mb-8"
          onSubmit={handleSubmit}
        >
          <div className="w-full">
            <label className="flex flex-col my-4 text-gray-700 mb-2">
              Audit CSV file
            </label>
            <input
              id="sheet-input"
              type="file"
              accept=".csv"
              required={true}
              className="border border-gray-400 p-1 w-full max-w-md rounded-md cursor-pointer "
              onChange={handleFileChange}
            />
          </div>

          {!!selectedFile && (
            <div className="w-full">
              <label className="flex flex-col my-4 text-gray-700 mb-2">
                Email column name (on csv file).
              </label>
              <input
                id="stack-input"
                type="text"
                required={true}
                className="border border-gray-400 p-2 w-full max-w-md rounded-md cursor-pointer "
                value={emailColumnName}
                onChange={(e) => setEmailColumnName(e.target.value)}
              />
            </div>
          )}

          {!!selectedFile && (
            <div className="w-full">
              <label className="flex flex-col my-4 text-gray-700 mb-2">
                Non stack column names to exclude from the chart.
              </label>
              <input
                id="stack-input"
                type="text"
                required={true}
                className="border border-gray-400 p-2 w-full max-w-md rounded-md cursor-pointer "
                value={nonStackColumnNames}
                onChange={(e) => setNonStackColumnNames(e.target.value)}
              />
            </div>
          )}

          <button className="mt-4 px-20 py-3 bg-black text-white font-semibold rounded-full hover:bg-white hover:text-black hover:border hover:border-black">
            Process
          </button>
          {error && <div className="text-red-500">{error}</div>}
        </form>

        {!!languageData && (
          <>
            <hr className="broder" />

            <div className="mt-8">
              <BarChart chartData={languageData} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
