/// <reference path="../../worker-configuration.d.ts" />
// Pure Pages Functions handler (no Hono - work around Hono + Pages routing bug)

type Bindings = {
  FB_STATIC_TOKEN?: string; // Token statis dari Meta Graph API Explorer / Token Generator
  FB_PAGE_USERNAME?: string; // Username Facebook Page (misal: sapmahanura10)
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

/**
 * Fetch page detail dari Graph API pakai FB_STATIC_TOKEN + FB_PAGE_USERNAME.
 * Return payload siap-pakai atau null jika gagal.
 *
 * Env di .dev.vars:
 *   - FB_STATIC_TOKEN     : System/User access token
 *   - FB_PAGE_USERNAME    : Username publik page (untuk endpoint Graph API)
 */
async function fetchPagePayload(c: { env: Bindings }) {
  const token = c.env.FB_STATIC_TOKEN;
  if (!token || token.trim() === "") {
    return { error: "FB_STATIC_TOKEN belum diisi di .dev.vars" };
  }

  const username = c.env.FB_PAGE_USERNAME || "sapmahanura10";

  const detailRes = await fetch(
    `https://graph.facebook.com/v25.0/${username}?fields=id,name,access_token,fan_count,instagram_business_account&access_token=${token}`,
  );
  const detail = (await detailRes.json()) as {
    id?: string;
    name?: string;
    access_token?: string;
    fan_count?: number;
    instagram_business_account?: { id: string };
    error?: { message: string; code?: number };
  };

  if (detail.error || !detail.id) {
    return {
      error: `Gagal mengambil detail halaman Facebook untuk ${username}`,
      detail: detail.error?.message || "id tidak ditemukan",
    };
  }

  return {
    payload: {
      page: {
        id: detail.id,
        name: detail.name || username,
        username: username,
        access_token: detail.access_token || token,
      },
      igBusinessId: detail.instagram_business_account?.id || null,
      followers: detail.fan_count ?? 0,
      connectedAt: new Date().toISOString(),
    },
  };
}

/**
 * GET /api/auth/facebook — return JSON payload page.
 * Frontend bisa panggil endpoint ini untuk auto-connect tanpa redirect.
 */
async function handleGetPage(c: { env: Bindings }) {
  const result = await fetchPagePayload(c);
  if ("error" in result) {
    return jsonResponse(result, 400);
  }
  return jsonResponse(result.payload);
}

// ===== ROUTES =====
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

  // GET /api/auth/facebook → return JSON payload
  if (path === "/auth/facebook" && request.method === "GET") {
    return handleGetPage(context);
  }

  if (path === "/publish/photo" && request.method === "POST") {
    return handlePublishPhoto(request);
  }

  return jsonResponse({ error: "Not found", path }, 404);
};

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
