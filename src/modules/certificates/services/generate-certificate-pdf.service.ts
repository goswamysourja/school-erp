import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

import { getCertificateGenerationData } from "@/modules/certificates/services/generate-certificate.service";

function centerX(
  text: string,
  font: any,
  size: number,
  pageWidth: number,
) {
  return (
    (pageWidth - font.widthOfTextAtSize(text, size)) /
    2
  );
}

function wrapText(
  text: string,
  font: any,
  size: number,
  maxWidth: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine
      ? `${currentLine} ${word}`
      : word;

    if (
      font.widthOfTextAtSize(
        testLine,
        size,
      ) <= maxWidth
    ) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }

      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function getCertificateStatement(
  certificate: Awaited<
    ReturnType<typeof getCertificateGenerationData>
  >,
) {
  const studentName = `${certificate.student.firstName} ${certificate.student.lastName}`;

  switch (certificate.purpose) {
    case "TRANSFER": {
      const details =
        certificate.details ||
        "has been granted this Transfer Certificate.";

      return `This is to certify that ${studentName}, bearing Admission Number ${certificate.student.admissionNumber}, ${details}`;
    }

    case "COMPETITION_WINNER": {
      const eventName =
        certificate.eventName ||
        "the competition";

      const position =
        certificate.position ||
        "a winning position";

      const eventDate = certificate.eventDate
        ? certificate.eventDate.toLocaleDateString()
        : null;

      return `This certificate is proudly presented to ${studentName} for securing ${position} in ${eventName}${eventDate ? ` held on ${eventDate}` : ""}.`;
    }

    case "COMPETITION_PARTICIPANT": {
      const eventName =
        certificate.eventName ||
        "the competition";

      const eventDate = certificate.eventDate
        ? certificate.eventDate.toLocaleDateString()
        : null;

      return `This certificate is presented to ${studentName} in recognition of participation in ${eventName}${eventDate ? ` held on ${eventDate}` : ""}.`;
    }

    case "ACHIEVEMENT": {
      const achievement =
        certificate.achievement ||
        "an outstanding achievement";

      const achievementDate =
        certificate.eventDate
          ? certificate.eventDate.toLocaleDateString()
          : null;

      return `This certificate is proudly presented to ${studentName} in recognition of ${achievement}${achievementDate ? ` achieved on ${achievementDate}` : ""}.`;
    }

    case "PARTICIPATION": {
      const eventName =
        certificate.eventName ||
        "the event";

      const eventDate = certificate.eventDate
        ? certificate.eventDate.toLocaleDateString()
        : null;

      return `This certificate is presented to ${studentName} in appreciation of participation in ${eventName}${eventDate ? ` held on ${eventDate}` : ""}.`;
    }

    default:
      return `This certificate is proudly presented to ${studentName}.`;
  }
}

