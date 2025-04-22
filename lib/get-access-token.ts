import fetch from "node-fetch";
import { Agent } from 'https';

export async function getAccessToken() {
  const params = new URLSearchParams();
  params.append('scope', 'GIGACHAT_API_PERS');

  // Заголовки
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
    'RqUID': '658b0151-3c49-49ab-a92d-5e53de3000db',
    'Authorization': `Basic ${process.env.AUTH_TOKEN}`,
  };

  // Отключение SSL-проверки (если у тебя самоподписанный сертификат)
  const httpsAgent = new Agent({
    rejectUnauthorized: false, // ⚠️ Только для dev/test!
  });

  fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
    method: 'POST',
    headers,
    body: params.toString(),
    agent: httpsAgent,
  })
    .then(async res => {
      const data = await res.text();
      console.log(data);
    })
    .catch(err => {
      console.error('Ошибка запроса:', err);
    });
}
