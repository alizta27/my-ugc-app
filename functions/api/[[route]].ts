/// <reference path="../../worker-configuration.d.ts" />
// Pure Pages Functions handler (no Hono - work around Hono + Pages routing bug)

type Bindings = {
  FB_APP_ID: string;
  FB_APP_SECRET: string;
  FB_REDIRECT_URI: string;
  FB_CONFIG_ID?: string;
  FB_STATIC_TOKEN?: string; // Token statis dari Meta Graph API Explorer (hanya untuk dev)
  FB_PAGE_USERNAME?: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

async function handleFacebookAuth(c: { env: Bindings }) {
  const { FB_APP_ID, FB_REDIRECT_URI, FB_CONFIG_ID } = c.env;
  const params = new URLSearchParams({
    client_id: FB_APP_ID,
    redirect_uri: FB_REDIRECT_URI,
    response_type: "code",
  });
  if (FB_CONFIG_ID) {
    params.append("config_id", FB_CONFIG_ID);
  } else {
    // Scopes disesuaikan dengan yang dimiliki user
    const scope =
      "ads_management,ads_read,business_management,leads_retrieval,pages_manage_ads,pages_show_list,pages_manage_metadata,pages_messaging,pages_read_engagement";
    params.append("scope", scope);
  }
  return Response.redirect(
    `https://www.facebook.com/v20.0/dialog/oauth?${params.toString()}`,
    302,
  );
}

/**
 * [DEV ONLY] Gunakan token statis dari Meta Graph API Explorer.
 * Aktifkan dengan mengisi FB_STATIC_TOKEN di .dev.vars.
 * Kunjungi: http://localhost:8788/api/auth/facebook/static
 */
async function handleStaticAuth(request: Request, c: { env: Bindings }) {
  const token = c.env.FB_STATIC_TOKEN;
  if (!token || token.trim() === "") {
    return jsonResponse(
      { error: "FB_STATIC_TOKEN belum diisi di .dev.vars" },
      400,
    );
  }

  const url = new URL(request.url);

  // Ambil daftar page menggunakan token statis
  const pagesRes = await fetch(
    `https://graph.facebook.com/v20.0/me/accounts?access_token=${token}`,
  );
  const pagesData = (await pagesRes.json()) as {
    data?: Array<{ id: string; name: string; access_token: string }>;
    error?: { message: string };
  };

  if (pagesData.error) {
    return jsonResponse({ error: "Token tidak valid", detail: pagesData.error }, 400);
  }

  let pages = pagesData.data ?? [];

  // Fallback ke Business Manager jika /me/accounts kosong
  if (pages.length === 0) {
    const bizRes = await fetch(`https://graph.facebook.com/v20.0/me/businesses?access_token=${token}`);
    const bizData = (await bizRes.json()) as { data?: Array<{ id: string }> };
    if (bizData.data && bizData.data.length > 0) {
      const bizId = bizData.data[0].id;
      const ownedRes = await fetch(
        `https://graph.facebook.com/v20.0/${bizId}/owned_pages?fields=id,name&access_token=${token}`,
      );
      const ownedData = (await ownedRes.json()) as { data?: Array<{ id: string; name: string }> };
      pages = (ownedData.data ?? []).map((p) => ({ ...p, access_token: token }));
    }
  }

  if (pages.length === 0) {
    return jsonResponse({ error: "Tidak ada halaman ditemukan untuk token ini" }, 400);
  }

  const page = pages[0];
  const pageToken = page.access_token || token;

  // Ambil fan_count & IG business account
  const detailRes = await fetch(
    `https://graph.facebook.com/v20.0/${page.id}?fields=fan_count,instagram_business_account,access_token&access_token=${pageToken}`,
  );
  const detail = (await detailRes.json()) as {
    fan_count?: number;
    instagram_business_account?: { id: string };
    access_token?: string;
  };

  const finalToken = detail.access_token || pageToken;

  const payload = {
    page: { id: page.id, name: page.name, username: c.env.FB_PAGE_USERNAME || "sapmahanura10", access_token: finalToken },
    igBusinessId: detail.instagram_business_account?.id || null,
    followers: detail.fan_count ?? 0,
    connectedAt: new Date().toISOString(),
  };

  const encoded = encodeURIComponent(btoa(JSON.stringify(payload)));
  return Response.redirect(`${url.origin}/?fb_callback=${encoded}`, 302);
}

async function handleFacebookCallback(request: Request, c: { env: Bindings }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return jsonResponse({ error: "Missing code parameter" }, 400);

  const { FB_APP_ID, FB_APP_SECRET, FB_REDIRECT_URI } = c.env;

  // 1. code → short-lived token
  const tokenRes = await fetch(
    `https://graph.facebook.com/v20.0/oauth/access_token?` +
      new URLSearchParams({
        client_id: FB_APP_ID,
        client_secret: FB_APP_SECRET,
        redirect_uri: FB_REDIRECT_URI,
        code,
      }),
  );
  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: { message: string };
  };
  if (!tokenData.access_token) {
    return jsonResponse(
      { error: "Failed to get access token", detail: tokenData },
      400,
    );
  }

  // 2. short-lived → long-lived token
  const longLivedRes = await fetch(
    `https://graph.facebook.com/v20.0/oauth/access_token?` +
      new URLSearchParams({
        grant_type: "fb_exchange_token",
        client_id: FB_APP_ID,
        client_secret: FB_APP_SECRET,
        fb_exchange_token: tokenData.access_token,
      }),
  );
  const longLivedData = (await longLivedRes.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!longLivedData.access_token) {
    return jsonResponse({ error: "Failed to get long-lived token" }, 400);
  }

  // 3. Langsung ambil detail page menggunakan username dari env
  const token = longLivedData.access_token;
  const username = c.env.FB_PAGE_USERNAME || "sapmahanura10";
  
  const pageDetailRes = await fetch(
    `https://graph.facebook.com/v20.0/${username}?fields=id,name,access_token,instagram_business_account,fan_count&access_token=${token}`,
  );
  
  const pageDetail = (await pageDetailRes.json()) as {
    id?: string;
    name?: string;
    access_token?: string;
    instagram_business_account?: { id: string };
    fan_count?: number;
    error?: { message: string };
  };

  if (pageDetail.error || !pageDetail.id) {
    return jsonResponse(
      {
        error: `Failed to fetch page details for ${username}`,
        detail: pageDetail,
      },
      400,
    );
  }

  // Gunakan page access_token dari response jika ada, fallback ke user token
  const finalPageToken = pageDetail.access_token || token;

  // 7. Redirect ke frontend dengan data koneksi di URL params
  const payload = {
    page: { id: pageDetail.id, name: pageDetail.name, username: username, access_token: finalPageToken },
    igBusinessId: pageDetail.instagram_business_account?.id || null,
    followers: pageDetail.fan_count ?? 0,
    connectedAt: new Date().toISOString(),
  };
  // btoa() menghasilkan +, /, = → harus encodeURIComponent agar aman di query string
  // URLSearchParams.get() di frontend akan auto-decode, lalu atob() akan bekerja dengan benar
  const encoded = encodeURIComponent(btoa(JSON.stringify(payload)));

  const redirectUrl = `${url.origin}/?fb_callback=${encoded}`;
  return Response.redirect(redirectUrl, 302);
}

