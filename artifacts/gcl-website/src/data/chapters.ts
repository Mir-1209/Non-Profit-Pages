export type ChapterStatus = 'active' | 'growing' | 'new' | 'dormant';

export interface Chapter {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  status: ChapterStatus;
  founded: number;
  founder: string;
  lead: string;
  members: number;
  eventsHosted: number;
  studentsEducated: number;
  about: string;
  contact: string;
}

export const chapters: Chapter[] = [
  {
    id: 'tashkent',
    name: 'GCL Tashkent',
    city: 'Tashkent', country: 'Uzbekistan',
    lat: 41.2995, lng: 69.2401,
    status: 'active', founded: 2021,
    founder: 'Amir Karimov', lead: 'Amir Karimov',
    members: 18, eventsHosted: 42, studentsEducated: 1240,
    about: 'The founding chapter of GCL, born from a single workshop at a Tashkent youth center. Now Central Asia\'s most active financial literacy hub, running weekly sessions across 6 districts.',
    contact: 'tashkent@gcl.org',
  },
  {
    id: 'samarkand',
    name: 'GCL Samarkand',
    city: 'Samarkand', country: 'Uzbekistan',
    lat: 39.6542, lng: 66.9597,
    status: 'active', founded: 2022,
    founder: 'Zarina Yusupova', lead: 'Zarina Yusupova',
    members: 9, eventsHosted: 18, studentsEducated: 430,
    about: 'Operating out of Samarkand State University, this chapter focuses on entrepreneurship and behavioral economics for history-city youth ready to build generational wealth.',
    contact: 'samarkand@gcl.org',
  },
  {
    id: 'almaty',
    name: 'GCL Almaty',
    city: 'Almaty', country: 'Kazakhstan',
    lat: 43.2220, lng: 76.8512,
    status: 'active', founded: 2022,
    founder: 'Damir Seitkali', lead: 'Damir Seitkali',
    members: 11, eventsHosted: 22, studentsEducated: 580,
    about: 'Kazakhstan\'s first GCL chapter, partnered with KIMEP University. Runs the region\'s only behavioral finance bootcamp for high-school students.',
    contact: 'almaty@gcl.org',
  },
  {
    id: 'astana',
    name: 'GCL Astana',
    city: 'Astana', country: 'Kazakhstan',
    lat: 51.1801, lng: 71.4460,
    status: 'growing', founded: 2023,
    founder: 'Ainur Bekova', lead: 'Ainur Bekova',
    members: 7, eventsHosted: 10, studentsEducated: 210,
    about: 'Launched in the heart of Kazakhstan\'s capital, GCL Astana targets government employees and young professionals entering the financial sector.',
    contact: 'astana@gcl.org',
  },
  {
    id: 'bishkek',
    name: 'GCL Bishkek',
    city: 'Bishkek', country: 'Kyrgyzstan',
    lat: 42.8746, lng: 74.5698,
    status: 'active', founded: 2022,
    founder: 'Manas Dzhaksybekov', lead: 'Manas Dzhaksybekov',
    members: 8, eventsHosted: 16, studentsEducated: 340,
    about: 'Born from a grassroots movement at AUCA, GCL Bishkek has grown into Kyrgyzstan\'s only structured youth financial literacy program.',
    contact: 'bishkek@gcl.org',
  },
  {
    id: 'dushanbe',
    name: 'GCL Dushanbe',
    city: 'Dushanbe', country: 'Tajikistan',
    lat: 38.5598, lng: 68.7738,
    status: 'growing', founded: 2023,
    founder: 'Faridun Rahimov', lead: 'Faridun Rahimov',
    members: 6, eventsHosted: 8, studentsEducated: 180,
    about: 'Tajikistan\'s first GCL chapter, operating in one of Central Asia\'s most underserved financial education markets. Partners with local NGOs to reach rural communities.',
    contact: 'dushanbe@gcl.org',
  },
  {
    id: 'ashgabat',
    name: 'GCL Ashgabat',
    city: 'Ashgabat', country: 'Turkmenistan',
    lat: 37.9601, lng: 58.3261,
    status: 'new', founded: 2024,
    founder: 'Gurban Myradov', lead: 'Gurban Myradov',
    members: 4, eventsHosted: 3, studentsEducated: 55,
    about: 'Newest chapter in Central Asia, pioneering financial literacy education in a market with almost no prior youth programming.',
    contact: 'ashgabat@gcl.org',
  },
  {
    id: 'tbilisi',
    name: 'GCL Tbilisi',
    city: 'Tbilisi', country: 'Georgia',
    lat: 41.6938, lng: 44.8015,
    status: 'active', founded: 2023,
    founder: 'Nino Kvaratskhelia', lead: 'Nino Kvaratskhelia',
    members: 7, eventsHosted: 14, studentsEducated: 295,
    about: 'A Caucasus hub bridging Central Asia and Europe, GCL Tbilisi runs bilingual (Georgian/English) workshops and is the region\'s fastest-growing chapter.',
    contact: 'tbilisi@gcl.org',
  },
  {
    id: 'istanbul',
    name: 'GCL Istanbul',
    city: 'Istanbul', country: 'Turkey',
    lat: 41.0082, lng: 28.9784,
    status: 'active', founded: 2023,
    founder: 'Emre Demir', lead: 'Emre Demir',
    members: 10, eventsHosted: 19, studentsEducated: 470,
    about: 'One of GCL\'s most international chapters, hosting events in three languages and partnering with Boğaziçi University\'s economics faculty.',
    contact: 'istanbul@gcl.org',
  },
  {
    id: 'london',
    name: 'GCL London',
    city: 'London', country: 'UK',
    lat: 51.5074, lng: -0.1278,
    status: 'active', founded: 2022,
    founder: 'Priya Sharma', lead: 'Priya Sharma',
    members: 12, eventsHosted: 26, studentsEducated: 720,
    about: 'GCL\'s Western European anchor, operating out of the London School of Economics. Runs the annual GCL Global Summit and connects chapters worldwide.',
    contact: 'london@gcl.org',
  },
  {
    id: 'lagos',
    name: 'GCL Lagos',
    city: 'Lagos', country: 'Nigeria',
    lat: 6.5244, lng: 3.3792,
    status: 'active', founded: 2023,
    founder: 'Chidi Okonkwo', lead: 'Chidi Okonkwo',
    members: 9, eventsHosted: 17, studentsEducated: 390,
    about: 'Africa\'s largest GCL chapter by student reach, partnering with Lagos Business School to bring behavioral finance to Nigeria\'s booming youth population.',
    contact: 'lagos@gcl.org',
  },
  {
    id: 'nairobi',
    name: 'GCL Nairobi',
    city: 'Nairobi', country: 'Kenya',
    lat: -1.2921, lng: 36.8219,
    status: 'growing', founded: 2024,
    founder: 'Amara Osei', lead: 'Amara Osei',
    members: 6, eventsHosted: 7, studentsEducated: 145,
    about: 'East Africa\'s first GCL chapter, running workshops across Nairobi\'s informal settlements and connecting youth to digital financial tools.',
    contact: 'nairobi@gcl.org',
  },
  {
    id: 'mumbai',
    name: 'GCL Mumbai',
    city: 'Mumbai', country: 'India',
    lat: 19.0760, lng: 72.8777,
    status: 'active', founded: 2023,
    founder: 'Rohan Mehta', lead: 'Rohan Mehta',
    members: 8, eventsHosted: 15, studentsEducated: 350,
    about: 'India\'s first GCL chapter, serving Mumbai\'s vast young professional population with workshops on behavioral economics and personal finance psychology.',
    contact: 'mumbai@gcl.org',
  },
  {
    id: 'bogota',
    name: 'GCL Bogotá',
    city: 'Bogotá', country: 'Colombia',
    lat: 4.7110, lng: -74.0721,
    status: 'growing', founded: 2024,
    founder: 'Valentina Torres', lead: 'Valentina Torres',
    members: 5, eventsHosted: 5, studentsEducated: 90,
    about: 'Latin America\'s first GCL chapter, building bridges between Colombia\'s financial sector and the youth who have been shut out of it.',
    contact: 'bogota@gcl.org',
  },
];

export const STATUS_LABEL: Record<ChapterStatus, string> = {
  active: 'Active',
  growing: 'Growing',
  new: 'Newly Founded',
  dormant: 'Dormant',
};

export const STATUS_COLOR: Record<ChapterStatus, string> = {
  active: '#22c55e',
  growing: '#3b82f6',
  new: '#94a3b8',
  dormant: '#6b7280',
};
