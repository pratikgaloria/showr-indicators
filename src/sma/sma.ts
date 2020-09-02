import { Indicator, Dataset } from '@showr/core';

interface IIndicatorParamsSMA {
  attribute: string;
  period?: number;
}

export class SMA extends Indicator<IIndicatorParamsSMA> {
  constructor(name: string = 'SMA', params: IIndicatorParamsSMA) {
    super(
      name,
      function(this: SMA, dataset: Dataset) {
        const { attribute, period = 5 } = params;
        const datasetLength = dataset.value.length;

        if (datasetLength < period) {
          return dataset.quotes[datasetLength - 1].getAttribute(attribute);
        }

        let total = 0;
        for (let i = datasetLength - period; i < datasetLength; i++) {
          total += dataset.quotes[i].getAttribute(attribute);
        }

        return total / period;
      },
      {
        params,
      }
    );
  }
}
