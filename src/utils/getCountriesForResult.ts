export const getCountriesForResult = (
  directionsResult: google.maps.DirectionsResult
) => {
  const { routes } = directionsResult;
  const leg = routes[0].legs[0];
  const { steps } = leg;

  // getting start and end country
  const start_country = leg.start_address.split(', ').pop();
  const end_country = leg.end_address.split(', ').pop();
  let countries: [string, number][] = [];

  if (start_country && leg.distance)
    countries.push([start_country, leg.distance?.value]);
  // if start and end country are the same return only one country
  if (start_country == end_country) {
    return [[start_country, leg.distance?.value]];
  } else {
    let distance = 0;
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const { instructions } = step;
      if (step.distance) distance += step.distance.value;
      if (instructions.includes('Entering')) {
        let country = instructions.split('Entering ').pop();
        country?.includes('</div>')
          ? (country = country.split('</div>')[0])
          : country;
        if (country) {
          countries[countries.length - 1][1] = distance;
          countries.push([country, 0]);
          distance = 0;
        }
      }
      if (i == steps.length - 1) {
        countries[countries.length - 1][1] = distance;
      }
    }
    return countries;
  }
};
