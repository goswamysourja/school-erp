import {
  parsePhoneNumberFromString,
} from "libphonenumber-js";

import type {
  CountryCode,
} from "libphonenumber-js";

export function toE164PhoneNumber(
  phone: string,
  countryCode: CountryCode,
): string | null {
  try {
    const parsedPhone = parsePhoneNumberFromString(
      phone.trim(),
      countryCode,
    );

    if (!parsedPhone || !parsedPhone.isValid()) {
      return null;
    }

    return parsedPhone.number;
  } catch {
    return null;
  }
}