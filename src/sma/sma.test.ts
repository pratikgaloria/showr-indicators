import { Dataset } from '@showr/core';
import { SMA } from './sma';

describe('SMA should return the correct value', () => {
  // Reference: https://school.stockcharts.com/doku.php?id=technical_indicators:moving_averages
  const data = [
    22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23, 22.43, 22.24, 22.29, 22.15,
    22.39,
  ];
  const name = 'sma10';
  const period = 10;
  const sma10 = new SMA(name, { period });

  it('When dataset length is less than period.', () => {
    expect(
      sma10.calculate(new Dataset(data.slice(0, period - 1))).toFixed(2)
    ).toBe('22.24');
  });

  it('When dataset length is equal to period.', () => {
    expect(sma10.calculate(new Dataset(data.slice(0, period))).toFixed(2)).toBe(
      '22.22'
    );
  });

  it('When dataset length is more than period.', () => {
    const ds = new Dataset(data.slice(0, period + 1));

    expect(sma10.calculate(ds).toFixed(2)).toBe('22.21');
  });

  it('When indicator is spreaded over the dataset.', () => {
    const ds = new Dataset(data);
    sma10.spread(ds);

    expect(Number(ds.at(-1).getIndicator(name)).toFixed(2)).toBe('22.23');
  });
});
