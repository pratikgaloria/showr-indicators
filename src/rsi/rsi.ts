import {
  Indicator,
  Dataset,
  getAverageGain,
  getAverageLoss,
} from '@showr/core';

interface IIndicatorParamsRSI {
  attribute: string;
  period: number;
}

export class RSI extends Indicator<IIndicatorParamsRSI> {
  constructor(name: string = 'RSI', params: IIndicatorParamsRSI) {
    super(
      name,
      function(this: RSI, dataset: Dataset) {
        const { attribute, period } = params;
        const flattenDataset = dataset.flatten(attribute);

        const averageGain = getAverageGain(flattenDataset, period) || 0;
        const averageLoss = getAverageLoss(flattenDataset, period) || 0;
        const relativeStrength = isNaN(averageGain / averageLoss)
          ? 0
          : averageGain / averageLoss;

        return 100 - 100 / (1 + relativeStrength);
      },
      {
        params,
      }
    );
  }
}
