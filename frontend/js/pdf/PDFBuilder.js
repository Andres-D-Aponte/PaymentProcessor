export class PDFBuilder {
  constructor() {
    this.config = {
      includeLogo: false,
      logoData: null,
      title: 'Comprobante de Pago',
      includePaymentDetails: true,
      includeUserInfo: true,
      theme: 'LIGHT',
      includeTimestamp: true,
      footerMessage: 'Gracias por su pago',
      format: 'A4'
    };
  }

  setIncludeLogo(include) {
    this.config.includeLogo = include;
    return this;
  }

  setLogoData(logoData) {
    this.config.logoData = logoData;
    return this;
  }

  setTitle(title) {
    this.config.title = title;
    return this;
  }

  setIncludePaymentDetails(include) {
    this.config.includePaymentDetails = include;
    return this;
  }

  setIncludeUserInfo(include) {
    this.config.includeUserInfo = include;
    return this;
  }

  setTheme(theme) {
    this.config.theme = theme;
    return this;
  }

  setIncludeTimestamp(include) {
    this.config.includeTimestamp = include;
    return this;
  }

  setFooterMessage(message) {
    this.config.footerMessage = message;
    return this;
  }

  setFormat(format) {
    this.config.format = format;
    return this;
  }

  build(payment, doc) {
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;
    const lineHeight = 10;

    // Aplicar tema
    if (this.config.theme === 'DARK') {
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(40, 40, 40);
      doc.rect(0, 0, pageWidth, doc.internal.pageSize.height, 'F');
    } else {
      doc.setTextColor(0, 0, 0);
    }

    // Logo
    if (this.config.includeLogo && this.config.logoData) {
      doc.addImage(this.config.logoData, 'JPEG', pageWidth/2 - 30, yPosition, 60, 30, undefined, 'FAST');
      yPosition += 40;
    }

    // Título
    doc.setFontSize(20);
    doc.text(this.config.title, pageWidth/2, yPosition, { align: 'center' });
    yPosition += lineHeight * 2;

    // Detalles del pago
    if (this.config.includePaymentDetails) {
      doc.setFontSize(12);
      doc.text(`ID de Pago: ${payment.id}`, 20, yPosition);
      yPosition += lineHeight;
      
      if (this.config.includeTimestamp) {
        doc.text(`Fecha: ${new Date(payment.date).toLocaleString()}`, 20, yPosition);
        yPosition += lineHeight;
      }

      doc.text(`Método de Pago: ${payment.paymentMethod}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Monto Original: $${payment.amount.toFixed(2)}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Monto Final: $${payment.finalAmount.toFixed(2)}`, 20, yPosition);
      yPosition += lineHeight;
    }

    // Información del usuario
    if (this.config.includeUserInfo && (payment.email || payment.phone)) {
      yPosition += lineHeight;
      if (payment.email) {
        doc.text(`Email: ${payment.email}`, 20, yPosition);
        yPosition += lineHeight;
      }
      if (payment.phone) {
        doc.text(`Teléfono: ${payment.phone}`, 20, yPosition);
        yPosition += lineHeight;
      }
    }

    // Pie de página
    if (this.config.footerMessage) {
      doc.setFontSize(10);
      doc.text(this.config.footerMessage, pageWidth/2, 280, { align: 'center' });
    }

    return doc;
  }
}