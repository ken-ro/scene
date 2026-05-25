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

function isValidOrder(data) {
  const details = data.details || {};
  const requiredValues = [
    details.itemName || data.item,
    details.bodySizeColorQuantity || data.quantity,
    details.usage || data.purpose,
    details.name || data.name,
    details.postalCode,
    details.address,
    details.phone || data.tel,
    details.email || data.email,
    details.deliveryPostalCode,
    details.deliveryAddress,
    details.deliveryName,
    details.deliveryPhone,
    details.uploadMethod,
    details.dataSchedule,
    details.bagging,
    details.useDate,
  ];

  return requiredValues.every(function(value) {
    return Boolean(getText(value));
  });
}

function buildMailBody(data) {
  const details = data.details || {};

  return [
    'ご注文フォームから送信がありました。',
    '',
    '団体名: ' + getValue(details.groupName || data.organization),
    '担当者名: ' + getValue(data.name),
    'メールアドレス: ' + getValue(data.email),
    '電話番号: ' + getValue(data.tel),
    '',
    '1. ご希望商品名',
    getValue(details.itemName || data.item),
    '',
    '2. 商品お届け希望日',
    getValue(details.deliveryRequest),
    '',
    '3. ご希望商品のボディサイズと色、購入数量',
    getValue(details.bodySizeColorQuantity || data.quantity),
    '',
    '4. プリントサイズとプリント位置',
    getValue(details.printSizeAndPosition),
    '',
    '5. プリントカラー',
    getValue(details.printColor),
    '',
    '6. プリント方法',
    getValue(details.printMethod),
    '',
    '7. 使用する用途',
    getValue(details.usage || data.purpose),
    '',
    '8. 会社名、団体名、サークル名',
    getValue(details.groupName),
    '',
    '9. お名前',
    getValue(details.name || data.name),
    '',
    '10. LINE登録名',
    getValue(details.lineName),
    '',
    '11. 郵便番号',
    getValue(details.postalCode),
    '',
    '12. ご住所 / ご注文者様',
    getValue(details.address),
    '',
    '13. 電話番号 / ご注文者様',
    getValue(details.phone || data.tel),
    '',
    '14. 携帯電話 / ご注文者様',
    getValue(details.mobile),
    '',
    '15. FAX / ご注文者様',
    getValue(details.fax),
    '',
    '16. メール / ご注文者様',
    getValue(details.email || data.email),
    '',
    '17. お届け先郵便番号',
    getValue(details.deliveryPostalCode),
    '',
    '18. お届け先のご住所',
    getValue(details.deliveryAddress),
    '',
    '19. お届け先名称',
    getValue(details.deliveryName),
    '',
    '20. お届け先電話番号',
    getValue(details.deliveryPhone),
    '',
    '21. お電話がつながりやすい時間帯',
    getValue(details.goodCallTime),
    '',
    '22. ご入稿方法',
    getValue(details.uploadMethod),
    '',
    '23. データ作成ソフト',
    getValue(details.software),
    '',
    '24. デザインデータご入稿予定日',
    getValue(details.dataSchedule),
    '',
    '25. 個別袋詰め有無',
    getValue(details.bagging),
    '',
    '26. 使用する日',
    getValue(details.useDate),
    '',
    '27. 写真と感想で割引',
    getValue(details.photoDiscount),
    '',
    '28. フリー欄',
    getValue(details.freeMessage),
    '',
    '要約メモ:',
    getValue(data.message),
  ].join('\n');
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

    if (!isValidOrder(data)) {
      return jsonResponse({ ok: false, error: 'missing_required_fields' });
    }

    const subjectParts = ['【scene】ご注文フォーム'];

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
      name: 'scene ご注文フォーム',
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