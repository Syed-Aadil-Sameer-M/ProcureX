import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// ─── Excel Export ───────────────────────────────────────────────
export function exportToExcel(
  data: Record<string, any>[],
  filename: string,
  sheetName: string = "Sheet1"
) {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()

  // Auto column widths
  const cols = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(key.length, ...data.map(row => String(row[key] || "").length)) + 2
  }))
  worksheet["!cols"] = cols

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

// ─── PDF Export ─────────────────────────────────────────────────
export function exportToPDF(
  headers: string[],
  rows: (string | number)[][],
  filename: string,
  title: string
) {
  const doc = new jsPDF()

  // Header bar
  doc.setFillColor(29, 158, 117)
  doc.rect(0, 0, 220, 20, "F")

  // Title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("ProcureX", 14, 13)

  // Subtitle
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(title, 60, 13)

  // Date
  doc.setFontSize(9)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 140, 13)

  // Table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 28,
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [29, 158, 117],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { left: 14, right: 14 },
  })

  doc.save(`${filename}.pdf`)
}