// API client untuk UGC backend (Cloudflare Pages Functions)

const API_BASE = "/api";

// ============== TYPES ==============

export interface FacebookPage {
  id: string;
  name: string;
  username?: string;
  access_token: string;
}

export interface OAuthCallbackResponse {
  success: boolean;
  page: FacebookPage;
  instagram_business_account_id: string | null;
  all_pages: Array<{ id: string; name: string }>;
}

export interface PublishPhotoRequest {
  ig_user_id: string;
  page_id: string;
  page_access_token: string;
  image_url: string;
  caption: string;
}

export interface PublishPhotoResponse {
  success: boolean;
  instagram: {
    container_id: string;
    post_id: string | null;
    error: { message: string } | null;
  };
  facebook: {
    post_id: string | null;
    error: { message: string } | null;
  };
}

// ============== STORAGE ==============

const STORAGE_KEY = "ugc_fb_connection";

export interface StoredConnection {
  page: FacebookPage;
  igBusinessId: string | null;
  followers: number;
  connectedAt: string;
}

export function saveConnection(conn: StoredConnection) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conn));
}

export function getConnection(): StoredConnection | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredConnection;
  } catch {
    return null;
  }
}

export function clearConnection() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Ambil statistik live dari Facebook Graph API menggunakan token yang sudah tersimpan.
 * Dipanggil kapan saja tanpa perlu login ulang, selama long-lived token belum expired (60 hari).
 */
export async function fetchLivePageStats(): Promise<{
  followers: number;
} | null> {
  const conn = getConnection();
  if (!conn) return null;

  // Guard: jangan panggil API jika token tidak valid
  const token = conn.page.access_token;
  if (
    !token ||
    token === "undefined" ||
    token === "null" ||
    token.length < 10
  ) {
    console.warn(
      "[fetchLivePageStats] Token tidak valid di localStorage. Silakan hubungkan ulang.",
    );
    return null;
  }

  try {
    const username = conn.page.username || conn.page.id;
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${username}?fields=fan_count&access_token=${token}`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      fan_count?: number;
      error?: { message: string };
    };

    // Jika token expired, Graph API mengembalikan error dengan code 190
    if (data.error) {
      console.warn("[fetchLivePageStats] Graph API error:", data.error.message);
      return null;
    }
    if (data.fan_count === undefined) return null;

    // Update followers di localStorage agar sinkron
    const updated: StoredConnection = { ...conn, followers: data.fan_count };
    saveConnection(updated);

    return { followers: data.fan_count };
  } catch {
    return null;
  }
}

// ============== OAUTH ==============

/**
 * Redirect ke Facebook OAuth flow.
 * Setelah user login, FB akan redirect balik ke /api/auth/facebook/callback
 * yang return JSON. Halaman callback akan capture response dan simpan ke localStorage.
 */
export function startFacebookOAuth() {
  window.location.href = `${API_BASE}/auth/facebook`;
}

/**
 * Capture OAuth callback dari URL.
 * Dipanggil di halaman /callback atau root setelah redirect.
 *
 * Karena Pages Function callback return JSON (bukan redirect balik ke app),
 * kita pakai trick: buka callback di hidden iframe/popup dan listen ke postMessage.
 * ATAU: arahkan callback ke app page lalu extract dari response.
 */
export async function captureOAuthCallback(): Promise<OAuthCallbackResponse | null> {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  if (!code) return null;

  // Backend callback endpoint
  const callbackUrl = `${API_BASE}/auth/facebook/callback?code=${encodeURIComponent(code)}`;

  try {
    const res = await fetch(callbackUrl, { credentials: "include" });
    if (!res.ok) return null;
    return (await res.json()) as OAuthCallbackResponse;
  } catch (err) {
    console.error("OAuth callback error:", err);
    return null;
  }
}

// ============== PUBLISH ==============

export async function publishPhoto(
  req: PublishPhotoRequest,
): Promise<PublishPhotoResponse> {
  const res = await fetch(`${API_BASE}/publish/photo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return (await res.json()) as PublishPhotoResponse;
}
