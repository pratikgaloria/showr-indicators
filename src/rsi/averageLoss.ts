import { Indicator, Dataset } from '@showr/core';
import { getAverageLoss } from '../utils';

interface IIndicatorParamsAverageLoss {
  attribute?: string;
  period: number;
}

export class AverageLoss extends Indicator<IIndicatorParamsAverageLoss> {
  constructor(name = 'AverageLoss', params: IIndicatorParamsAverageLoss) {
    super(
      name,
      function (this: AverageLoss, dataset: Dataset) {
        const { attribute, period } = params;
        const datasetLength = dataset.value.length;
        const lastAverageLoss = dataset.at(-2)?.getIndicator(this.name);

        if (lastAverageLoss && datasetLength > period) {
          const lastQuoteValue = dataset.valueAt(-1, attribute);
          const secondLastQuoteValue = dataset.valueAt(-2, attribute);
          const difference = lastQuoteValue - secondLastQuoteValue;

          const currentLoss = difference < 0 ? -difference : 0;

          return (lastAverageLoss * (period - 1) + currentLoss) / period;
        } else {
          const flattenDataset = dataset.flatten(attribute);
          return getAverageLoss(flattenDataset, period) || NaN;
        }
      },
      {
        params,
      }
    );
  }
}
