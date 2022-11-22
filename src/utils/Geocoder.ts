const getDataFromAddressComponent = (
  address_component: google.maps.GeocoderAddressComponent[] | undefined
) => {
  const city = address_component?.find((component) =>
    component.types.includes('locality')
  );
  const country = address_component?.find((component) =>
    component.types.includes('country')
  );
  return {
    city: city ? city.long_name : '',
    country: country ? country.long_name : '',
    country_code: country ? country.short_name : '',
  };
};

export const geocode = (geocoderRequest: google.maps.GeocoderRequest) => {
  const geocoder = new google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode(geocoderRequest, (results, status) => {
      if (status === 'OK' && results) {
        const { city, country, country_code } = getDataFromAddressComponent(
          results[0]
            .address_components as google.maps.GeocoderAddressComponent[]
        );
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        const output = {
          place_id: results[0].place_id,
          name: results[0].formatted_address,
          city,
          lat,
          lng,
          country,
          country_code,
          formatted_address: results[0].formatted_address,
        };
        resolve(output);
      } else {
        reject({});
      }
    });
  });
};
