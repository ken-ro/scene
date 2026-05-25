export const siteOrigin = 'https://scene.robinfactory.co.jp';

export const sectionPaths = {
	home: '/bouhan-vest/',
	items: '/bouhan-vest/items/',
	guide: '/bouhan-vest/guide/',
	estimate: '/bouhan-vest/estimate/',
	estimateThanks: '/bouhan-vest/estimate/thanks/',
	order: '/bouhan-vest/order/',
	orderThanks: '/bouhan-vest/order/thanks/',
	privacy: '/bouhan-vest/privacy/',
	terms: '/bouhan-vest/terms/',
} as const;

export const futureScenePaths = {
	senkyoBlouson: '/senkyo-blouson/',
	shouboudan: '/shouboudan/',
} as const;

export const sceneEntries = [
	{
		slug: 'bouhan-vest',
		label: '自治会・防犯ベスト',
		href: sectionPaths.home,
		status: '公開中',
		description: '防犯パトロール、見守り隊、自治会・町内会向けの名入れベスト案内です。',
	},
	{
		slug: 'senkyo-blouson',
		label: '選挙ブルゾン・ジャンパー',
		href: futureScenePaths.senkyoBlouson,
		status: '準備中',
		description: '選挙活動用ブルゾン・ジャンパーの名入れプリント案内を、この配下で構築していきます。',
	},
	{
		slug: 'shouboudan',
		label: '消防団・防災活動ベスト',
		href: futureScenePaths.shouboudan,
		status: '準備中',
		description: '消防団名入りベスト、防災活動ビブスの案内も同じ親プロジェクト配下で増やしていきます。',
	},
];