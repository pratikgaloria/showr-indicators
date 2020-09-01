import { Indicator } from '../indicator';
import { Dataset } from '../dataset';
import { EnumSymbols, Keys } from '../enums/symbols';

interface IIndicatorOptionsSMA {
  name?: string;
  period?: number;
  attribute?: keyof typeof EnumSymbols | string;
}

export class SMA extends Indicator {
  protected _options: IIndicatorOptionsSMA;

  constructor(options?: IIndicatorOptionsSMA) {
    super(
      'SMA',
      function(this: SMA, dataset: Dataset) {
        const { period = 5, attribute = EnumSymbols.close } = this._options;
        const datasetLength = dataset.value.length;

        if (datasetLength < period) {
          return dataset.quotes[datasetLength - 1].value[attribute];
        }

        let total = 0;
        for (let i = datasetLength - period; i < datasetLength; i++) {
          total += dataset.quotes[i].value[attribute];
        }

        return total / period;
      },
      options
    );

    this._options = Object.assign({}, options);
  }
}
