import config from '../config';

const metricsSampleThreshold = Math.random();

export default function inSample(sampleSize) {
	return typeof sampleSize === 'undefined' || config.disableMetricsSampling || sampleSize > metricsSampleThreshold;
}


