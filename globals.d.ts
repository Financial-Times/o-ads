interface Window {
	googletag: {
		cmd?: any[];
		apiReady?: boolean;
		pubadsReady?: boolean;
		pubads?: () => {
			updateCorrelator: () => void;
			clearTargeting: () => void;
			addEventListener: (eventId: string, cb: Function) => void;
			refresh: (slots: any[]) => void;
		};
	};
}

type GPTEvent = {
	detail?: {
		size: [number, number];
		targeting: {};
		slot: {
			gpt: {
                iframe: any;
				slot: any
			};
		};
	};
};
