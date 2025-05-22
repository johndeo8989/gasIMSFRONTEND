import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the function
import { handleError } from './utils';

export const exportToPDF = (data, fileName) => {
    const doc = new jsPDF();

    if (!data || data.length === 0) {
        handleError('No data provided for PDF export.');
        return;
    }

    const headers = Object.keys(data[0]);
    const rows = data.map(item => headers.map(header => String(item[header] ?? '')));

    doc.text("Exported Data", 14, 15);

    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 20,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] },
    });

    const safeFileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`${safeFileName}.pdf`);
};
