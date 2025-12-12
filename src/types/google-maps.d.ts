// Google Maps API type definitions for address autocomplete
declare namespace google.maps {
  export class places {
    static Autocomplete: new (
      inputElement: HTMLInputElement,
      options?: {
        types?: string[]
        fields?: string[]
        componentRestrictions?: { country?: string | string[] }
      }
    ) => google.maps.places.Autocomplete
  }

  namespace places {
    export class Autocomplete {
      addListener(eventName: string, handler: () => void): void
      getPlace(): PlaceResult
    }

    export interface PlaceResult {
      formatted_address?: string
      address_components?: AddressComponent[]
      geometry?: {
        location: google.maps.LatLng
      }
    }

    export interface AddressComponent {
      long_name: string
      short_name: string
      types: string[]
    }
  }

  export namespace event {
    export function clearInstanceListeners(instance: any): void
  }

  export class LatLng {
    constructor(lat: number, lng: number)
    lat(): number
    lng(): number
  }
}

// Environment variable for Google Maps API
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string
  }
}
