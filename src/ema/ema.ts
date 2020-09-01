import { Indicator } from '../indicator';
import { Dataset } from '../dataset';
import { EnumSymbols } from '../enums/symbols';

interface IIndicatorOptionsEMA {
  name?: string;
  period?: number;
  attribute?: keyof typeof EnumSymbols | string;
}

export class EMA extends Indicator {
  protected _options: IIndicatorOptionsEMA;

  constructor(options?: IIndicatorOptionsEMA) {
    super(
      'EMA',
      function(this: EMA, dataset: Dataset) {
        const { period = 5, attribute = EnumSymbols.close } = this._options;
        const datasetLength = dataset.value.length;

        if (datasetLength === 1) {
          return dataset.quotes[0].value[attribute];
        }

        const _smoothing = 2 / (period + 1);
        const lastEMA = dataset.quotes[datasetLength - 2].getIndicator(
          this.name
        );
        const value = dataset.quotes[datasetLength - 1].value[attribute];

        return value * _smoothing + lastEMA * (1 - _smoothing);
      },
      options
    );

    this._options = Object.assign({}, options);
  }
}
