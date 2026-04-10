import { resend } from './resend';

const SENDER_EMAIL = 'G R I T <noreply@gritwear.shop>'; 

/**
 * Order Confirmation Protocol
 * Dispatches a detailed receipt to the user after successful order capture.
 */
export async function sendOrderConfirmation(to: string, order: {
  order_number: string;
  total: number;
  items: any[];
}) {
  try {
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #1A2E24;">
          <div style="font-weight: bold; color: #FFFFFF;">${item.name}</div>
          <div style="font-size: 12px; color: #5C7667;">Qty: ${item.quantity}</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #1A2E24; text-align: right; color: #CCDA47;">
          ৳${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to,
      subject: `Order Secured: ${order.order_number}`,
      html: `
        <div style="background-color: #0B2519; color: #FFFFFF; font-family: sans-serif; padding: 40px; max-width: 600px; margin: auto;">
          <h1 style="color: #CCDA47; font-size: 32px; letter-spacing: -1px; text-transform: uppercase;">G R I T</h1>
          <p style="font-size: 18px; color: #A0B3A6;">Deployment confirmed. Your gear is in the queue.</p>
          
          <div style="margin: 40px 0; border: 1px solid #1A2E24; padding: 24px;">
            <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #5C7667; margin-bottom: 8px;">Order Reference</p>
            <p style="font-size: 24px; font-weight: bold; margin: 0;">${order.order_number}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
            ${itemsHtml}
            <tr>
              <td style="padding: 24px 12px; font-weight: bold; text-transform: uppercase;">Total Burden</td>
              <td style="padding: 24px 12px; text-align: right; font-weight: bold; color: #CCDA47; font-size: 20px;">
                ৳${order.total.toFixed(2)}
              </td>
            </tr>
          </table>

          <div style="border-top: 1px solid #1A2E24; padding-top: 24px;">
             <p style="font-size: 14px; line-height: 1.6; color: #A0B3A6;">
               Our team is currently verifying your transaction. Once cleared, you will receive a tracking code via SMS and Email.
             </p>
             <p style="font-size: 12px; color: #5C7667; margin-top: 40px;">
               Effort Over Talent. Endurance Always.
             </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend order confirmation failure:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Email service failure:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Welcome Flow Protocol
 * Dispatches an initialization message to new operatives.
 */
export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to,
      subject: `Welcome to the Arena, ${name}`,
      html: `
        <div style="background-color: #0B2519; color: #FFFFFF; font-family: sans-serif; padding: 40px; max-width: 600px; margin: auto;">
          <h1 style="color: #CCDA47; font-size: 32px; letter-spacing: -1px; text-transform: uppercase;">G R I T</h1>
          <p style="font-size: 20px; color: #FFFFFF;"> operatives ${name}, Welcome.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #A0B3A6;">
            You have successfully initialized your profile. The arena awaits your deployment. 
            Gear up using the technical specifications found in our latest collections.
          </p>
          <div style="margin: 40px 0;">
            <a href="https://www.gritapparel.com/shop" style="background-color: #CCDA47; color: #0B2519; padding: 16px 32px; font-weight: bold; text-decoration: none; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">Deploy Gear</a>
          </div>
          <p style="font-size: 12px; color: #5C7667; margin-top: 40px;">
            No Shortcuts. No Setbacks. Only Grit.
          </p>
        </div>
      `,
    });

    if (error) {
       console.error('Resend welcome email failure:', error);
       return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Email service failure:', err);
    return { success: false, error: err.message };
  }
}
