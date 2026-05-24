const RECIPIENT_EMAIL = 'info@robinfactory.co.jp';
const SUBJECT_PREFIX = '【scene】無料見積フォーム';

function buildMailBody(data) {
  return [
    '無料見積フォームからお問い合わせがありました。',
    '',
    '団体名: ' + (data.organization || '未入力'),
    '担当者名: ' + (data.name || '未入力'),
    'メールアドレス: ' + (data.email || '未入力'),
    '電話番号: ' + (data.tel || '未入力'),
    '使用目的: ' + (data.purpose || '未入力'),
    '希望商品: ' + (data.item || '未入力'),
    '枚数: ' + (data.quantity || '未入力'),
    '希望納期: ' + (data.delivery || '未入力'),
    '書類対応: ' + (data.documents || '未入力'),
    '',
    'プリント内容・ご相談内容:',
    data.message || '未入力',
  ].join('\n');
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');

    if (data._honey) {
      return jsonResponse({ ok: true });
    }

    if (!data.name || !data.email || !data.message) {
      return jsonResponse({ ok: false, error: 'missing_required_fields' });
    }

    const subjectParts = [SUBJECT_PREFIX];

    if (data.organization) {
      subjectParts.push(data.organization);
    }

    if (data.name) {
      subjectParts.push(data.name);
    }

    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      replyTo: data.email,
      subject: subjectParts.join(' / '),
      body: buildMailBody(data),
      name: 'scene 無料見積フォーム',
    });

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: 'send_failed',
      message: error.message,
    });
  }
}