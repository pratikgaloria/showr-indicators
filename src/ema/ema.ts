import { Indicator, Dataset } from '@showr/core';
import { SMA } from '..';

interface IIndicatorParamsEMA {
  attribute?: string;
  period?: number;
}

export class EMA extends Indicator<IIndicatorParamsEMA> {
  constructor(name = 'EMA', params: IIndicatorParamsEMA) {
    super(
      name,
      function (this: EMA, dataset: Dataset) {
        const { attribute, period = 5 } = params;
        const datasetLength = dataset.value.length;

        const _smoothing = 2 / (period + 1);
        const lastEMA = dataset.at(-2)?.getIndicator(this.name);

        if (lastEMA && !isNaN(lastEMA) && datasetLength > period) {
          const value = dataset.valueAt(-1, attribute);
          return value * _smoothing + lastEMA * (1 - _smoothing);
        } else {
          if (datasetLength === period) {
            const sma = new SMA('sma', { attribute, period });
            return sma.calculate(dataset);
          } else {
            if (datasetLength < period) {
              return NaN;
            } else {
              const dsSliced = new Dataset(dataset.value.slice(0, period));
              const dsRemaining = new Dataset(dataset.value.slice(period));
              this.spread(dsSliced);

              dsRemaining.quotes.forEach((q) => dsSliced.add(q));
              this.spread(dsSliced);

              return dsSliced.at(-1).getIndicator(this.name);
            }
          }
        }
      },
      {
        params,
      }
    );
  }
}
