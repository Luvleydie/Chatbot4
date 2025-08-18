// Controlador para FAQ
exports.getFaq = (req, res) => {
  const faq = [
    { id:1, question:'¿Cómo reservo?', answer:'Inicia el chat y sigue las indicaciones.' },
    { id:2, question:'¿Qué documentos necesito?', answer:'Licencia vigente y comprobante de domicilio.' },
    // ... más preguntas
  ];
  res.json({ ok:true, faq });
};