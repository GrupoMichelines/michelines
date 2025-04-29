import axios from 'axios';

const WHATSAPP_API_URL = 'https://graph.facebook.com/v17.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const ADMIN_PHONE = '5511948486470'; // Número do administrador

interface WhatsAppMessage {
  messaging_product: string;
  to: string;
  type: string;
  template: {
    name: string;
    language: {
      code: string;
    };
    components?: {
      type: string;
      parameters: {
        type: string;
        text: string;
      }[];
    }[];
  };
}

export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  try {
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "text",
        text: {
          body: message
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
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

  return sendWhatsAppMessage(ADMIN_PHONE, message);
} 