import { Resend } from 'resend'
import { siteConfig } from '@/config'

// Resend instance
const resend = new Resend(process.env.RESEND_API_KEY)

// Default from address
const FROM_EMAIL = process.env.EMAIL_FROM || `${siteConfig.name} <noreply@beautyacademy.sk>`

interface EmailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

/**
 * Odošle email cez Resend
 */
export async function sendEmail(options: EmailOptions) {
  const { to, subject, html, replyTo } = options

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      replyTo: replyTo || siteConfig.contact.email,
    })

    if (error) {
      console.error('Email error:', error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

/**
 * Email po úspešnom nákupe kurzu
 */
export async function sendPurchaseConfirmationEmail({
  to,
  customerName,
  courseName,
  courseUrl,
  orderNumber,
  price,
}: {
  to: string
  customerName: string
  courseName: string
  courseUrl: string
  orderNumber?: string
  price: string
}) {
  const amount = price
  const orderId = orderNumber || `ORD-${Date.now()}`
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); padding: 40px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                🎉 Gratulujeme k nákupu!
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">
                Ahoj <strong>${customerName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">
                Ďakujeme za nákup kurzu <strong>${courseName}</strong>! 
                Váš kurz je teraz aktívny a môžete začať študovať.
              </p>
              
              <!-- Order details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">Detaily objednávky:</p>
                    <p style="margin: 0 0 5px; color: #374151; font-size: 14px;">
                      <strong>Číslo objednávky:</strong> ${orderId}
                    </p>
                    <p style="margin: 0 0 5px; color: #374151; font-size: 14px;">
                      <strong>Kurz:</strong> ${courseName}
                    </p>
                    <p style="margin: 0; color: #374151; font-size: 14px;">
                      <strong>Suma:</strong> ${amount}
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${courseUrl}" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 50px;">
                      Začať študovať →
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #374151; font-size: 16px;">
                Ak máte akékoľvek otázky, neváhajte nás kontaktovať.
              </p>
              
              <p style="margin: 20px 0 0; color: #374151; font-size: 16px;">
                S pozdravom,<br>
                <strong>Tím ${siteConfig.name}</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                ${siteConfig.company.legalName}
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                ${siteConfig.contact.address}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  return sendEmail({
    to,
    subject: `✅ Kurz "${courseName}" je aktívny | ${siteConfig.name}`,
    html,
  })
}

/**
 * Uvítací email po registrácii
 */
export async function sendWelcomeEmail({
  to,
  firstName,
}: {
  to: string
  firstName?: string
}) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
  const coursesUrl = `${process.env.NEXT_PUBLIC_APP_URL}/kurzy`
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                👋 Vitajte v ${siteConfig.name}!
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">
                Ahoj${firstName ? ` <strong>${firstName}</strong>` : ''},
              </p>
              
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">
                Ďakujeme za registráciu! Váš účet je teraz aktívny a môžete 
                začať objavovať naše profesionálne kurzy.
              </p>
              
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">
                Čo môžete urobiť teraz:
              </p>
              
              <ul style="margin: 0 0 30px; padding-left: 20px; color: #374151; font-size: 16px;">
                <li style="margin-bottom: 10px;">Prezrite si naše kurzy</li>
                <li style="margin-bottom: 10px;">Vyberte si kurz, ktorý vás zaujíma</li>
                <li>Začnite sa učiť vlastným tempom</li>
              </ul>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${coursesUrl}" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 50px;">
                      Prezrieť kurzy →
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0 0; color: #374151; font-size: 16px;">
                S pozdravom,<br>
                <strong>Tím ${siteConfig.name}</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                ${siteConfig.company.legalName}
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                ${siteConfig.contact.address}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  return sendEmail({
    to,
    subject: `Vitajte v ${siteConfig.name}! 🎉`,
    html,
  })
}

/**
 * Email pre reset hesla
 */
export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string
  resetUrl: string
}) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #374151; padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                🔑 Obnova hesla
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">
                Dostali sme žiadosť o obnovu hesla pre váš účet.
              </p>
              
              <p style="margin: 0 0 30px; color: #374151; font-size: 16px;">
                Kliknite na tlačidlo nižšie pre nastavenie nového hesla:
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${resetUrl}" style="display: inline-block; background-color: #374151; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 50px;">
                      Nastaviť nové heslo
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px;">
                Ak ste o obnovu hesla nežiadali, tento email môžete ignorovať.
                Odkaz je platný 1 hodinu.
              </p>
              
              <p style="margin: 20px 0 0; color: #374151; font-size: 16px;">
                S pozdravom,<br>
                <strong>Tím ${siteConfig.name}</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                ${siteConfig.company.legalName} | ${siteConfig.contact.address}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  return sendEmail({
    to,
    subject: `Obnova hesla | ${siteConfig.name}`,
    html,
  })
}

