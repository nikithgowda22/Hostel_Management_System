// src/utils/generatePDFReceipt.js
import jsPDF from "jspdf";

export function generatePDFReceipt(registrationData) {
  const doc = new jsPDF();

  const leftMargin = 20;
  let y = 20;

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("HostelMS", leftMargin, y);

  y += 10;

  // Heading
  doc.setFontSize(16);
  doc.setFont("times", "bold");
  doc.text("Hostel Payment Receipt", leftMargin, y);

  y += 10;

  // Line
  doc.setLineWidth(0.5);
  doc.line(leftMargin, y, 190, y);

  y += 10;

  // Details
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  const lines = [
    `Name: ${registrationData.name}`,
    `Email: ${registrationData.email}`,
    `Course: ${registrationData.course || 'N/A'}`,
    `Duration: ${registrationData.duration}`,
    `Amount Paid: ₹ ${registrationData.fees}`,
    `Payment ID: ${registrationData.paymentId || 'N/A'}`,
    `Date: ${new Date().toLocaleString()}`,
  ];

  lines.forEach((line) => {
    doc.text(line, leftMargin, y);
    y += 8;
  });

  y += 5;
  doc.setFont("times", "italic");
  doc.setTextColor(100);
  doc.text("Thank you for your payment.", leftMargin, y);

  // Save the file
  const filename = `Hostel_Receipt_${registrationData.name.replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
}
