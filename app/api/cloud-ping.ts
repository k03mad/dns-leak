export interface CloudPingLocation {
  city?: string;
  country?: string;
}

type CloudPingLocations = Record<string, CloudPingLocation>;

export default class CloudPing {
  public async getAllLocations(): Promise<CloudPingLocations> {
    const locationsEndpoint = CloudPing.endpoints.locations();

    const response = await fetch(locationsEndpoint);
    return (await response.json()) as CloudPingLocations;
  }

  public async getCurrentIataCode(): Promise<string> {
    const testEndpoint = CloudPing.endpoints.edge();
    const response = await fetch(testEndpoint);
    const iata = response.headers.get('x-amz-cf-pop');

    if (!iata) {
      throw new Error('CloudFront edge response has no x-amz-cf-pop header');
    }

    return iata;
  }

  public async getCurrentLocation(): Promise<CloudPingLocation & {iata: string}> {
    const [iata, locations] = await Promise.all([
      this.getCurrentIataCode(),
      this.getAllLocations(),
    ]);

    return {...locations[iata.replace(/\d.+/, '')], iata};
  }

  public static get endpoints(): {edge: () => string; locations: () => string} {
    return {
      edge: (): string => 'https://edge.feitsui.com/',
      locations: (): string => 'https://www.cloudping.cloud/cloudfront-edge-locations.json',
    };
  }
}
