// Google Maps integration utilities
// This would be used for real Google Maps integration

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  status: 'safe' | 'alert' | 'emergency';
  name: string;
}

export interface MapOptions {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  markers: MapMarker[];
}

export class GoogleMapsService {
  private map: google.maps.Map | null = null;
  private markers: Map<string, google.maps.Marker> = new Map();

  async initialize(element: HTMLElement, options: MapOptions) {
    // Initialize Google Maps
    // This would require Google Maps API key
    const mapOptions: google.maps.MapOptions = {
      center: options.center,
      zoom: options.zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.map = new google.maps.Map(element, mapOptions);
    this.updateMarkers(options.markers);
  }

  updateMarkers(markers: MapMarker[]) {
    if (!this.map) return;

    // Clear existing markers
    this.markers.forEach(marker => marker.setMap(null));
    this.markers.clear();

    // Add new markers
    markers.forEach(markerData => {
      const marker = new google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: this.map,
        title: markerData.name,
        icon: this.getMarkerIcon(markerData.status),
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-medium">${markerData.name}</h3>
            <p class="text-sm text-gray-600">Status: ${markerData.status}</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });

      this.markers.set(markerData.id, marker);
    });
  }

  private getMarkerIcon(status: string) {
    const color = status === 'safe' ? 'green' : status === 'alert' ? 'yellow' : 'red';
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8" fill="${color}" stroke="white" stroke-width="2"/>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(20, 20),
    };
  }
}
