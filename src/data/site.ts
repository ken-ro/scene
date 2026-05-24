export const siteOrigin = 'https://scene.robinfactory.co.jp';

export const sectionPaths = {
	home: '/jichikai/',
	items: '/jichikai/items/',
	guide: '/jichikai/guide/',
	estimate: '/jichikai/estimate/',
	privacy: '/jichikai/privacy/',
} as const;

export const sceneEntries = [
	{
		slug: 'jichikai',
		label: '自治会・防犯ベスト',
		href: sectionPaths.home,
		status: '公開中',
		description: '防犯パトロール、見守り隊、自治会・町内会向けの名入れベスト案内です。',
	},
	{
		slug: 'senkyo',
		label: '選挙向けページ',
		href: '/senkyo/',
		status: '準備中',
		description: '選挙スタッフ向けウェア案内は、この親プロジェクトに追加していきます。',
	},
	{
		slug: 'shouboudan',
		label: '消防団向けページ',
		href: '/shouboudan/',
		status: '準備中',
		description: '消防団・防災訓練向けの案内も同じ管理配下に増やせます。',
	},
	{
		slug: 'seisou-volunteer',
		label: '清掃ボランティア向けページ',
		href: '/seisou-volunteer/',
		status: '準備中',
		description: '地域清掃やボランティア活動向けの特化ページを今後追加する想定です。',
	},
];