async function handlePublishPhoto(request: Request) {
  const body = (await request.json()) as {
    ig_user_id: string;
    page_id: string;
    page_access_token: string;
    image_url: string;
    caption: string;
  };

  const { ig_user_id, page_id, page_access_token, image_url, caption } = body;
  if (!ig_user_id || !page_id || !page_access_token || !image_url) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }

  // 1. IG: create photo container
  const igContainerRes = await fetch(
    `https://graph.facebook.com/v20.0/${ig_user_id}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url,
        caption: caption || "",
        access_token: page_access_token,
      }),
    },
  );
  const igContainer = (await igContainerRes.json()) as {
    id?: string;
    error?: { message: string };
  };
  if (!igContainer.id) {
    return jsonResponse(
      { error: "Failed to create IG container", detail: igContainer },
      400,
    );
  }

  // 2. IG: publish container
  const igPublishRes = await fetch(
    `https://graph.facebook.com/v20.0/${ig_user_id}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: igContainer.id,
        access_token: page_access_token,
      }),
    },
  );
  const igPost = (await igPublishRes.json()) as {
    id?: string;
    error?: { message: string };
  };

  // 3. FB: post ke Page
  const fbRes = await fetch(
    `https://graph.facebook.com/v20.0/${page_id}/photos`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: image_url,
        caption: caption || "",
        access_token: page_access_token,
      }),
    },
  );
  const fbPost = (await fbRes.json()) as {
    id?: string;
    error?: { message: string };
  };

  return jsonResponse({
    success: true,
    instagram: {
      container_id: igContainer.id,
      post_id: igPost.id || null,
      error: igPost.error || null,
    },
    facebook: { post_id: fbPost.id || null, error: fbPost.error || null },
  });
}

export const onRequest: PagesFunction<Bindings> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, "");

  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  console.log(`[${request.method}] ${path}`);

  // Routes
  if (path === "/" || path === "") {
    return jsonResponse({ message: "UGC API v1" });
  }

  if (path === "/auth/facebook" && request.method === "GET") {
    return handleFacebookAuth(context);
  }

  // Dev-only: gunakan token statis dari .dev.vars
  if (path === "/auth/facebook/static" && request.method === "GET") {
    return handleStaticAuth(request, context);
  }

  if (path === "/auth/facebook/callback" && request.method === "GET") {
    return handleFacebookCallback(request, context);
  }

  if (path === "/publish/photo" && request.method === "POST") {
    return handlePublishPhoto(request);
  }

  return jsonResponse({ error: "Not found", path }, 404);
};
