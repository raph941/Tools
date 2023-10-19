import Papa from "papaparse";
import { useState } from "react";

export interface StackData {
  email: string;
  displayValue: string;
}

export type CSVParsedDataType = { [key: string]: StackData[] };


const processCSVData = (
  parsedData: any[],
  emailColumnName: string,
  excludedColumns: string[]
): CSVParsedDataType => {
  const data: CSVParsedDataType = {};

  // Find the index of the email column
  const emailColumnIndex = parsedData[0].indexOf(emailColumnName);

  if (emailColumnIndex === -1) {
    throw Error("Email column not found.");
  }

  // Find the indices of the excluded columns
  const excludedColumnIndices = excludedColumns.map((column) =>
    parsedData[0].indexOf(column)
  );

  // Iterate through the parsed data to collect language data
  for (let i = 1; i < parsedData.length; i++) {
    const rowData = parsedData[i];
    const email = rowData[emailColumnIndex] || "";

    for (let j = 0; j < rowData.length; j++) {
      if (!excludedColumnIndices.includes(j)) {
        const columnName = parsedData[0][j];
        if (!data[columnName]) {
          data[columnName] = [];
        }

        // Check if this row already exists for this technology
        const exists = data[columnName].some((entry) => entry.email === email);

        if (!exists) {
          const stackData: StackData = {
            email,
            displayValue: rowData[j] || "",
          };
          data[columnName].push(stackData);
        }
      }
    }
  }

  return data;
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
    emailColumnName: string,
    nonStackColumnNames: string
  ): CSVParsedDataType => {
    const data = processCSVData(
      parsedCsvData,
      emailColumnName,
      nonStackColumnNames?.split(',')
    );
    // console.log(data)

    return data
  };

  return {
    parseCsv,
    getColumnNames
  };
};
