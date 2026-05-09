const { google } = require('googleapis');

export default async function handler(req, res) {
  // CORS configuration (allow requests from the frontend)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { 
      nome, 
      idade, 
      whatsapp, 
      score_total, 
      classificacao, 
      respostas_detalhadas, 
      data_hora 
    } = req.body;

    // Configurando autenticação com as variáveis de ambiente da Vercel
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') // A Vercel escapa o \n
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Substitua pelo ID da sua planilha, que estará nas variáveis da Vercel
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const r = respostas_detalhadas || {};
    
    // Formatando as respostas em formato de lista com quebras de linha
    const respostasFormatadas = [
      `Mancar: ${r.mancar !== undefined ? r.mancar : "N/A"}`,
      `Apoio: ${r.apoio !== undefined ? r.apoio : "N/A"}`,
      `Travamento: ${r.travamento !== undefined ? r.travamento : "N/A"}`,
      `Instabilidade: ${r.instabilidade !== undefined ? r.instabilidade : "N/A"}`,
      `Dor: ${r.dor !== undefined ? r.dor : "N/A"}`,
      `Inchaço: ${r.inchaco !== undefined ? r.inchaco : "N/A"}`,
      `Escadas: ${r.escadas !== undefined ? r.escadas : "N/A"}`,
      `Agachamento: ${r.agachamento !== undefined ? r.agachamento : "N/A"}`
    ].join('\n');

    const row = [
      nome || "",
      idade || "",
      whatsapp || "",
      score_total || 0,
      respostasFormatadas
    ];

    // Fazendo a requisição para a API do Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1', // Apenas a coluna inicial, a API encontra a próxima linha vazia
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row]
      }
    });

    return res.status(200).json({ status: 'success', message: 'Lead gravado com sucesso no Google Sheets' });
  } catch (error) {
    console.error('Erro na Vercel Function:', error);
    return res.status(500).json({ status: 'error', message: 'Falha interna no servidor', details: error.message });
  }
}
