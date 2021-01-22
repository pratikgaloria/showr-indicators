import { Indicator, Dataset, getAverageLoss } from '@showr/core';

interface IIndicatorParamsAverageLoss {
  attribute: string;
  period: number;
}

export class AverageLoss extends Indicator<IIndicatorParamsAverageLoss> {
  constructor(
    name: string = 'AverageLoss',
    params: IIndicatorParamsAverageLoss
  ) {
    super(
      name,
      function(this: AverageLoss, dataset: Dataset) {
        const { attribute, period } = params;
        const datasetLength = dataset.value.length;

        const lastAverageLoss = dataset.at(-2)?.getIndicator(this.name);
        if (lastAverageLoss && datasetLength > period) {
          const difference =
            dataset.at(-1).getAttribute(attribute) -
            dataset.at(-2).getAttribute(attribute);
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