export async function generateCertificatePdf(
  id: string,
  tenantId: string,
) {
  const certificate =
    await getCertificateGenerationData(
      id,
      tenantId,
    );

  const pdfDoc =
    await PDFDocument.create();

  const page = pdfDoc.addPage([
    841.89,
    595.28,
  ]);

  const regularFont =
    await pdfDoc.embedFont(
      StandardFonts.TimesRoman,
    );

  const boldFont =
    await pdfDoc.embedFont(
      StandardFonts.TimesRomanBold,
    );

  const italicFont =
    await pdfDoc.embedFont(
      StandardFonts.TimesRomanItalic,
    );

  const { width, height } =
    page.getSize();

  const dark = rgb(
    0.12,
    0.12,
    0.12,
  );

  const muted = rgb(
    0.30,
    0.30,
    0.30,
  );

  const accent = rgb(
    0.35,
    0.25,
    0.12,
  );

  /*
   * ============================
   * OUTER BORDER
   * ============================
   */

  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderWidth: 2.5,
    borderColor: accent,
  });

  page.drawRectangle({
    x: 29,
    y: 29,
    width: width - 58,
    height: height - 58,
    borderWidth: 1,
    borderColor: accent,
  });

  /*
   * ============================
   * SCHOOL NAME
   * ============================
   */

  const schoolName =
    certificate.tenant.name;

  page.drawText(schoolName, {
    x: centerX(
      schoolName,
      boldFont,
      28,
      width,
    ),
    y: height - 85,
    size: 28,
    font: boldFont,
    color: dark,
  });

  /*
   * Decorative line
   */

  page.drawLine({
    start: {
      x: 150,
      y: height - 105,
    },
    end: {
      x: width - 150,
      y: height - 105,
    },
    thickness: 1.5,
    color: accent,
  });

  /*
   * ============================
   * CERTIFICATE TITLE
   * ============================
   */

  page.drawText(
    certificate.certificateType,
    {
      x: centerX(
        certificate.certificateType,
        boldFont,
        23,
        width,
      ),
      y: height - 145,
      size: 23,
      font: boldFont,
      color: accent,
    },
  );

  /*
   * ============================
   * INTRODUCTION
   * ============================
   */

  const intro =
    certificate.purpose ===
      "TRANSFER"
      ? "This is to certify that"
      : "This certificate is proudly presented to";

  page.drawText(intro, {
    x: centerX(
      intro,
      regularFont,
      16,
      width,
    ),
    y: height - 195,
    size: 16,
    font: regularFont,
    color: muted,
  });

  /*
   * ============================
   * STUDENT NAME
   * ============================
   */

  const studentName =
    `${certificate.student.firstName} ${certificate.student.lastName}`;

  page.drawText(studentName, {
    x: centerX(
      studentName,
      boldFont,
      31,
      width,
    ),
    y: height - 245,
    size: 31,
    font: boldFont,
    color: dark,
  });

  page.drawLine({
    start: {
      x: 250,
      y: height - 257,
    },
    end: {
      x: width - 250,
      y: height - 257,
    },
    thickness: 0.8,
    color: muted,
  });

  /*
   * ============================
   * STUDENT DETAILS
   * ============================
   */

  const studentDetails = `Admission Number: ${certificate.student.admissionNumber}`;

  page.drawText(studentDetails, {
    x: centerX(
      studentDetails,
      regularFont,
      13,
      width,
    ),
    y: height - 285,
    size: 13,
    font: regularFont,
    color: muted,
  });

  if (
    certificate.student.section
  ) {
    const classDetails =
      `Class: ${certificate.student.section.className}   |   Section: ${certificate.student.section.name}`;

    page.drawText(classDetails, {
      x: centerX(
        classDetails,
        regularFont,
        13,
        width,
      ),
      y: height - 310,
      size: 13,
      font: regularFont,
      color: muted,
    });

    if (
      certificate.student.section
        .academicYear
    ) {
      const academicYear =
        `Academic Year: ${certificate.student.section.academicYear}`;

      page.drawText(academicYear, {
        x: centerX(
          academicYear,
          regularFont,
          13,
          width,
        ),
        y: height - 335,
        size: 13,
        font: regularFont,
        color: muted,
      });
    }
  }

  /*
   * ============================
   * PURPOSE-SPECIFIC STATEMENT
   * ============================
   */

  const statement =
    getCertificateStatement(
      certificate,
    );

  const statementSize = 15;
  const statementMaxWidth =
    width - 190;

  const statementLines =
    wrapText(
      statement,
      regularFont,
      statementSize,
      statementMaxWidth,
    );

  let statementY =
    height - 385;

  for (const line of statementLines) {
    page.drawText(line, {
      x: centerX(
        line,
        regularFont,
        statementSize,
        width,
      ),
      y: statementY,
      size: statementSize,
      font: regularFont,
      color: dark,
    });

    statementY -= 23;
  }

  /*
   * ============================
   * SIGNATURE / SEAL AREA
   * ============================
   */

  const footerY = 92;

  /*
   * Headmaster signature
   */

  page.drawLine({
    start: {
      x: 110,
      y: footerY + 25,
    },
    end: {
      x: 260,
      y: footerY + 25,
    },
    thickness: 1,
    color: dark,
  });

  const signatureLabel =
    "Headmaster / Principal";

  page.drawText(
    signatureLabel,
    {
      x: centerX(
        signatureLabel,
        regularFont,
        11,
        185,
      ) + 92.5,
      y: footerY + 7,
      size: 11,
      font: regularFont,
      color: muted,
    },
  );

  /*
   * School seal
   */

  page.drawCircle({
    x: width / 2,
    y: footerY + 25,
    size: 31,
    borderWidth: 1.5,
    borderColor: accent,
  });

  const sealText = "SCHOOL";

  page.drawText(sealText, {
    x: centerX(
      sealText,
      boldFont,
      8,
      width,
    ),
    y: footerY + 29,
    size: 8,
    font: boldFont,
    color: accent,
  });

  const sealText2 = "SEAL";

  page.drawText(
    sealText2,
    {
      x: centerX(
        sealText2,
        boldFont,
        8,
        width,
      ),
      y: footerY + 17,
      size: 8,
      font: boldFont,
      color: accent,
    },
  );

  /*
   * Issue date
   */

  const issueDate =
    `Issue Date: ${certificate.issueDate.toLocaleDateString()}`;

  page.drawText(issueDate, {
    x: width - 265,
    y: footerY + 25,
    size: 11,
    font: regularFont,
    color: muted,
  });

  /*
   * Certificate number
   */

  const certificateNumber =
    `Certificate No.: ${certificate.certificateNumber}`;

  page.drawText(
    certificateNumber,
    {
      x: width - 265,
      y: footerY + 7,
      size: 11,
      font: regularFont,
      color: muted,
    },
  );

  /*
   * ============================
   * FOOTER
   * ============================
   */

  const footerText =
    "Issued by the Institution";

  page.drawText(
    footerText,
    {
      x: centerX(
        footerText,
        italicFont,
        10,
        width,
      ),
      y: 48,
      size: 10,
      font: italicFont,
      color: muted,
    },
  );

  /*
   * ============================
   * GENERATE PDF
   * ============================
   */

  const pdfBytes =
    await pdfDoc.save();

  return Buffer.from(pdfBytes);
}