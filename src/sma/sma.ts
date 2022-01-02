import { Indicator, Dataset } from '@showr/core';

interface IIndicatorParamsSMA {
  attribute?: string;
  period?: number;
}

export class SMA<T = number> extends Indicator<IIndicatorParamsSMA, T> {
  constructor(name = 'SMA', params: IIndicatorParamsSMA) {
    super(
      name,
      function (this: SMA<T>, dataset: Dataset<T>) {
        const { attribute, period = 5 } = params;
        const datasetLength = dataset.value.length;

        const lastSMA = dataset.at(-2)?.getIndicator(this.name);

        if (lastSMA !== undefined && datasetLength > period) {
          const firstAttributeValue = dataset.valueAt(-1 - period, attribute);
          const lastAttributeValue = dataset.valueAt(-1, attribute);
          const change = lastAttributeValue - firstAttributeValue;

          return (lastSMA * period + change) / period;
        } else {
          if (datasetLength < period) {
            return dataset.valueAt(-1, attribute);
          } else {
            let total = 0;
            for (let i = datasetLength - period; i < datasetLength; i++) {
              total += dataset.valueAt(i, attribute);
            }

            return total / period;
          }
        }
      },
      {
        params,
      }
    );
  }
}
