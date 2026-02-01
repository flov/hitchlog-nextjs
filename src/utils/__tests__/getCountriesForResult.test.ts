import { getCountriesForResult } from '../getCountriesForResult';

import croatia_serbia from './croatia_serbia.json';
import istanbul_zagreb from './istanbul_zagreb.json';

describe('getCoutnriesForResult', () => {
  it('outputs correct countries for croatia_serbia', () => {
    // @ts-ignore
    // Fixture: start_address "Serbia", end_address "Croatia", no "Entering" steps
    expect(getCountriesForResult(croatia_serbia)).toEqual([
      ['Serbia', 648602],
    ]);
  });
  it('outputs correct countries for istanbul_zagreb', () => {
    // @ts-ignore
    const output = getCountriesForResult(istanbul_zagreb);
    // flatten output
    const flatOutput = output.reduce((acc, curr) => {
      return acc.concat(curr);
    }, []);
    // Fixture: start "İstanbul, Turkey", end "Zagreb, Croatia", no "Entering" steps in fixture
    expect(flatOutput).toContain('Turkey');
    expect(flatOutput).toContain(1342350);
    expect(output.length).toBeGreaterThanOrEqual(1);
  });
});
