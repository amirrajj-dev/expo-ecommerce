export const WELCOME_EMAIL_HTML = (name: string) => `
<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome • Expo-Ecommerce</title>
</head>

<body style="margin:0;padding:0;background:#0f172a;font-family:Arial,sans-serif;">

  <table width="100%" cellspacing="0" cellpadding="0" style="background:#0f172a;padding:20px 0;">
    <tr>
      <td align="center">
        
        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" 
               style="background:#1e293b;border-radius:16px;overflow:hidden;color:#e2e8f0;">
          
          <!-- Header -->
          <tr>
            <td style="background:#111827;padding:32px;text-align:center;">
              <h1 style="margin:0;color:#f8fafc;font-size:28px;font-weight:700;">
                Welcome to Expo-Ecommerce 🎉
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              
              <h2 style="margin-top:0;font-size:22px;color:#f1f5f9;">
                Hey ${name || 'there'} 👋
              </h2>

              <p style="font-size:16px;line-height:1.6;color:#cbd5e1;">
                We're thrilled to have you join <strong style="color:#fff;">Expo-Ecommerce</strong> —
                your new premium destination for curated products, exclusive deals, and next-level shopping.
              </p>

              <!-- Highlight Box -->
              <div style="
                background:#0f172a;
                padding:20px;
                border-radius:12px;
                margin-top:24px;
                border:1px solid #334155;
                text-align:center;
              ">
                <h3 style="margin:0;color:#38bdf8;font-size:20px;">
                  ✨ Your Perks
                </h3>
                <p style="color:#cbd5e1;margin:8px 0 0;font-size:15px;">
                  Handpicked products • Member-only pricing • Fast delivery • 24/7 support
                </p>
              </div>

              <p style="margin-top:24px;color:#cbd5e1;line-height:1.6;">
                Ready to start exploring? Your next awesome find is waiting for you 👇
              </p>

              <!-- CTA Button -->
              <div style="text-align:center;margin-top:28px;">
                <a href="https://expo-ecommerce-geet.onrender.com"
                   style="
                     display:inline-block;
                     padding:14px 30px;
                     background:#2563eb;
                     color:#ffffff;
                     font-weight:bold;
                     text-decoration:none;
                     border-radius:10px;
                     font-size:16px;
                   ">
                  Start Shopping
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px;text-align:center;background:#111827;color:#64748b;font-size:12px;">
              © ${new Date().getFullYear()} Expo-Ecommerce. All rights reserved.<br/>
              You’re receiving this email because you created an account.
            </td>
          </tr>

        </table>
        <!-- End Card -->

      </td>
    </tr>
  </table>

</body>
</html>
`;
