import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

export interface AttendanceRecord {
  studentName: string;
  studentCode: string;
  enrollmentStatus: string;
  enrolledAt: string;
}

export interface TrainingReportData {
  trainingTitle: string;
  instructorName: string;
  startTime: string;
  endTime: string;
  location: string;
  mode: string;
  attendees: AttendanceRecord[];
  totalEnrolled: number;
}

export const generateAttendanceReport = (data: TrainingReportData): void => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('TrainPro - Training Attendance Report', 20, 20);
  
  // Training Details
  doc.setFontSize(12);
  doc.text(`Training: ${data.trainingTitle}`, 20, 40);
  doc.text(`Instructor: ${data.instructorName}`, 20, 50);
  doc.text(`Date: ${format(new Date(data.startTime), 'PPP')}`, 20, 60);
  doc.text(`Time: ${format(new Date(data.startTime), 'p')} - ${format(new Date(data.endTime), 'p')}`, 20, 70);
  doc.text(`Location: ${data.location || 'Online'}`, 20, 80);
  doc.text(`Mode: ${data.mode}`, 20, 90);
  doc.text(`Total Enrolled: ${data.totalEnrolled}`, 20, 100);
  
  // Attendee List
  doc.setFontSize(14);
  doc.text('Attendees:', 20, 120);
  
  doc.setFontSize(10);
  let yPos = 140;
  
  // Table Header
  doc.text('No.', 20, yPos);
  doc.text('Student Code', 40, yPos);
  doc.text('Student Name', 80, yPos);
  doc.text('Status', 140, yPos);
  doc.text('Enrolled Date', 170, yPos);
  
  // Draw line under header
  doc.line(20, yPos + 2, 200, yPos + 2);
  yPos += 10;
  
  // Attendee rows
  data.attendees.forEach((attendee, index) => {
    if (yPos > 270) { // New page if needed
      doc.addPage();
      yPos = 20;
    }
    
    doc.text((index + 1).toString(), 20, yPos);
    doc.text(attendee.studentCode, 40, yPos);
    doc.text(attendee.studentName, 80, yPos);
    doc.text(attendee.enrollmentStatus, 140, yPos);
    doc.text(format(new Date(attendee.enrolledAt), 'PP'), 170, yPos);
    
    yPos += 8;
  });
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Generated on ${format(new Date(), 'PPP')} | Page ${i} of ${pageCount}`,
      20,
      doc.internal.pageSize.height - 10
    );
  }
  
  // Save the PDF
  doc.save(`${data.trainingTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_attendance_report.pdf`);
};

export const generateCourseReport = async (courseData: any): Promise<void> => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('TrainPro - Course Report', 20, 20);
  
  // Course Details
  doc.setFontSize(12);
  doc.text(`Course: ${courseData.title}`, 20, 40);
  doc.text(`Category: ${courseData.category}`, 20, 50);
  doc.text(`Level: ${courseData.level}`, 20, 60);
  doc.text(`Duration: ${courseData.duration_hours} hours`, 20, 70);
  doc.text(`Max Students: ${courseData.max_students}`, 20, 80);
  
  if (courseData.description) {
    doc.text('Description:', 20, 100);
    const splitDescription = doc.splitTextToSize(courseData.description, 170);
    doc.text(splitDescription, 20, 110);
  }
  
  // Save the PDF
  doc.save(`${courseData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_course_report.pdf`);
};

export const exportTableToPDF = async (
  tableElement: HTMLElement,
  filename: string,
  title: string
): Promise<void> => {
  try {
    const canvas = await html2canvas(tableElement, {
      scale: 2,
      logging: false,
      useCORS: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(16);
    pdf.text(title, 20, 20);
    
    // Calculate dimensions
    const imgWidth = 170;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add image
    pdf.addImage(imgData, 'PNG', 20, 30, imgWidth, imgHeight);
    
    // Add footer
    pdf.setFontSize(8);
    pdf.text(
      `Generated on ${format(new Date(), 'PPP')}`,
      20,
      pdf.internal.pageSize.height - 10
    );
    
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};