const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyT6TwkszoUD1CYoluPkMUy-dcmEcI1-R2gdAioHqqZWiiCk32Jgvcn5_wZHyBkcLVd/exec';

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
		return redirectWithStatus(request, 'validation');
	}

	const gasResponse = await fetch(GAS_ENDPOINT, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	if (!gasResponse.ok) {
		return redirectWithStatus(request, 'gas-http');
	}

	const result = await gasResponse.json().catch(() => null);

	if (!result?.ok) {
		return redirectWithStatus(request, 'gas-response');
	}

	return redirectWithStatus(request, 'sent');
}