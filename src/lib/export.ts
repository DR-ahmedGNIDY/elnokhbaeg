"use client";

import * as XLSX from "xlsx";

/** Exports an array of plain objects to an .xlsx file (client-side). */
export function exportToExcel<T extends Record<string, unknown>>(
  rows: T[],
  filename: string,
  sheetName = "Sheet1",
) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  // Right-to-left view for Arabic content.
  if (!workbook.Workbook) workbook.Workbook = {};
  workbook.Workbook.Views = [{ RTL: true }];
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
