import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

type ExportRow = Record<string, string | number | boolean | null | undefined>;

export const exportToExcel = (data: ExportRow[], fileName: string, sheetName: string = "Data") => {
  if (!data || data.length === 0) {
    alert("Aucune donnée à exporter.");
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (
  title: string,
  columns: string[],
  dataRows: (string | number)[][],
  fileName: string
) => {
  if (!dataRows || dataRows.length === 0) {
    alert("Aucune donnée à exporter.");
    return;
  }
  const doc = new jsPDF();

  // Custom Styling Dogon
  doc.setFillColor(15, 17, 23);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(212, 168, 83);
  doc.setFontSize(22);
  doc.text("NYA BLO BUSINESS OS", 14, 20);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(title, 14, 30);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (doc as any).autoTable({
    startY: 50,
    head: [columns],
    body: dataRows,
    theme: "grid",
    headStyles: { fillColor: [44, 48, 73], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 50 },
  });

  doc.save(`${fileName}.pdf`);
};
