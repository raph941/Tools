import Papa from "papaparse";
import { useState } from "react";

export interface StackData {
  email: string;
  displayValue: string;
}

const processCSVData = (
  parsedData: any[],
  stackToSeeIndex: Number,
  emailColumnName: string
): StackData[] => {
  const languageData: StackData[] = [];

  // Find the index of the email column
  const emailColumnIndex = parsedData[0].indexOf(emailColumnName);

  if (emailColumnIndex === -1) {
    throw Error("Email column not found.");
  }

  // Iterate through the parsed data to collect language data for the specified stack
  for (let i = 1; i < parsedData.length; i++) {
    const rowData = parsedData[i];
    const email = rowData[emailColumnIndex] || "";
    const displayValue = rowData[String(stackToSeeIndex)] || "";

    languageData.push({ email, displayValue });
  }

  return languageData;
};

export const useHandleCsv = () => {
  const [parsedCsvData, setParsedCsvData] = useState<any[]>([]);

  const getColumnNames = (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        skipEmptyLines: true,
        complete: (results) => {
          if (Array.isArray(results.data) && results.data.length > 0) {
            setParsedCsvData(results.data);
            const columnNames = results.data[0] as string[];
            resolve(columnNames);
          } else {
            reject("CSV file is empty or invalid format.");
          }
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  const parseCsv = (
    stackToSeeIndex: Number,
    emailColumnName: string
  ): StackData[] => {
    const data: StackData[] = processCSVData(
      parsedCsvData,
      stackToSeeIndex,
      emailColumnName
    );
    return data;
  };

  return {
    parseCsv,
    getColumnNames
  };
};
