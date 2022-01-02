import { Indicator, Dataset } from '@showr/core';
import { getAverageGain } from '../utils';

interface IIndicatorParamsAverageGain {
  attribute?: string;
  period: number;
}

export class AverageGain extends Indicator<IIndicatorParamsAverageGain> {
  constructor(name = 'AverageGain', params: IIndicatorParamsAverageGain) {
    super(
      name,
      function (this: AverageGain, dataset: Dataset) {
        const { attribute, period } = params;
        const datasetLength = dataset.value.length;
        const lastAverageGain = dataset.at(-2)?.getIndicator(this.name);

        if (lastAverageGain && datasetLength > period) {
          const lastQuoteValue = dataset.valueAt(-1, attribute);
          const secondLastQuoteValue = dataset.valueAt(-2, attribute);
          const difference = lastQuoteValue - secondLastQuoteValue;

          const currentGain = difference > 0 ? difference : 0;

          return (lastAverageGain * (period - 1) + currentGain) / period;
        } else {
          const flattenDataset = dataset.flatten(attribute);
          return getAverageGain(flattenDataset, period) || NaN;
        }
      },
      {
        params,
      }
    );
  }
}
