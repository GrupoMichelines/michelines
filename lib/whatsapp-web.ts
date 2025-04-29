import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

// Cria uma instância do cliente WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox']
  }
});

// Gera o QR Code para autenticação
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('QR Code gerado! Escaneie com o WhatsApp no seu celular.');
});

// Quando estiver pronto
client.on('ready', () => {
  console.log('Cliente WhatsApp está pronto!');
});

// Inicia o cliente
client.initialize();

export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  try {
    // Formata o número para o padrão internacional
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    const chatId = `${formattedNumber}@c.us`;

    // Envia a mensagem
    await client.sendMessage(chatId, message);
    console.log('Mensagem enviada com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
}

export async function sendNewDriverNotification(driverData: {
  name: string;
  phone: string;
  email: string;
  cpf: string;
  licenseNumber: string;
  vehicleInfo: {
    model: string;
    plate: string;
    year: string;
  };
}) {
  const adminPhone = '5511948486470';
  
  const message = `🚗 *NOVO MOTORISTA CADASTRADO!*\n\n` +
    `*Nome:* ${driverData.name}\n` +
    `*Telefone:* ${driverData.phone}\n` +
    `*Email:* ${driverData.email}\n` +
    `*CPF:* ${driverData.cpf}\n` +
    `*CNH:* ${driverData.licenseNumber}\n\n` +
    `*Veículo:*\n` +
    `- Modelo: ${driverData.vehicleInfo.model}\n` +
    `- Placa: ${driverData.vehicleInfo.plate}\n` +
    `- Ano: ${driverData.vehicleInfo.year}\n\n` +
    `Acesse o painel administrativo para aprovar o cadastro.`;

  return sendWhatsAppMessage(adminPhone, message);
} 