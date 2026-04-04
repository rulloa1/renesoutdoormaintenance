import type { EventContext } from "@cloudflare/workers-types";

// Only allow visitors from Texas (covers all Houston-area suburbs)
const ALLOWED_COUNTRY = "US";
const ALLOWED_REGION_CODE = "TX";

export async function onRequest(
  context: EventContext<Record<string, unknown>, string, Record<string, unknown>>
) {
  const { request, next } = context;

  // Cloudflare injects geo data on the cf object
  const cf = (request as Request & { cf?: { country?: string; regionCode?: string } }).cf;

  const country = cf?.country ?? "";
  const regionCode = cf?.regionCode ?? "";

  const isAllowed = country === ALLOWED_COUNTRY && regionCode === ALLOWED_REGION_CODE;

  if (!isAllowed) {
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Service Area — Rene's Outdoor Maintenance</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 3rem 2.5rem;
      max-width: 480px;
      text-align: center;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .icon { font-size: 3rem; margin-bottom: 1rem; }
    h1 { font-size: 1.5rem; color: #1a1a1a; margin-bottom: 0.75rem; }
    p { color: #555; line-height: 1.6; font-size: 0.95rem; }
    .highlight { color: #2d7a2d; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🌿</div>
    <h1>We Serve the Houston, TX Area</h1>
    <p>
      Thank you for your interest! <span class="highlight">Rene's Outdoor Maintenance</span>
      currently serves customers in the <strong>Greater Houston, Texas</strong> area only.
    </p>
    <p style="margin-top:1rem;">
      If you're in the Houston area and seeing this by mistake, please try again or
      contact us directly.
    </p>
  </div>
</body>
</html>`,
      {
        status: 403,
        headers: { "Content-Type": "text/html;charset=UTF-8" },
      }
    );
  }

  return next();
}
