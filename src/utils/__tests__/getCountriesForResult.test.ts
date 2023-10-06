import { getCountriesForResult } from '../getCountriesForResult';

import croatia_serbia from './croatia_serbia.json';
import istanbul_zagreb from './istanbul_zagreb.json';

describe('getCoutnriesForResult', () => {
  it('outputs correct countries for croatia_serbia', () => {
    // @ts-ignore
    expect(getCountriesForResult(croatia_serbia)).toEqual([
      ['Croatia', 648602],
      ['Serbia', 0],
    ]);
  });
  it('outputs correct countries for istanbul_zagreb', () => {
    // @ts-ignore
    const output = getCountriesForResult(istanbul_zagreb);
    // flatten output
    const flatOutput = output.reduce((acc, curr) => {
      return acc.concat(curr);
    }, []);
    // flatOutput should contain 'Croatia' and 'Serbia'
    expect(flatOutput).toContain('Turkey');
    expect(flatOutput).toContain('Croatia');
    expect(flatOutput).toContain('Bulgaria');
    expect(flatOutput).toContain('Serbia');
  });
});
