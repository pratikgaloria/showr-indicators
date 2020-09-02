import { Indicator, Dataset } from '@showr/core';

interface IIndicatorParamsEMA {
  attribute: string;
  period?: number;
}

export class EMA extends Indicator<IIndicatorParamsEMA> {
  constructor(name: string = 'EMA', params: IIndicatorParamsEMA) {
    super(
      name,
      function(this: EMA, dataset: Dataset) {
        const { attribute, period = 5 } = params;
        const datasetLength = dataset.value.length;

        if (datasetLength === 1) {
          return dataset.quotes[0].getAttribute(attribute);
        }

        const _smoothing = 2 / (period + 1);
        const lastEMA = dataset.quotes[datasetLength - 2].getIndicator(
          this.name
        );
        const value = dataset.quotes[datasetLength - 1].getAttribute(attribute);

        return value * _smoothing + lastEMA * (1 - _smoothing);
      },
      {
        params,
      }
    );
  }
}
