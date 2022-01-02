# showr-indicators

@showr/indicators provides ready-to-use technical-indicators for your trading setup. The library leverages powerful fundamentals of [@showr/core](https://www.npmjs.com/package/@showr/core) to build the indicators with Typescript.

# Available indicators

- [x] Simple Moving Average (SMA)
- [x] Exponential Moving Average (EMA)
- [x] Relative Strength Index (RSI)
- [x] Moving Average Convergence Divergence (MACD)

# Installation

```bash
npm i --save @showr/indicators
```

or

```bash
yarn add @showr/indicators
```

# Usage

You can import available indicators directly from the main library.

```javascript
import { SMA, EMA } from '@showr/indicators';
// or
const { SMA, EMA } = require('@showr/indicators');
```

# Example

## Using SMA over a custom dataset

```javascript
import { Dataset } from '@showr/core';
import { SMA } from '@showr/indicators';

const ds = new Dataset([10, 20, 30]);

const sma2 = new SMA('sma2', { period: 2 });
ds.apply(sma2);

// Get sma2 value for the last quote
ds.at(-1).getIndicator('sma2'); // 25
```

## Using SMA over historical data using [yahoo-finance2](https://www.npmjs.com/package/yahoo-finance2)

```typescript
import yahooFinance from 'yahoo-finance2';
import { Dataset } from '@showr/core';
import { SMA } from '@showr/indicators';

const data = await yahooFinance.historical('TSLA', {
  period1: '2021-12-01',
  period2: '2022-01-01',
});

const ds = new Dataset(data);
const sma10 = new SMA<HistoricalRow>('sma10', {
  attribute: 'close',
  period,
});
ds.apply(sma10);

// Get sma10 value for the last quote
ds.at(-1).getIndicator('sma10'); // 1024.26
```
