"use client";

import { useId } from "react";

import {
  getCountries,
  getCountryCallingCode,
} from "libphonenumber-js";

import type {
  CountryCode,
} from "libphonenumber-js";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";

interface PhoneNumberInputProps {
  countryCode: CountryCode;
  onCountryChange: (value: CountryCode) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

const countryNames = new Intl.DisplayNames(
  ["en"],
  { type: "region" },
);

function getFlagEmoji(countryCode: string) {
  return String.fromCodePoint(
    ...Array.from(
      countryCode.toUpperCase(),
      (letter) => 127397 + letter.charCodeAt(0),
    ),
  );
}

const countries = getCountries()
  .map((code) => ({
    code,
    name: countryNames.of(code) ?? code,
    dialCode: `+${getCountryCallingCode(code)}`,
    flag: getFlagEmoji(code),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

function PhoneIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.56 3.58.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.19 2.46.56 3.58a1 1 0 0 1-.25 1.01l-2.19 2.2z" />
    </SvgIcon>
  );
}

export function PhoneNumberInput({
  countryCode,
  onCountryChange,
  phone,
  onPhoneChange,
  disabled = false,
  label = "Phone Number",
  id = "phone-number",
}: PhoneNumberInputProps) {
  const uniqueId = useId();
  const countryLabelId = `country-label-${uniqueId}`;

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      <FormControl
        sx={{
          width: { xs: 125, sm: 150 },
          flexShrink: 0,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
        disabled={disabled}
      >
        <InputLabel id={countryLabelId}>
          Code
        </InputLabel>

        <Select<CountryCode>
          labelId={countryLabelId}
          value={countryCode}
          label="Code"
          onChange={(event) =>
            onCountryChange(event.target.value as CountryCode)
          }
          renderValue={(selected) => {
            const country = countries.find(
              (item) => item.code === selected,
            );

            return country
              ? `${country.flag} ${country.dialCode}`
              : selected;
          }}
        >
          {countries.map((country) => (
            <MenuItem
              key={country.code}
              value={country.code}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography component="span">
                  {country.flag}
                </Typography>

                <Typography variant="body2">
                  {country.name} ({country.dialCode})
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        id={id}
        label={label}
        type="tel"
        fullWidth
        required
        value={phone}
        onChange={(event) => onPhoneChange(event.target.value)}
        disabled={disabled}
        placeholder="Enter phone number"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon color="action" />
              </InputAdornment>
            ),
          },
          htmlInput: {
            inputMode: "tel",
            autoComplete: "tel-national",
          },
        }}
        sx={{
          minWidth: 0,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
    </Stack>
  );
}