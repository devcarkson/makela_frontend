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
