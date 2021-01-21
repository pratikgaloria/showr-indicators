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

        const lastSMA = dataset.at(-2)?.getIndicator(this.name);
        if (lastSMA !== undefined && datasetLength > period) {
          const firstAttributeValue = dataset
            .at(-1 - period)
            .getAttribute(attribute);
          const lastAttributeValue = dataset.at(-1).getAttribute(attribute);
          const change = lastAttributeValue - firstAttributeValue;

          return (lastSMA * period + change) / period;
        } else {
          if (datasetLength < period) {
            return dataset.at(-1).getAttribute(attribute);
          } else {
            let total = 0;
            for (let i = datasetLength - period; i < datasetLength; i++) {
              total += dataset.at(i).getAttribute(attribute);
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
