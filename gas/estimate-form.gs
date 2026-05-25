const RECIPIENT_EMAIL = 'info@robinfactory.co.jp';
const AUDIT_EMAIL = '';

function getAuditRecipients() {
  if (!AUDIT_EMAIL || AUDIT_EMAIL === RECIPIENT_EMAIL) {
    return '';
  }

  return AUDIT_EMAIL;
}

function getText(value) {
  return String(value || '').trim();
}

function getValue(value) {
  return getText(value) || '未入力';
}

function buildMailBody(data) {
  return [
    '無料見積フォームからお問い合わせがありました。',
    '',
    '団体名: ' + getValue(data.organization),
    '担当者名: ' + getValue(data.name),
    'メールアドレス: ' + getValue(data.email),
    '電話番号: ' + getValue(data.tel),
    '使用目的: ' + getValue(data.purpose),
    '希望商品: ' + getValue(data.item),
    '枚数: ' + getValue(data.quantity),
    '希望納期: ' + getValue(data.delivery),
    '書類対応: ' + getValue(data.documents),
    '',
    'プリント内容・ご相談内容:',
    getValue(data.message),
  ].join('\n');
}
function isValidEstimate(data) {
  return Boolean(getText(data.name) && getText(data.email) && getText(data.message));
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse((e.postData && e.postData.contents) || '{}');

    if (data._honey) {
      return jsonResponse({ ok: true });
    }

    if (!isValidEstimate(data)) {
      return jsonResponse({ ok: false, error: 'missing_required_fields' });
    }

    const subjectParts = ['【scene】無料見積フォーム'];

    if (data.organization) {
      subjectParts.push(getText(data.organization));
    }

    if (data.name) {
      subjectParts.push(getText(data.name));
    }

    const auditRecipients = getAuditRecipients();
    const mailOptions = {
      to: RECIPIENT_EMAIL,
      replyTo: getText(data.email),
      subject: subjectParts.join(' / '),
      body: buildMailBody(data),
      name: 'scene 無料見積フォーム',
    };

    if (auditRecipients) {
      mailOptions.bcc = auditRecipients;
    }

    MailApp.sendEmail(mailOptions);

    return jsonResponse({ ok: true, auditCopy: Boolean(auditRecipients) });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: 'send_failed',
      message: error.message,
    });
  }
}