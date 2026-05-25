const DEFAULT_ORDER_GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbz-kqJxo6JJ-kikA_nVqCWG7soLDDB-Z8wNzsohXrNZ-4OGqXZ1WLkdS0x_GrxYzg4HhA/exec';

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

function getOrderGasEndpoint(context) {
	return context.env?.ORDER_GAS_ENDPOINT || DEFAULT_ORDER_GAS_ENDPOINT;
}

function buildOrderMessage(fields) {
	return [
		'ご注文フォームから送信がありました。',
		'',
		'1. ご希望商品名',
		fields.itemName || '未入力',
		'',
		'2. 商品お届け希望日',
		fields.deliveryRequest || '未入力',
		'',
		'3. ご希望商品のボディサイズと色、購入数量',
		fields.bodySizeColorQuantity || '未入力',
		'',
		'4. プリントサイズとプリント位置',
		fields.printSizeAndPosition || '未入力',
		'',
		'5. プリントカラー',
		fields.printColor || '未入力',
		'',
		'6. プリント方法',
		fields.printMethod || '未入力',
		'',
		'7. 使用する用途',
		fields.usage || '未入力',
		'',
		'8. 会社名、団体名、サークル名',
		fields.groupName || '未入力',
		'',
		'9. お名前',
		fields.name || '未入力',
		'',
		'10. LINE登録名',
		fields.lineName || '未入力',
		'',
		'11. 郵便番号',
		fields.postalCode || '未入力',
		'',
		'12. ご住所 / ご注文者様',
		fields.address || '未入力',
		'',
		'13. 電話番号 / ご注文者様',
		fields.phone || '未入力',
		'',
		'14. 携帯電話 / ご注文者様',
		fields.mobile || '未入力',
		'',
		'15. FAX / ご注文者様',
		fields.fax || '未入力',
		'',
		'16. メール / ご注文者様',
		fields.email || '未入力',
		'',
		'17. お届け先郵便番号',
		fields.deliveryPostalCode || '未入力',
		'',
		'18. お届け先のご住所',
		fields.deliveryAddress || '未入力',
		'',
		'19. お届け先名称',
		fields.deliveryName || '未入力',
		'',
		'20. お届け先電話番号',
		fields.deliveryPhone || '未入力',
		'',
		'21. お電話がつながりやすい時間帯',
		fields.goodCallTime || '未入力',
		'',
		'22. ご入稿方法',
		fields.uploadMethod || '未入力',
		'',
		'23. データ作成ソフト',
		fields.software || '未入力',
		'',
		'24. デザインデータご入稿予定日',
		fields.dataSchedule || '未入力',
		'',
		'25. 個別袋詰め有無',
		fields.bagging || '未入力',
		'',
		'26. 使用する日',
		fields.useDate || '未入力',
		'',
		'27. 写真と感想で割引',
		fields.photoDiscount || '未入力',
		'',
		'28. フリー欄',
		fields.freeMessage || '未入力',
	].join('\n');
}

export async function onRequestPost(context) {
	const { request } = context;
	const formData = await request.formData();
	const gasEndpoint = getOrderGasEndpoint(context);

	if (getText(formData, '_honey')) {
		return redirectTo(request, '/bouhan-vest/order/thanks/');
	}

	const fields = {
		itemName: getText(formData, 'itemName'),
		deliveryRequest: getText(formData, 'deliveryRequest'),
		bodySizeColorQuantity: getText(formData, 'bodySizeColorQuantity'),
		printSizeAndPosition: getText(formData, 'printSizeAndPosition'),
		printColor: getText(formData, 'printColor'),
		printMethod: getText(formData, 'printMethod'),
		usage: getText(formData, 'usage'),
		groupName: getText(formData, 'groupName'),
		name: getText(formData, 'name'),
		lineName: getText(formData, 'lineName'),
		postalCode: getText(formData, 'postalCode'),
		address: getText(formData, 'address'),
		phone: getText(formData, 'phone'),
		mobile: getText(formData, 'mobile'),
		fax: getText(formData, 'fax'),
		email: getText(formData, 'email'),
		deliveryPostalCode: getText(formData, 'deliveryPostalCode'),
		deliveryAddress: getText(formData, 'deliveryAddress'),
		deliveryName: getText(formData, 'deliveryName'),
		deliveryPhone: getText(formData, 'deliveryPhone'),
		goodCallTime: getText(formData, 'goodCallTime'),
		uploadMethod: getText(formData, 'uploadMethod'),
		software: getText(formData, 'software'),
		dataSchedule: getText(formData, 'dataSchedule'),
		bagging: getText(formData, 'bagging'),
		useDate: getText(formData, 'useDate'),
		photoDiscount: getText(formData, 'photoDiscount'),
		freeMessage: getText(formData, 'freeMessage'),
	};

	const requiredValues = [
		fields.itemName,
		fields.bodySizeColorQuantity,
		fields.usage,
		fields.name,
		fields.postalCode,
		fields.address,
		fields.phone,
		fields.email,
		fields.deliveryPostalCode,
		fields.deliveryAddress,
		fields.deliveryName,
		fields.deliveryPhone,
		fields.uploadMethod,
		fields.dataSchedule,
		fields.bagging,
		fields.useDate,
	];

	if (requiredValues.some((value) => !value)) {
		return redirectTo(request, '/bouhan-vest/order/', 'error');
	}

	const organization = fields.groupName ? `【ご注文フォーム】 ${fields.groupName}` : '【ご注文フォーム】';
	const payload = {
		organization,
		name: fields.name,
		email: fields.email,
		tel: fields.phone,
		purpose: fields.usage,
		item: fields.itemName,
		quantity: fields.bodySizeColorQuantity,
		delivery: [fields.deliveryRequest, fields.useDate].filter(Boolean).join(' / '),
		documents: [fields.uploadMethod, fields.bagging].filter(Boolean).join(' / '),
		details: fields,
		message: buildOrderMessage(fields),
	};

	if (!gasEndpoint) {
		return redirectTo(request, '/bouhan-vest/order/', 'error');
	}

	const gasResponse = await fetch(gasEndpoint, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	if (!gasResponse.ok) {
		return redirectTo(request, '/bouhan-vest/order/', 'error');
	}

	const result = await gasResponse.json().catch(() => null);

	if (!result?.ok) {
		return redirectTo(request, '/bouhan-vest/order/', 'error');
	}

	return redirectTo(request, '/bouhan-vest/order/thanks/');
}