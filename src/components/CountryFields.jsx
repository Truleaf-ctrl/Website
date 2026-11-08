import { useRef, useState } from 'react';
import { COUNTRIES } from '../lib/countries';

export function CountryOptions() {
  return (
    <>
      <option value="">Select your country</option>
      {COUNTRIES.map(([name]) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </>
  );
}

export function DialCodeOptions() {
  return (
    <>
      <option value="">Code</option>
      {COUNTRIES.map(([name, iso, dial]) => (
        <option key={iso} value={`+${dial}`} data-country={name}>
          {iso} +{dial}
        </option>
      ))}
    </>
  );
}

/**
 * Links a country <select> to a dial-code <select>: picking a country pre-selects its code
 * (the code can still be changed afterwards), and the code becomes required once a phone number is typed.
 */
export function useCountryPhone() {
  const codeRef = useRef(null);
  const [codeRequired, setCodeRequired] = useState(false);

  const onCountryChange = (e) => {
    const code = codeRef.current;
    if (!code) return;
    // +1 / +7 are shared by several countries, so land on the chosen country's own entry
    const own = [...code.options].find((o) => o.dataset.country === e.target.value);
    if (own) own.selected = true;
  };

  const onPhoneInput = (e) => setCodeRequired(e.target.value.trim() !== '');

  return { codeRef, codeRequired, onCountryChange, onPhoneInput };
}
