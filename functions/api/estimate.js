const RECIPIENT_EMAIL = 'info@robinfactory.co.jp';
const SENDER_EMAIL = 'noreply@scene.robinfactory.co.jp';

function redirectWithStatus(request, status) {
	const url = new URL('/bouhan-vest/estimate/', request.url);
	url.searchParams.set(status, '1');

	return Response.redirect(url.toString(), 303);
}

function getText(formData, key) {
	return String(formData.get(key) ?? '').trim();
}

export async function onRequestPost(context) {
	const { request } = context;
	const formData = await request.formData();

	if (getText(formData, '_honey')) {
		return redirectWithStatus(request, 'sent');
	}

	const payload = {
		organization: getText(formData, 'organization'),
		name: getText(formData, 'name'),
		email: getText(formData, 'email'),
		tel: getText(formData, 'tel'),
		purpose: getText(formData, 'purpose'),
		item: getText(formData, 'item'),
		quantity: getText(formData, 'quantity'),
		message: getText(formData, 'message'),
		delivery: getText(formData, 'delivery'),
		documents: getText(formData, 'documents'),
	};

	if (!payload.name || !payload.email || !payload.message) {
		return redirectWithStatus(request, 'error');
	}

	const subjectParts = ['【scene】無料見積フォーム'];

	if (payload.organization) {
		subjectParts.push(payload.organization);
	}

	if (payload.name) {
		subjectParts.push(payload.name);
	}

	const messageLines = [
		'無料見積フォームからお問い合わせがありました。',
		'',
		`団体名: ${payload.organization || '未入力'}`,
		`担当者名: ${payload.name}`,
		`メールアドレス: ${payload.email}`,
		`電話番号: ${payload.tel || '未入力'}`,
		`使用目的: ${payload.purpose || '未入力'}`,
		`希望商品: ${payload.item || '未入力'}`,
		`枚数: ${payload.quantity || '未入力'}`,
		`希望納期: ${payload.delivery || '未入力'}`,
		`書類対応: ${payload.documents || '未入力'}`,
		'',
		'プリント内容・ご相談内容:',
		payload.message,
	];

	const mailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			personalizations: [
				{
					to: [{ email: RECIPIENT_EMAIL, name: 'Robin Factory' }],
				},
			],
			from: {
				email: SENDER_EMAIL,
				name: 'scene 無料見積フォーム',
			},
			reply_to: {
				email: payload.email,
				name: payload.name,
			},
			subject: subjectParts.join(' / '),
			content: [
				{
					type: 'text/plain',
					value: messageLines.join('\n'),
				},
			],
		}),
	});

	if (!mailResponse.ok) {
		return redirectWithStatus(request, 'error');
	}

	return redirectWithStatus(request, 'sent');
}