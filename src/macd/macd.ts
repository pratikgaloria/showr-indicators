import { Dataset, Indicator } from '@showr/core';
import { EMA } from '../';

interface IIndicatorParamsMACD {
  attribute: string;
}

export class MACD extends Indicator<IIndicatorParamsMACD> {
  constructor(name: string = 'MACD', params: IIndicatorParamsMACD) {
    super(
      name,
      function(this: MACD, dataset: Dataset) {
        const datasetLength = dataset.value.length;

        if (datasetLength === 1) {
          return 0;
        }

        return (
          dataset.quotes[datasetLength - 1].getIndicator('ema12') -
          dataset.quotes[datasetLength - 1].getIndicator('ema26')
        );
      },
      {
        params,
        beforeCalculate: (dataset: Dataset) => {
          const ema12 = new EMA('ema12', {
            period: 12,
            attribute: params.attribute,
          });
          const ema26 = new EMA('ema26', {
            period: 26,
            attribute: params.attribute,
          });

          dataset.apply(ema12, ema26);
        },
      }
    );
  }
}
