import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import moment from "moment";

/**
 * Generates a PDF report with title, date, charts (captured as images), and transaction table.
 * @param {string} title - Report Title (e.g. "Income Report")
 * @param {Array} transactions - List of transactions
 * @param {Array} chartIds - Array of DOM IDs of chart containers to capture
 * @param {string} type - 'income' or 'expense' for styling
 */
export const generatePDF = async (title, transactions, chartIds = [], type = "income") => {
    const doc = new jsPDF();
    const tableColumn = ["Date", "Description", "Category/Source", "Amount"];
    const tableRows = [];

    // Format Data
    transactions.forEach((item) => {
        const rowData = [
            moment(item.date).format("MMM Do, YYYY"),
            item.title,
            item.category || item.source,
            new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.amount)
        ];
        tableRows.push(rowData);
    });

    // 1. Title & Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(title, 14, 20);

    doc.setFontSize(10);
    doc.text(`Generated on: ${moment().format("MMM Do, YYYY h:mm A")}`, 14, 27);
    
    // Summary
    const totalAmount = transactions.reduce((acc, curr) => acc + Number(curr.amount), 0);
    doc.setFontSize(12);
    doc.text(`Total ${type === 'income' ? 'Income' : 'Expense'}: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalAmount)}`, 14, 35);

    let finalY = 40;

    // 2. Capture Charts (if any)
    if (chartIds.length > 0) {
        doc.text("Analytics Snapshot", 14, finalY);
        finalY += 5;

        for (const id of chartIds) {
            const chartElement = document.getElementById(id);
            if (chartElement) {
                try {
                    // Use html2canvas to capture the chart area
                    const canvas = await html2canvas(chartElement, { scale: 2 });
                    const imgData = canvas.toDataURL("image/png");
                    
                    // Simple scaling logic
                    const imgWidth = 180; // Fit within A4 width (~210mm)
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    
                    // Check if new page needed
                    if (finalY + imgHeight > 280) {
                         doc.addPage();
                         finalY = 20;
                    }

                    doc.addImage(imgData, "PNG", 14, finalY, imgWidth, imgHeight);
                    finalY += imgHeight + 10;
                } catch (err) {
                    console.error("Error generating PDF chart:", err);
                }
            }
        }
    }

    // 3. Transactions Table
    // Check if new page needed for keys
    if (finalY > 250) {
        doc.addPage();
        finalY = 20;
    }

    doc.text("Transaction Details", 14, finalY);
    
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: finalY + 5,
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: { 
            fillColor: type === 'income' ? [34, 197, 94] : [220, 38, 38], // Green or Red
            textColor: [255, 255, 255] 
        }
    });

    // Save
    doc.save(`${title.replace(/\s+/g, "_")}_${moment().format("DD-MM-YYYY")}.pdf`);
};
