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

        const lastSMA = dataset.quotes[datasetLength - 2]?.getIndicator(
          this.name
        );
        if (lastSMA !== undefined && datasetLength > period) {
          const firstAttributeValue = dataset.quotes[
            datasetLength - period - 1
          ].getAttribute(attribute);
          const lastAttributeValue = dataset.quotes[
            datasetLength - 1
          ].getAttribute(attribute);
          const change = lastAttributeValue - firstAttributeValue;

          return (lastSMA * period + change) / period;
        } else {
          if (datasetLength < period) {
            return dataset.quotes[datasetLength - 1].getAttribute(attribute);
          } else {
            let total = 0;
            for (let i = datasetLength - period; i < datasetLength; i++) {
              total += dataset.quotes[i].getAttribute(attribute);
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
