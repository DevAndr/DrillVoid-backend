export interface TelegramUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
  allows_write_to_pm: boolean;
  photo_url: string;
}

export interface TelegramWebAppData {
  chat_instance?: string;
  chat_type?: string;
  auth_date?: number;
  signature?: string;
  hash?: string;
}

export interface TelegramInitData {
  tgWebAppData?: TelegramWebAppData;
  user?: TelegramUser;
  tgWebAppVersion?: string;
  tgWebAppPlatform?: string;
}

export const parseTelegramInitData = (initData: string) => {
  const cleanedInitData = initData.replace(/^#/, '');
  const urlParams = new URLSearchParams(cleanedInitData);

  const result: TelegramInitData = {};
  const tgWebAppData = urlParams.get('tgWebAppData');

  if (tgWebAppData) {
    const dataParams = new URLSearchParams(tgWebAppData);
    result.tgWebAppData = {};

    // Парсим поле user
    const userEncoded = dataParams.get('user');
    if (userEncoded) {
      result.user = JSON.parse(decodeURIComponent(userEncoded));
    }

    // Добавляем остальные параметры
    const chatInstance = dataParams.get('chat_instance');
    if (chatInstance) {
      result.tgWebAppData.chat_instance = chatInstance;
    }

    const chatType = dataParams.get('chat_type');
    if (chatType) {
      result.tgWebAppData.chat_type = chatType;
    }

    const authDate = dataParams.get('auth_date');
    if (authDate) {
      result.tgWebAppData.auth_date = parseInt(authDate, 10);
    }

    const signature = dataParams.get('signature');
    if (signature) {
      result.tgWebAppData.signature = signature;
    }

    const hash = dataParams.get('hash');
    if (hash) {
      result.tgWebAppData.hash = hash;
    }
  }

  return result;
};
