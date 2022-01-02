import { Indicator, Dataset } from '@showr/core';
import { AverageGain } from './averageGain';
import { AverageLoss } from './averageLoss';

interface IIndicatorParamsRSI {
  attribute?: string;
  period: number;
}

export class RSI<T = number> extends Indicator<IIndicatorParamsRSI, T> {
  constructor(name = 'RSI', params: IIndicatorParamsRSI) {
    super(
      name,
      function (this: RSI<T>, dataset: Dataset<T>) {
        const { period } = params;
        const datasetLength = dataset.value.length;

        if (datasetLength <= period) {
          return NaN;
        }

        const averageGain = dataset
          .at(-1)
          ?.getIndicator(`averageGain${params.period}`);
        const averageLoss = dataset
          .at(-1)
          ?.getIndicator(`averageLoss${params.period}`);

        const relativeStrength = isNaN(averageGain / averageLoss)
          ? 0
          : averageGain / averageLoss;

        return 100 - 100 / (1 + relativeStrength);
      },
      {
        params,
        beforeCalculate: (dataset: Dataset<T>) => {
          if (dataset.value.length > params.period) {
            const averageGainName = `averageGain${params.period}`;
            const averageLossName = `averageLoss${params.period}`;

            const avgGain = new AverageGain<T>(averageGainName, {
              period: params.period,
              attribute: params.attribute,
            });
            const avgLoss = new AverageLoss<T>(averageLossName, {
              period: params.period,
              attribute: params.attribute,
            });

            dataset.apply(avgGain, avgLoss);
          }
        },
      }
    );
  }
}
