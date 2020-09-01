import { Indicator, IndicatorOptions } from '../indicator';
import { Dataset } from '../dataset';
import { EnumSymbols, Keys } from '../enums/symbols';
import { EMA } from './ema';

interface IIndicatorOptionsMACD extends IndicatorOptions {
  name?: string;
  attribute?: keyof typeof EnumSymbols | string;
}

export class MACD extends Indicator {
  protected _options: IIndicatorOptionsMACD;

  constructor(options?: IIndicatorOptionsMACD) {
    super(
      'MACD',
      function(this: MACD, dataset: Dataset) {
        const datasetLength = dataset.value.length;

        if (datasetLength === 1) {
          return 0;
        }

        return (
          dataset.value[datasetLength - 1][Keys.indicators].ema12 -
          dataset.value[datasetLength - 1][Keys.indicators].ema26
        );
      },
      options
    );

    this._options = Object.assign({}, options);
    this._options.beforeCalculate = (dataset: Dataset) => {
      const ema12 = new EMA({
        name: 'ema12',
        period: 12,
        attribute: this._options.attribute,
      });
      const ema26 = new EMA({
        name: 'ema26',
        period: 26,
        attribute: this._options.attribute,
      });

      dataset.apply(ema12, ema26);
    };
  }
}
