export interface CountryOption {
  code: string;
  name: string;
  phoneCode: string;
}

export interface StateOption {
  value: string;
  label: string;
}

export const UK_EU_COUNTRIES: CountryOption[] = [
  { code: 'GB', name: 'United Kingdom', phoneCode: '+44' },
  { code: 'IE', name: 'Ireland', phoneCode: '+353' },
  { code: 'DE', name: 'Germany', phoneCode: '+49' },
  { code: 'FR', name: 'France', phoneCode: '+33' },
  { code: 'ES', name: 'Spain', phoneCode: '+34' },
  { code: 'IT', name: 'Italy', phoneCode: '+39' },
  { code: 'NL', name: 'Netherlands', phoneCode: '+31' },
  { code: 'BE', name: 'Belgium', phoneCode: '+32' },
  { code: 'AT', name: 'Austria', phoneCode: '+43' },
  { code: 'PT', name: 'Portugal', phoneCode: '+351' },
  { code: 'CH', name: 'Switzerland', phoneCode: '+41' },
  { code: 'SE', name: 'Sweden', phoneCode: '+46' },
  { code: 'NO', name: 'Norway', phoneCode: '+47' },
  { code: 'DK', name: 'Denmark', phoneCode: '+45' },
  { code: 'FI', name: 'Finland', phoneCode: '+358' },
  { code: 'PL', name: 'Poland', phoneCode: '+48' },
  { code: 'CZ', name: 'Czech Republic', phoneCode: '+420' },
  { code: 'GR', name: 'Greece', phoneCode: '+30' },
  { code: 'HU', name: 'Hungary', phoneCode: '+36' },
  { code: 'SK', name: 'Slovakia', phoneCode: '+421' },
  { code: 'SI', name: 'Slovenia', phoneCode: '+386' },
  { code: 'LV', name: 'Latvia', phoneCode: '+371' },
  { code: 'LT', name: 'Lithuania', phoneCode: '+370' },
  { code: 'EE', name: 'Estonia', phoneCode: '+372' },
  { code: 'LU', name: 'Luxembourg', phoneCode: '+352' },
  { code: 'MT', name: 'Malta', phoneCode: '+356' },
  { code: 'CY', name: 'Cyprus', phoneCode: '+357' },
  { code: 'BG', name: 'Bulgaria', phoneCode: '+359' },
  { code: 'RO', name: 'Romania', phoneCode: '+40' },
  { code: 'HR', name: 'Croatia', phoneCode: '+385' },
];

export const UK_REGIONS: StateOption[] = [
  { value: 'england', label: 'England' },
  { value: 'scotland', label: 'Scotland' },
  { value: 'wales', label: 'Wales' },
  { value: 'northern-ireland', label: 'Northern Ireland' },
];

