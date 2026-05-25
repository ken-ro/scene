const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyT6TwkszoUD1CYoluPkMUy-dcmEcI1-R2gdAioHqqZWiiCk32Jgvcn5_wZHyBkcLVd/exec';

function redirectTo(request, path, status) {
	const url = new URL(path, request.url);

	if (status) {
		url.searchParams.set(status, '1');
	}

	return Response.redirect(url.toString(), 303);
}

function getText(formData, key) {
	return String(formData.get(key) ?? '').trim();
}

export async function onRequestPost(context) {
	const { request } = context;
	const formData = await request.formData();

	if (getText(formData, '_honey')) {
		return redirectTo(request, '/bouhan-vest/estimate/thanks/');
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
		return redirectTo(request, '/bouhan-vest/estimate/', 'validation');
	}

	const gasResponse = await fetch(GAS_ENDPOINT, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	if (!gasResponse.ok) {
		return redirectTo(request, '/bouhan-vest/estimate/', 'gas-http');
	}

	const result = await gasResponse.json().catch(() => null);

	if (!result?.ok) {
		return redirectTo(request, '/bouhan-vest/estimate/', 'gas-response');
	}

	return redirectTo(request, '/bouhan-vest/estimate/thanks/');
}