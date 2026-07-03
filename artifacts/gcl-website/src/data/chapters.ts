export interface Chapter {
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  founded: number;
  team: number;
}

export const chapters: Chapter[] = [
  { name: "GCL Tashkent",    city: "Tashkent",    country: "Uzbekistan",  lat: 41.2995,  lng: 69.2401,   founded: 2021, team: 18 },
  { name: "GCL Samarkand",   city: "Samarkand",   country: "Uzbekistan",  lat: 39.6542,  lng: 66.9597,   founded: 2022, team: 9  },
  { name: "GCL Almaty",      city: "Almaty",      country: "Kazakhstan",  lat: 43.2220,  lng: 76.8512,   founded: 2022, team: 11 },
  { name: "GCL Astana",      city: "Astana",      country: "Kazakhstan",  lat: 51.1801,  lng: 71.4460,   founded: 2023, team: 7  },
  { name: "GCL Bishkek",     city: "Bishkek",     country: "Kyrgyzstan",  lat: 42.8746,  lng: 74.5698,   founded: 2022, team: 8  },
  { name: "GCL Dushanbe",    city: "Dushanbe",    country: "Tajikistan",  lat: 38.5598,  lng: 68.7738,   founded: 2023, team: 6  },
  { name: "GCL Ashgabat",    city: "Ashgabat",    country: "Turkmenistan",lat: 37.9601,  lng: 58.3261,   founded: 2024, team: 4  },
  { name: "GCL Istanbul",    city: "Istanbul",    country: "Turkey",      lat: 41.0082,  lng: 28.9784,   founded: 2023, team: 10 },
  { name: "GCL Lagos",       city: "Lagos",       country: "Nigeria",     lat: 6.5244,   lng: 3.3792,    founded: 2023, team: 9  },
  { name: "GCL Nairobi",     city: "Nairobi",     country: "Kenya",       lat: -1.2921,  lng: 36.8219,   founded: 2024, team: 6  },
  { name: "GCL Mumbai",      city: "Mumbai",      country: "India",       lat: 19.0760,  lng: 72.8777,   founded: 2023, team: 8  },
  { name: "GCL London",      city: "London",      country: "UK",          lat: 51.5074,  lng: -0.1278,   founded: 2022, team: 12 },
  { name: "GCL Bogotá",      city: "Bogotá",      country: "Colombia",    lat: 4.7110,   lng: -74.0721,  founded: 2024, team: 5  },
  { name: "GCL Tbilisi",     city: "Tbilisi",     country: "Georgia",     lat: 41.6938,  lng: 44.8015,   founded: 2023, team: 7  },
];
