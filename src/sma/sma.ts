import { Indicator, Dataset } from '@showr/core';

interface IIndicatorParamsSMA {
  attribute?: string;
  period?: number;
}

export class SMA extends Indicator<IIndicatorParamsSMA> {
  constructor(name = 'SMA', params: IIndicatorParamsSMA) {
    super(
      name,
      function (this: SMA, dataset: Dataset) {
        const { attribute, period = 5 } = params;
        const datasetLength = dataset.value.length;

        const lastSMA = dataset.at(-2)?.getIndicator(this.name);

        if (lastSMA !== undefined && datasetLength > period) {
          const firstAttributeValue = attribute
            ? dataset.at(-1 - period).getAttribute(attribute)
            : dataset.at(-1 - period).value;
          const lastAttributeValue = attribute
            ? dataset.at(-1).getAttribute(attribute)
            : dataset.at(-1).value;
          const change = lastAttributeValue - firstAttributeValue;

          return (lastSMA * period + change) / period;
        } else {
          if (datasetLength < period) {
            return attribute
              ? dataset.at(-1).getAttribute(attribute)
              : dataset.at(-1).value;
          } else {
            let total = 0;
            for (let i = datasetLength - period; i < datasetLength; i++) {
              total += attribute
                ? dataset.at(i).getAttribute(attribute)
                : dataset.at(i).value;
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
