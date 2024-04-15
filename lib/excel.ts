import { Job } from "@prisma/client"; // Import the Job type

export const exportDataToExcel = (data: Job[], filename: string) => {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    data.map((row) => Object.values(row).join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
};
