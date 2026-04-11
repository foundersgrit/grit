/**
 * GRIT Payload Definitions
 * Rigid structural interfaces for automated email telemetry.
 */

export interface WelcomeEmailPayload {
  customer_name?: string;
}

export interface OrderConfirmEmailPayload {
  order_id: string;
  customer_name: string;
  address_line_1: string;
  city: string;
  postal_code: string;
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ShippingEmailPayload {
  order_id: string;
  tracking_number: string;
  courier_name: string;
  estimated_date: string;
  tracking_url: string;
}

export interface AbandonedCartEmailPayload {
  product_name: string;
  size: string;
  color: string;
  price: number;
}

export interface NewsletterEmailPayload {
  Month: string;
  Year: string;
  headline_story_title: string;
  story_intro_paragraph: string;
  story_url: string;
  product_name: string;
  product_description_short: string;
  price: number;
  product_url: string;
  community_member: string;
}

export interface BrandStoryEmailPayload {
  story_headline: string;
  body_paragraph_1: string;
  pull_quote: string;
  body_paragraph_2: string;
  body_paragraph_3: string;
  closing_line: string;
}

/**
 * 01 · Welcome Template
 */
export function getWelcomeEmail(payload: WelcomeEmailPayload) {
  return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#0d1a12;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:600px; background-color:#0A3625; font-family:sans-serif; margin:0 auto;">
        <tr>
          <td style="padding:32px 40px 24px; border-bottom:1px solid #1a4a32;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td>
                  <a href="https://gritwear.shop" style="text-decoration:none; display:inline-block;">
                    <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="background:#CCDA47; width:32px; height:32px; text-align:center; vertical-align:middle;">
                          <span style="font-size:16px; font-weight:900; color:#0A3625; letter-spacing:-1px;">G</span>
                        </td>
                        <td style="padding-left:10px;">
                          <span style="font-size:20px; font-weight:900; color:#ffffff; letter-spacing:6px; text-transform:uppercase;">GRIT</span>
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
                <td align="right" style="font-size:12px; color:#4a7a5a; font-weight:600; vertical-align:middle;">
                  gritwear.shop
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:56px 40px 40px; background-color:#0A3625;">
            <p style="font-size:12px; color:#CCDA47; font-weight:700; letter-spacing:1px; margin:0 0 20px;">
              Welcome to GRIT
            </p>
            <h1 style="font-size:40px; font-weight:900; color:#ffffff; letter-spacing:-1px; line-height:1.1; margin:0 0 24px; text-transform:uppercase;">
              Built for those<br>who stay.
            </h1>
            <p style="font-size:15px; color:#c0d4c8; line-height:1.7; margin:0 0 32px; max-width:440px;">
              Hi ${payload.customer_name || 'Operative'},<br><br>
              You didn't just buy apparel. You chose a standard. GRIT is built for people who show up — through effort, failure, and progress. That's who you are now.
            </p>
            <table cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td style="background-color:#CCDA47;">
                  <a href="https://gritwear.shop" style="display:inline-block; color:#0A3625; font-size:12px; font-weight:900; letter-spacing:1px; text-transform:uppercase; text-decoration:none; padding:14px 32px;">
                    Explore GRIT &rarr;
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 24px; border-top:1px solid #1a4a32;">
            <p style="font-size:12px; color:#CCDA47; font-weight:700; letter-spacing:1px; margin:0 0 24px;">
              What GRIT stands for
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td style="font-size:0; text-align:left;">
                  <div style="display:inline-block; width:100%; max-width:160px; vertical-align:top; margin-bottom:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="padding-right:16px;">
                          <p style="font-size:14px; font-weight:900; color:#ffffff; margin:0 0 6px;">Endurance</p>
                          <p style="font-size:13px; color:#7a9a8a; line-height:1.5; margin:0;">Built to last. Not replaced.</p>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div style="display:inline-block; width:100%; max-width:160px; vertical-align:top; margin-bottom:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="padding-right:16px;">
                          <p style="font-size:14px; font-weight:900; color:#ffffff; margin:0 0 6px;">Effort</p>
                          <p style="font-size:13px; color:#7a9a8a; line-height:1.5; margin:0;">Earned, not given.</p>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div style="display:inline-block; width:100%; max-width:160px; vertical-align:top; margin-bottom:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td>
                          <p style="font-size:14px; font-weight:900; color:#ffffff; margin:0 0 6px;">Community</p>
                          <p style="font-size:13px; color:#7a9a8a; line-height:1.5; margin:0;">Progress isn't solo.</p>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px; background-color:#071e10; border-top:1px solid #1a3a22;">
            <p style="font-size:12px; color:#3a5a44; font-weight:700; margin:0 0 8px;">
              GRIT &middot; gritwear.shop
            </p>
            <p style="font-size:12px; color:#2a4a34; margin:0;">
              <a href="https://gritwear.shop/unsubscribe" style="color:#4a6a54; text-decoration:none;">Unsubscribe</a>
              &nbsp;&middot;&nbsp;
              <a href="https://gritwear.shop/privacy" style="color:#4a6a54; text-decoration:none;">Privacy Policy</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
}

/**
 * 02 · Order Confirmation Template
 */
export function getOrderConfirmEmail(payload: OrderConfirmEmailPayload) {
  return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#0d1a12;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:600px; background-color:#0A3625; font-family:sans-serif; margin:0 auto;">
        <tr>
          <td style="padding:32px 40px 24px; border-bottom:1px solid #1a4a32;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td>
                  <a href="https://gritwear.shop" style="text-decoration:none; display:inline-block;">
                    <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="background:#CCDA47; width:32px; height:32px; text-align:center; vertical-align:middle;">
                          <span style="font-size:16px; font-weight:900; color:#0A3625; letter-spacing:-1px;">G</span>
                        </td>
                        <td style="padding-left:10px;">
                          <span style="font-size:20px; font-weight:900; color:#ffffff; letter-spacing:6px; text-transform:uppercase;">GRIT</span>
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
                <td align="right" style="font-size:12px; color:#4a7a5a; font-weight:600; vertical-align:middle;">
                  Order confirmed
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:48px 40px 32px;">
            <p style="font-size:12px; color:#CCDA47; font-weight:700; letter-spacing:1px; margin:0 0 12px;">
              Confirmed
            </p>
            <h1 style="font-size:32px; font-weight:900; color:#ffffff; letter-spacing:-0.5px; line-height:1.15; margin:0 0 16px; text-transform:uppercase;">
              Your order<br>is in motion.
            </h1>
            <p style="font-size:14px; color:#c0d4c8; line-height:1.7; margin:0 0 8px;">
              Order <strong style="color:#CCDA47;">#${payload.order_id}</strong> has been received and is being prepared.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border:1px solid #1a4a32;">
              <tr style="background:#071e10;">
                <td style="padding:12px 16px; font-size:12px; font-weight:700; color:#CCDA47; letter-spacing:1px;">Product</td>
                <td style="padding:12px 16px; font-size:12px; font-weight:700; color:#CCDA47; letter-spacing:1px; text-align:center;">Qty</td>
                <td style="padding:12px 16px; font-size:12px; font-weight:700; color:#CCDA47; letter-spacing:1px; text-align:right;">Price</td>
              </tr>
              <tr style="border-top:1px solid #1a4a32;">
                <td style="padding:16px; font-size:14px; font-weight:600; color:#ffffff;">
                  ${payload.product_name}<br>
                  <span style="font-size:12px; font-weight:400; color:#7a9a8a; line-height:1.6;">Size: ${payload.size} &middot; Color: ${payload.color}</span>
                </td>
                <td style="padding:16px; font-size:14px; font-weight:600; color:#ffffff; text-align:center; vertical-align:top;">${payload.quantity}</td>
                <td style="padding:16px; font-size:14px; font-weight:600; color:#ffffff; text-align:right; vertical-align:top;">BDT ${payload.price}</td>
              </tr>
              <tr style="border-top:1px solid #1a4a32; background:#071e10;">
                <td colspan="2" style="padding:14px 16px; font-size:13px; font-weight:700; color:#ffffff;">Total</td>
                <td style="padding:14px 16px; font-size:15px; font-weight:900; color:#CCDA47; text-align:right;">BDT ${payload.total}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 32px;">
            <p style="font-size:12px; color:#CCDA47; font-weight:700; letter-spacing:1px; margin:0 0 10px;">
              Shipping to
            </p>
            <p style="font-size:14px; color:#c0d4c8; line-height:1.7; margin:0;">
              ${payload.customer_name}<br>
              ${payload.address_line_1}<br>
              ${payload.city}, ${payload.postal_code}
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 48px;">
            <a href="https://gritwear.shop/orders/${payload.order_id}" style="font-size:12px; font-weight:900; color:#CCDA47; letter-spacing:1px; text-transform:uppercase; text-decoration:none; border-bottom:1px solid #CCDA47; padding-bottom:2px;">
              View order details &rarr;
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px; background-color:#071e10; border-top:1px solid #1a3a22;">
            <p style="font-size:12px; color:#3a5a44; font-weight:700; margin:0 0 8px;">
              GRIT &middot; gritwear.shop
            </p>
            <p style="font-size:12px; color:#2a4a34; margin:0;">
              Questions? <a href="mailto:support@gritwear.shop" style="color:#4a6a54; text-decoration:none;">support@gritwear.shop</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
}

/**
 * 03 · Shipping Update Template
 */
export function getShippingEmail(payload: ShippingEmailPayload) {
  return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#0d1a12;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:600px; background-color:#0A3625; font-family:sans-serif; margin:0 auto;">
        <tr>
          <td style="padding:32px 40px 24px; border-bottom:1px solid #1a4a32;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td>
                  <a href="https://gritwear.shop" style="text-decoration:none; display:inline-block;">
                    <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="background:#CCDA47; width:32px; height:32px; text-align:center; vertical-align:middle;">
                          <span style="font-size:16px; font-weight:900; color:#0A3625; letter-spacing:-1px;">G</span>
                        </td>
                        <td style="padding-left:10px;">
                          <span style="font-size:20px; font-weight:900; color:#ffffff; letter-spacing:6px; text-transform:uppercase;">GRIT</span>
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
                <td align="right" style="font-size:12px; color:#4a7a5a; font-weight:600; vertical-align:middle;">
                  Shipping update
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:48px 40px 32px;">
            <p style="font-size:12px; color:#CCDA47; font-weight:700; letter-spacing:1px; margin:0 0 12px;">
              On its way
            </p>
            <h1 style="font-size:32px; font-weight:900; color:#ffffff; letter-spacing:-0.5px; line-height:1.15; margin:0 0 16px; text-transform:uppercase;">
              Your order<br>is moving.
            </h1>
            <p style="font-size:14px; color:#c0d4c8; line-height:1.7; margin:0;">
              Order <strong style="color:#CCDA47;">#${payload.order_id}</strong> has been dispatched. Tracking below.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td style="width:25%; text-align:center; padding-bottom:8px;">
                  <div style="width:100%; height:3px; background:#CCDA47; margin-bottom:8px;"></div>
                  <p style="font-size:10px; font-weight:700; color:#CCDA47; letter-spacing:1px; margin:0;">Packed</p>
                </td>
                <td style="width:25%; text-align:center; padding-bottom:8px;">
                  <div style="width:100%; height:3px; background:#CCDA47; margin-bottom:8px;"></div>
                  <p style="font-size:10px; font-weight:700; color:#CCDA47; letter-spacing:1px; margin:0;">Dispatched</p>
                </td>
                <td style="width:25%; text-align:center; padding-bottom:8px;">
                  <div style="width:100%; height:3px; background:#1a4a32; margin-bottom:8px;"></div>
                  <p style="font-size:10px; font-weight:700; color:#4a7a5a; letter-spacing:1px; margin:0;">In transit</p>
                </td>
                <td style="width:25%; text-align:center; padding-bottom:8px;">
                  <div style="width:100%; height:3px; background:#1a4a32; margin-bottom:8px;"></div>
                  <p style="font-size:10px; font-weight:700; color:#4a7a5a; letter-spacing:1px; margin:0;">Delivered</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border:1px solid #1a4a32;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="font-size:12px; font-weight:700; color:#CCDA47; letter-spacing:1px; margin:0 0 6px;">Tracking number</p>
                  <p style="font-size:18px; font-weight:900; color:#ffffff; letter-spacing:1px; margin:0 0 16px;">${payload.tracking_number}</p>
                  <p style="font-size:12px; font-weight:700; color:#CCDA47; letter-spacing:1px; margin:0 0 6px;">Courier</p>
                  <p style="font-size:14px; font-weight:600; color:#c0d4c8; margin:0 0 16px;">${payload.courier_name}</p>
                  <p style="font-size:12px; font-weight:700; color:#CCDA47; letter-spacing:1px; margin:0 0 6px;">Estimated delivery</p>
                  <p style="font-size:14px; font-weight:600; color:#c0d4c8; margin:0;">${payload.estimated_date}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 48px;">
            <table cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td>
                  <a href="${payload.tracking_url}" style="display:inline-block; border:1px solid #CCDA47; color:#CCDA47; font-size:12px; font-weight:900; letter-spacing:1px; text-transform:uppercase; text-decoration:none; padding:12px 28px;">
                    Track your order &rarr;
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px; background-color:#071e10; border-top:1px solid #1a3a22;">
            <p style="font-size:12px; color:#3a5a44; font-weight:700; margin:0 0 8px;">
              GRIT &middot; gritwear.shop
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
}

/**
 * 04 · Abandoned Cart Template
 */
export function getAbandonedCartEmail(payload: AbandonedCartEmailPayload) {
  return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#0d1a12;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:600px; background-color:#0A4A3C; font-family:sans-serif; margin:0 auto;">
        <tr>
          <td style="padding:32px 40px 24px; border-bottom:1px solid #1a5a4c;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td>
                  <a href="https://gritwear.shop" style="text-decoration:none; display:inline-block;">
                    <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="background:#CCDA47; width:32px; height:32px; text-align:center; vertical-align:middle;">
                          <span style="font-size:16px; font-weight:900; color:#0A3625; letter-spacing:-1px;">G</span>
                        </td>
                        <td style="padding-left:10px;">
                          <span style="font-size:20px; font-weight:900; color:#ffffff; letter-spacing:6px; text-transform:uppercase;">GRIT</span>
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:56px 40px 32px; background-color:#0A4A3C;">
            <p style="font-size:12px; color:#CCDA47; font-weight:700; letter-spacing:1px; margin:0 0 12px;">
              You left something behind
            </p>
            <h1 style="font-size:36px; font-weight:900; color:#ffffff; letter-spacing:-1px; line-height:1.1; margin:0 0 20px; text-transform:uppercase;">
              The work<br>doesn't wait.
            </h1>
            <p style="font-size:15px; color:#c0d8d0; line-height:1.7; margin:0 0 32px; max-width:420px;">
              You chose this for a reason. Discipline means finishing what you started.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border:1px solid #1a5a4c;">
              <tr>
                <td style="padding:16px; vertical-align:middle; width:80px;">
                  <div style="width:72px; height:72px; background:#071e10; display:flex; align-items:center; justify-content:center; text-align:center; line-height:72px;">
                    <span style="font-size:10px; color:#3a6a5a; font-weight:700; letter-spacing:1px;">IMG</span>
                  </div>
                </td>
                <td style="padding:16px; vertical-align:middle;">
                  <p style="font-size:15px; font-weight:900; color:#ffffff; margin:0 0 4px;">${payload.product_name}</p>
                  <p style="font-size:12px; color:#6a9a8a; margin:0 0 8px;">Size: ${payload.size} &middot; Color: ${payload.color}</p>
                  <p style="font-size:16px; font-weight:900; color:#CCDA47; margin:0;">BDT ${payload.price}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 56px;">
            <table cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td style="background-color:#CCDA47;">
                  <a href="https://gritwear.shop/cart" style="display:inline-block; color:#0A3625; font-size:12px; font-weight:900; letter-spacing:1px; text-transform:uppercase; text-decoration:none; padding:14px 36px;">
                    Complete your order &rarr;
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px; background-color:#061510; border-top:1px solid #1a3a2a;">
            <p style="font-size:12px; color:#3a5a44; font-weight:700; margin:0 0 8px;">
              GRIT &middot; gritwear.shop
            </p>
            <p style="font-size:12px; color:#2a4a34; margin:0;">
              <a href="https://gritwear.shop/unsubscribe" style="color:#4a6a54; text-decoration:none;">Unsubscribe</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
}

/**
 * 05 · Newsletter Template
 */
export function getNewsletterEmail(payload: NewsletterEmailPayload) {
  return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#0d1a12;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:600px; background-color:#0A3625; font-family:sans-serif; margin:0 auto;">
        <tr>
          <td style="padding:32px 40px 24px; border-bottom:1px solid #1a4a32;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td>
                  <a href="https://gritwear.shop" style="text-decoration:none; display:inline-block;">
                    <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="background:#CCDA47; width:32px; height:32px; text-align:center; vertical-align:middle;">
                          <span style="font-size:16px; font-weight:900; color:#0A3625; letter-spacing:-1px;">G</span>
                        </td>
                        <td style="padding-left:10px;">
                          <span style="font-size:20px; font-weight:900; color:#ffffff; letter-spacing:6px; text-transform:uppercase;">GRIT</span>
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
                <td align="right" style="font-size:12px; color:#4a7a5a; font-weight:600; vertical-align:middle;">
                  ${payload.Month} ${payload.Year}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#071e10; padding:48px 40px 40px;">
            <p style="font-size:12px; color:#F2B759; font-weight:700; letter-spacing:1px; margin:0 0 16px;">
              Effort counts twice
            </p>
            <h1 style="font-size:38px; font-weight:900; color:#ffffff; letter-spacing:-1px; line-height:1.1; margin:0 0 20px; text-transform:uppercase;">
              ${payload.headline_story_title}
            </h1>
            <p style="font-size:15px; color:#8aaa9a; line-height:1.8; margin:0 0 28px; max-width:460px;">
              ${payload.story_intro_paragraph}
            </p>
            <table cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td style="background-color:#F2B759;">
                  <a href="${payload.story_url}" style="display:inline-block; color:#0A3625; font-size:11px; font-weight:900; letter-spacing:1px; text-transform:uppercase; text-decoration:none; padding:12px 28px;">
                    Read the story &rarr;
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height:1px; background:#1a4a32;"></td></tr>
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="font-size:12px; color:#CCDA47; font-weight:700; letter-spacing:1px; margin:0 0 20px;">
              New drop
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td style="font-size:0; text-align:left;">
                  <div style="display:inline-block; width:100%; max-width:200px; vertical-align:top; margin-bottom:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="padding-right:24px;">
                          <div style="width:100%; height:200px; background:#071e10; text-align:center; line-height:200px;">
                            <span style="font-size:10px; color:#3a5a44; font-weight:700; letter-spacing:1px; vertical-align:middle; line-height:normal; display:inline-block;">IMG</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div style="display:inline-block; width:100%; max-width:300px; vertical-align:top; margin-bottom:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="padding-top:8px;">
                          <h2 style="font-size:20px; font-weight:900; color:#ffffff; letter-spacing:-0.5px; text-transform:uppercase; margin:0 0 8px;">${payload.product_name}</h2>
                          <p style="font-size:14px; color:#7a9a8a; line-height:1.7; margin:0 0 16px;">${payload.product_description_short}</p>
                          <p style="font-size:18px; font-weight:900; color:#CCDA47; margin:0 0 20px;">BDT ${payload.price}</p>
                          <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                            <tr>
                              <td>
                                <a href="${payload.product_url}" style="display:inline-block; border:1px solid #CCDA47; color:#CCDA47; font-size:11px; font-weight:900; letter-spacing:1px; text-transform:uppercase; text-decoration:none; padding:10px 22px;">
                                  Shop now
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 48px; background:#071e10;">
            <p style="font-size:12px; color:#4a7a5a; font-weight:700; letter-spacing:1px; margin:0 0 16px;">
              From the community
            </p>
            <p style="font-size:22px; font-weight:600; color:#ffffff; line-height:1.4; margin:0 0 12px;">
              "Progress isn't loud. It's consistent."
            </p>
            <p style="font-size:13px; color:#F2B759; margin:0;">
              — ${payload.community_member}, GRIT Community
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px; background-color:#040f08; border-top:1px solid #1a3a22;">
            <p style="font-size:12px; color:#3a5a44; font-weight:700; margin:0 0 8px;">
              GRIT &middot; gritwear.shop
            </p>
            <p style="font-size:12px; color:#2a4a34; margin:0;">
              <a href="https://gritwear.shop/unsubscribe" style="color:#4a6a54; text-decoration:none;">Unsubscribe</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
}

/**
 * 06 · Brand Story Template
 */
export function getBrandStoryEmail(payload: BrandStoryEmailPayload) {
  return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#0d1a12;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:600px; background-color:#0A3625; font-family:sans-serif; margin:0 auto;">
        <tr>
          <td style="padding:32px 40px 24px; border-bottom:1px solid #1a4a32;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td>
                  <a href="https://gritwear.shop" style="text-decoration:none; display:inline-block;">
                    <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="background:#CCDA47; width:32px; height:32px; text-align:center; vertical-align:middle;">
                          <span style="font-size:16px; font-weight:900; color:#0A3625; letter-spacing:-1px;">G</span>
                        </td>
                        <td style="padding-left:10px;">
                          <span style="font-size:20px; font-weight:900; color:#ffffff; letter-spacing:6px; text-transform:uppercase;">GRIT</span>
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:56px 40px 0;">
            <p style="font-size:12px; color:#CCDA47; font-weight:700; letter-spacing:1px; margin:0 0 20px;">
              From GRIT
            </p>
            <h1 style="font-size:34px; font-weight:900; color:#ffffff; letter-spacing:-0.5px; line-height:1.15; margin:0 0 32px; text-transform:uppercase;">
              ${payload.story_headline}
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 32px;">
            <p style="font-size:16px; color:#c0d4c8; line-height:1.8; margin:0 0 20px;">
              ${payload.body_paragraph_1}
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:28px 0;">
              <tr>
                <td style="border-left:3px solid #F2B759; padding:4px 20px;">
                  <p style="font-size:20px; font-weight:600; color:#F2B759; line-height:1.5; margin:0;">
                    "${payload.pull_quote}"
                  </p>
                </td>
              </tr>
            </table>
            <p style="font-size:16px; color:#c0d4c8; line-height:1.8; margin:0 0 20px;">
              ${payload.body_paragraph_2}
            </p>
            <p style="font-size:16px; color:#c0d4c8; line-height:1.8; margin:0;">
              ${payload.body_paragraph_3}
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px; background:#071e10;">
            <p style="font-size:12px; color:#4a7a5a; font-weight:700; letter-spacing:1px; margin:0 0 20px;">
              What we stand by
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td style="padding-bottom:16px; border-bottom:1px solid #1a3a22; vertical-align:top;">
                  <p style="font-size:13px; font-weight:900; color:#CCDA47; margin:0 0 6px;">Endurance</p>
                  <p style="font-size:14px; color:#6a8a7a; margin:0; line-height:1.6;">Products last. Values last. Community lasts.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 0; border-bottom:1px solid #1a3a22; vertical-align:top;">
                  <p style="font-size:13px; font-weight:900; color:#CCDA47; margin:0 0 6px;">Authenticity</p>
                  <p style="font-size:14px; color:#6a8a7a; margin:0; line-height:1.6;">No hype. No stock photos. No trend-chasing.</p>
                </td>
              </tr>
              <tr>
                <td style="padding-top:16px; vertical-align:top;">
                  <p style="font-size:13px; font-weight:900; color:#CCDA47; margin:0 0 6px;">Community</p>
                  <p style="font-size:14px; color:#6a8a7a; margin:0; line-height:1.6;">Inclusive of the committed. Built to compound.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 48px;">
            <p style="font-size:16px; color:#c0d4c8; line-height:1.8; margin:0 0 28px;">
              ${payload.closing_line}
            </p>
            <a href="https://gritwear.shop/community" style="font-size:13px; font-weight:900; color:#CCDA47; letter-spacing:1px; text-transform:uppercase; text-decoration:none; border-bottom:1px solid #CCDA47; padding-bottom:2px;">
              Join the community &rarr;
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px; background-color:#040f08; border-top:1px solid #1a3a22;">
            <p style="font-size:13px; font-weight:900; color:#CCDA47; letter-spacing:2px; text-transform:uppercase; margin:0 0 12px;">
              BUILT FOR THOSE WHO STAY.
            </p>
            <p style="font-size:12px; color:#3a5a44; font-weight:700; margin:0 0 8px;">
              gritwear.shop
            </p>
            <p style="font-size:12px; color:#2a4a34; margin:0;">
              <a href="https://gritwear.shop/unsubscribe" style="color:#4a6a54; text-decoration:none;">Unsubscribe</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
}
