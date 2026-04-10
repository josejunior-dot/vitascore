/**
 * Configuração da API de análise por IA.
 *
 * Em desenvolvimento: http://localhost:3333
 * Em produção: URL do deploy (Vercel/Cloudflare)
 *
 * Para ativar: setar a URL no localStorage ou Preferences:
 *   localStorage.setItem("vitascore-api-url", "http://localhost:3333")
 */

async function getStore(key: string): Promise<string | null> {
  try {
    const { Preferences } = await import("@capacitor/preferences");
    const { value } = await Preferences.get({ key });
    return value;
  } catch {
    return localStorage.getItem(key);
  }
}

export async function getApiUrl(): Promise<string | null> {
  return await getStore("vitascore-api-url");
}

export async function isApiConfigured(): Promise<boolean> {
  const url = await getApiUrl();
  return url !== null && url.length > 0;
}

export async function setApiUrl(url: string): Promise<void> {
  try {
    const { Preferences } = await import("@capacitor/preferences");
    await Preferences.set({ key: "vitascore-api-url", value: url });
  } catch {
    localStorage.setItem("vitascore-api-url", url);
  }
}
