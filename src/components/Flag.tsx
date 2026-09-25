import React from 'react';

const flagUrls: Record<string, string> = {
  GB: 'https://flagcdn.com/20x15/gb.png',
  IE: 'https://flagcdn.com/20x15/ie.png',
  DE: 'https://flagcdn.com/20x15/de.png',
  FR: 'https://flagcdn.com/20x15/fr.png',
  ES: 'https://flagcdn.com/20x15/es.png',
  IT: 'https://flagcdn.com/20x15/it.png',
  NL: 'https://flagcdn.com/20x15/nl.png',
  BE: 'https://flagcdn.com/20x15/be.png',
  AT: 'https://flagcdn.com/20x15/at.png',
  PT: 'https://flagcdn.com/20x15/pt.png',
  CH: 'https://flagcdn.com/20x15/ch.png',
  SE: 'https://flagcdn.com/20x15/se.png',
  NO: 'https://flagcdn.com/20x15/no.png',
  DK: 'https://flagcdn.com/20x15/dk.png',
  FI: 'https://flagcdn.com/20x15/fi.png',
  PL: 'https://flagcdn.com/20x15/pl.png',
  CZ: 'https://flagcdn.com/20x15/cz.png',
  GR: 'https://flagcdn.com/20x15/gr.png',
  HU: 'https://flagcdn.com/20x15/hu.png',
  SK: 'https://flagcdn.com/20x15/sk.png',
  SI: 'https://flagcdn.com/20x15/si.png',
  LV: 'https://flagcdn.com/20x15/lv.png',
  LT: 'https://flagcdn.com/20x15/lt.png',
  EE: 'https://flagcdn.com/20x15/ee.png',
  LU: 'https://flagcdn.com/20x15/lu.png',
  MT: 'https://flagcdn.com/20x15/mt.png',
  CY: 'https://flagcdn.com/20x15/cy.png',
  BG: 'https://flagcdn.com/20x15/bg.png',
  RO: 'https://flagcdn.com/20x15/ro.png',
  HR: 'https://flagcdn.com/20x15/hr.png',
};

interface FlagProps {
  countryCode: string;
  className?: string;
}

const Flag: React.FC<FlagProps> = ({ countryCode, className }) => {
  const url = flagUrls[countryCode];
  if (!url) return null;

  return (
    <img
      src={url}
      alt={countryCode}
      width={20}
      height={15}
      loading="eager"
      decoding="async"
      className={className}
    />
  );
};

export default Flag;
