const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

export type LocationLike = { lat: number; lng: number };

export type OSRMRouteResult = {
  path: google.maps.LatLngLiteral[];
  distance: number;
  duration: number;
};

export async function getOSRMRoute(
  origin: LocationLike,
  destination: LocationLike
): Promise<OSRMRouteResult | null> {
  const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `${OSRM_BASE_URL}/${coords}?overview=full&geometries=geojson`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes?.[0]) return null;
    const route = data.routes[0];
    const path: google.maps.LatLngLiteral[] = (
      route.geometry?.coordinates || []
    ).map(([lng, lat]: number[]) => ({ lat, lng }));
    return {
      path,
      distance: route.distance ?? 0,
      duration: route.duration ?? 0,
    };
  } catch {
    return null;
  }
}

export function displayOSRMRoute(
  map: google.maps.Map,
  origin: LocationLike,
  destination: LocationLike,
  onResult?: (result: OSRMRouteResult, polyline: google.maps.Polyline) => void
): Promise<google.maps.Polyline | null> {
  return getOSRMRoute(origin, destination).then((result) => {
    if (!result || result.path.length < 2) return null;
    const polyline = new google.maps.Polyline({
      path: result.path,
      strokeColor: '#4285F4',
      strokeOpacity: 1,
      strokeWeight: 4,
      map,
    });
    const bounds = new google.maps.LatLngBounds();
    result.path.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
    onResult?.(result, polyline);
    return polyline;
  });
}