const S = (label: string): StateOption => ({ value: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'), label });

export const COUNTRY_STATES: Record<string, StateOption[]> = {
  GB: UK_REGIONS,
  IE: ['Connacht', 'Leinster', 'Munster', 'Ulster'].map(S),
  DE: ['Baden-Wurttemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen', 'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thuringen'].map(S),
  FR: ['Auvergne-Rhone-Alpes', 'Bretagne', 'Centre-Val de Loire', 'Corse', 'Grand Est', 'Hauts-de-France', 'Ile-de-France', 'Nouvelle-Aquitaine', 'Occitanie', 'Pays de la Loire', 'Provence-Alpes-Cote d Azur'].map(S),
  ES: ['Andalucia', 'Aragon', 'Asturias', 'Baleares', 'Canarias', 'Cantabria', 'Castilla-La Mancha', 'Castilla y Leon', 'Cataluna', 'Extremadura', 'Galicia', 'La Rioja', 'Madrid', 'Murcia', 'Navarra', 'Pais Vasco', 'Valencia'].map(S),
  IT: ['Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche', 'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana', 'Trentino-Alto Adige', 'Umbria', "Valle d'Aosta", 'Veneto'].map(S),
  NL: ['Drenthe', 'Flevoland', 'Friesland', 'Gelderland', 'Groningen', 'Limburg', 'Noord-Brabant', 'Noord-Holland', 'Overijssel', 'Utrecht', 'Zeeland', 'Zuid-Holland'].map(S),
  BE: ['Antwerpen', 'Brussels-Capital', 'Hainaut', 'Liege', 'Limburg', 'Luxembourg', 'Namur', 'Oost-Vlaanderen', 'Vlaams-Brabant', 'Walloon Brabant', 'West-Vlaanderen'].map(S),
  AT: ['Burgenland', 'Carinthia', 'Lower Austria', 'Salzburg', 'Styria', 'Tyrol', 'Upper Austria', 'Vienna', 'Vorarlberg'].map(S),
  PT: ['Aveiro', 'Beja', 'Braga', 'Braganca', 'Castelo Branco', 'Coimbra', 'Evora', 'Faro', 'Guarda', 'Leiria', 'Lisbon', 'Portalegre', 'Porto', 'Santarrem', 'Setubal', 'Viana do Castelo', 'Vila Real', 'Viseu'].map(S),
  CH: ['Aargau', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden', 'Basel-City', 'Basel-Country', 'Bern', 'Fribourg', 'Geneva', 'Glarus', 'Graubunden', 'Jura', 'Lucerne', 'Neuchatel', 'Nidwalden', 'Obwalden', 'Schaffhausen', 'Schwyz', 'Solothurn', 'St. Gallen', 'Ticino', 'Uri', 'Valais', 'Vaud', 'Zug', 'Zurich'].map(S),
  SE: ['Blekinge', 'Dalarna', 'Goteborg and Bohus', 'Gävleborg', 'Halland', 'Jämtland', 'Jönköping', 'Kalmar', 'Kronoberg', 'Norrbotten', 'Örebro', 'Östergötland', 'Skåne', 'Södermanland', 'Stockholm', 'Uppsala', 'Värmland', 'Västerbotten', 'Västernorrland', 'Västmanland', 'Västra Götaland'].map(S),
  NO: ['Agder', 'Innlandet', 'Møre og Romsdal', 'Nordland', 'Oslo', 'Rogaland', 'Troms og Finnmark', 'Trøndelag', 'Vestfold og Telemark', 'Vestland', 'Viken'].map(S),
  DK: ['Capital Region', 'Central Denmark', 'North Denmark', 'Region Zealand', 'Southern Denmark'].map(S),
  FI: ['Ahvenanmaa', 'Etela-Karjala', 'Etela-Pohjanmaa', 'Etela-Savo', 'Kainuu', 'Kanta-Hame', 'Keski-Pohjanmaa', 'Keski-Suomi', 'Kymenlaakso', 'Lappi', 'Pirkanmaa', 'Pohjanmaa', 'Pohjois-Karjala', 'Pohjois-Pohjanmaa', 'Pohjois-Savo', 'Päijät-Häme', 'Satakunta', 'Uusimaa', 'Varsinais-Suomi'].map(S),
  PL: ['Dolnoslaskie', 'Kujawsko-Pomorskie', 'Lubelskie', 'Lubuskie', 'Łódzkie', 'Małopolskie', 'Mazowieckie', 'Opolskie', 'Podkarpackie', 'Podlaskie', 'Pomorskie', 'Śląskie', 'Świętokrzyskie', 'Warmińsko-Mazurskie', 'Wielkopolskie', 'Zachodniopomorskie'].map(S),
  CZ: ['Central Bohemian', 'Hradec Kralove', 'Karlovy Vary', 'Liberec', 'Moravian-Silesian', 'Olomouc', 'Pardubice', 'Plzen', 'Prague', 'South Bohemian', 'South Moravian', 'Usti nad Labem', 'Vysočina', 'Zlín'].map(S),
  GR: ['Attica', 'Central Greece', 'Central Macedonia', 'Crete', 'East Macedonia and Thrace', 'Epirus', 'Ionian Islands', 'Mount Athos', 'North Aegean', 'Peloponnese', 'South Aegean', 'Thessaly', 'West Greece', 'Western Macedonia'].map(S),
  HU: ['Bács-Kiskun', 'Baranya', 'Békés', 'Borsod-Abaúj-Zemplén', 'Budapest', 'Csongrád-Csanád', 'Fejér', 'Győr-Moson-Sopron', 'Hajdú-Bihar', 'Heves', 'Jász-Nagykun-Szolnok', 'Komárom-Esztergom', 'Nógrád', 'Pest', 'Somogy', 'Szabolcs-Szatmár-Bereg', 'Tolna', 'Vas', 'Veszprém', 'Zala'].map(S),
  SK: ['Banskobystrica', 'Bratislava', 'Kosice', 'Nitra', 'Presov', 'Trencin', 'Trnava', 'Zilina'].map(S),
  SI: ['Central Slovenia', 'Coastal-Karst', 'Eastern Slovenia', 'Gorenjska', 'Goriška', 'Inner Carniola', 'Lower Carniola', 'Lower Savinja', 'Maribor-Pohorje', 'Prekmurje', 'Upper Carniola', 'Upper Savinja', 'Upper Carniola-Salve', 'Upper Soča'].map(S),
  LV: ['Aizkraukle', 'Alūksne', 'Balvi', 'Bauska', 'Cēsis', 'Daugavpils', 'Dobele', 'Jelgava', 'Jūrmala', 'Kurzeme', 'Latgale', 'Liekrāja', 'Ogre', 'Preiļi', 'Rēzekne', 'Riga', 'Saldus', 'Talsi', 'Tukums', 'Valmiera', 'Ventspils', 'Zemgale'].map(S),
  LT: [' Alytus', 'Kaunas', 'Klaipeda', 'Marijampole', 'Mazeikiai', 'Panevezys', 'Siauliai', 'Taurage', 'Telšiai', 'Utena', 'Vilnius', 'Visaginas'].map(S),
  EE: ['Harju', 'Hiiu', 'Ida-Viru', 'Jõgeva', 'Järva', 'Lääne', 'Lääne-Viru', 'Narva', 'Põlva', 'Pärnu', 'Rapla', 'Saare', 'Tartu', 'Valga', 'Viljandi', 'Võru'].map(S),
  LU: ['Capellen', 'Clervaux', 'Diekirch', 'Echternach', 'Esch-sur-Alzette', 'Grevenmacher', 'Luxembourg', 'Mersch', 'Redange', 'Remich', 'Vianden', 'Wiltz'].map(S),
  MT: ['Gozo', 'Malta'].map(S),
  CY: ['Famagusta', 'Kyrenia', 'Larnaca', 'Limassol', 'Nicosia', 'Paphos'].map(S),
  BG: ['Blagoevgrad', 'Burgas', 'Dobrich', 'Gabrovo', 'Haskovo', 'Kardzhali', 'Kyustendil', 'Lovech', 'Montana', 'Pazardzhik', 'Pernik', 'Pleven', 'Plovdiv', 'Razgrad', 'Ruse', 'Silistra', 'Sliven', 'Smolyan', 'Sofia', 'Sofia-Capital', 'Stara Zagora', 'Targovishte', 'Varna', 'Veliko Tarnovo', 'Vratsa', 'Yambol'].map(S),
  RO: ['Alba', 'Arad', 'Arges', 'Bacau', 'Bihor', 'Bistrita-Nasaud', 'Botosani', 'Brasov', 'Brancusi', 'Buzau', 'Calarasi', 'Caras-Severin', 'Cluj', 'Constanta', 'Covasna', 'Dambovita', 'Dolj', 'Galati', 'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara', 'Ialomita', 'Iasi', 'Ilfov', 'Maramures', 'Mehedinti', 'Municipiul Bucuresti', 'Neamt', 'Olt', 'Prahova', 'Salaj', 'Satu Mare', 'Sibiu', 'Suceava', 'Teleorman', 'Timis', 'Tulcea', 'Valcea', 'Vaslui', 'Vrancea'].map(S),
  HR: ['Bjelovarsko-Bilogorska', 'Brodsko-Posavska', 'Dubrovacko-Neretvanska', 'Grad Zagreb', 'Istarska', 'Karlovacka', 'Koprivnicko-Krizevacka', 'Krapinsko-Zagorska', 'Licko-Senjska', 'Meckimurska', 'Medimurska', 'Osjecko-Baranjska', 'Pozega-Slavonska', 'Primorsko-Goranska', 'Sisačko-Moslavačka', 'Splitsko-Dalmatinska', 'Šibensko-Kninska', 'Varaždinska', 'Virovitičko-Podravska', 'Vukovarsko-Srijemska', 'Zadarsko-Zibensko', 'Zagrebačka'].map(S),
};

export function getStatesForCountry(countryCode: string): StateOption[] {
  return COUNTRY_STATES[countryCode] || [{ value: 'other', label: 'Other' }];
}

// Addresses store the region slug (e.g. "england"); show the readable label.
export function getStateLabel(countryCode?: string, value?: string): string {
  if (!value) return '';
  const match = getStatesForCountry((countryCode ?? '').toUpperCase()).find(
    option => option.value.toLowerCase() === value.toLowerCase() || option.label.toLowerCase() === value.toLowerCase()
  );
  return match ? match.label : value;
}

export const GB_POSTCODE_REGEX = /^[A-Z]{1,2}[0-9R][0-9A-Z]?[ ]?[0-9][ABD-HJLNP-UW-Z]{2}$/i;
