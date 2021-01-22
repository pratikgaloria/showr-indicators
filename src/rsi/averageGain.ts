import { Indicator, Dataset, getAverageGain } from '@showr/core';

interface IIndicatorParamsAverageGain {
  attribute: string;
  period: number;
}

export class AverageGain extends Indicator<IIndicatorParamsAverageGain> {
  constructor(
    name: string = 'AverageGain',
    params: IIndicatorParamsAverageGain
  ) {
    super(
      name,
      function(this: AverageGain, dataset: Dataset) {
        const { attribute, period } = params;
        const datasetLength = dataset.value.length;

        const lastAverageGain = dataset.at(-2)?.getIndicator(this.name);
        if (lastAverageGain && datasetLength > period) {
          const difference =
            dataset.at(-1).getAttribute(attribute) -
            dataset.at(-2).getAttribute(attribute);
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
