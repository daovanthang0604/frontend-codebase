export enum ProductCodeType {
  Upc = "Upc",
  Isrc = "Isrc",
}

export function isValidCode(code: string, type: ProductCodeType): boolean {
  if (!code) {
    return false
  }

  if (type === ProductCodeType.Upc) {
    return isValidUPCA(code) || isValidEAN13Code(code)
  }

  return isValidISRC(code)
}

function isValidEAN13Code(ean: string): boolean {
  // Check if the input is 13 digits long and contains only numeric characters
  if (ean.length !== 13 || !/^\d+$/.test(ean)) {
    return false
  }

  // Calculate the checksum digit
  const digits = ean.split("").map((c) => parseInt(c, 10))
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += i % 2 === 0 ? digits[i]! : digits[i]! * 3
  }
  const checksum = (10 - (sum % 10)) % 10

  // Compare the calculated checksum with the last digit of the EAN-13 code
  return checksum === digits[12]!
}

function isValidUPCA(upca: string): boolean {
  if (!upca || upca.length !== 12 || !/^\d+$/.test(upca)) {
    // Check if the input is not empty, has exactly 12 digits, and contains only digits.
    return false
  }

  let sumOdd = 0
  let sumEven = 0

  for (let i = 0; i < 11; i++) {
    const digit = parseInt(upca[i]!, 10)

    if (i % 2 === 0) {
      // Odd-positioned digits (1st, 3rd, 5th, etc.)
      sumOdd += digit
    } else {
      // Even-positioned digits (2nd, 4th, 6th, etc.)
      sumEven += digit
    }
  }

  const totalSum = sumOdd * 3 + sumEven
  const checkDigit = (10 - (totalSum % 10)) % 10

  // The calculated check digit should match the last digit of the UPC.
  return checkDigit === parseInt(upca[11]!, 10)
}

function isValidISRC(isrc: string): boolean {
  // Define a regular expression pattern for matching ISRC format.
  const pattern =
    /(^[A-Z]{2}-[A-Z0-9]{3}-\d{2}-\d{5}$)|(^[A-Z]{2}[A-Z0-9]{3}\d{2}\d{5}$)/

  // Use regex to match the input against the ISRC pattern.
  const isValid = pattern.test(isrc)

  if (isValid) {
    const countryCode = isrc.substring(0, 2)
    return (
      isValidCountryCode(countryCode) || isValidTwoCharactersIsrc(countryCode)
    )
  }

  return false
}

// prettier-ignore
const IsrcValidTwoFirstCharacters = [
  "AL", "DZ", "AD", "AO", "AI", "AG", "AR", "AM", "AW", "AU", "AT", "AZ",
  "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BM", "BO", "BA", "BR", "BP",
  "BX", "BC", "BK", "BG", "BF", "CM", "CA", "CB", "KY", "CL", "CN", "TW",
  "CO", "CD", "CI", "HR", "CU", "CW", "CY", "CZ", "DK", "GL", "FO", "DM",
  "DO", "EC", "EG", "SV", "EE", "ET", "FJ", "FI", "FR", "FX", "PF", "GM",
  "GE", "DE", "GH", "GI", "GR", "GD", "GT", "GG", "GY", "HT", "HN", "HK",
  "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IL", "IT", "JM", "JP", "JE",
  "JO", "KZ", "KE", "KR", "KS", "XK", "LA", "LV", "LB", "LS", "LI", "LT",
  "LU", "MO", "MK", "MW", "MY", "MV", "MT", "MU", "MX", "MD", "MC", "ME",
  "MS", "MA", "MZ", "NA", "NP", "NL", "NZ", "NG", "MP", "NO", "PK", "PA",
  "PY", "PE", "PH", "PL", "PT", "PR", "QA", "RO", "RU", "KN", "LC", "VC",
  "SM", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "ZA",
  "ZB", "ES", "LK", "SZ", "SE", "CH", "TZ", "TH", "TO", "TT", "TN", "TR",
  "DG", "UG", "UA", "AE", "GB", "UK", "GX", "US", "QM", "QT", "QZ", "UY",
  "UZ", "VU", "VE", "VN", "VG", "ZM", "ZW", "TC", "CP", "DG", "QN", "ZZ",
  "CS", "YU", "GH", "GI", "GR", "GD", "GT", "GG", "GY", "HT", "HN", "HK",
  "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IL", "IT", "JM", "JP", "JE",
  "JO", "KZ", "KE", "KR", "KS", "XK", "LA", "LV", "LB", "LS", "LI", "LT",
  "LU", "MO", "MK", "MW", "MY", "MV", "MT", "MU", "MX", "MD", "MC", "ME",
  "MS", "MA", "MZ", "NA", "NP", "NL", "NZ", "NG", "MP", "NO", "PK", "PA",
  "PG", "PY", "PE", "PH", "PL", "PT", "PR", "QA", "RO", "RU", "KN", "LC",
  "VC", "SM", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB",
  "ZA", "ZB", "ES", "LK", "SZ", "SE", "CH", "TZ", "TH", "TO", "TT", "TN",
  "TR", "DG", "UG", "UA", "AE", "GB", "UK", "GX", "US", "QM", "QT", "QZ",
  "UY", "UZ", "VU", "VE", "VN", "VG", "ZM", "ZW", "TC", "CP", "DG", "QN",
  "ZZ", "CS", "YU",
]

function isValidTwoCharactersIsrc(code: string): boolean {
  return IsrcValidTwoFirstCharacters.includes(code.toUpperCase())
}

function isValidCountryCode(countryCode: string): boolean {
  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" })
    const name = regionNames.of(countryCode)

    return !!name && name.toLowerCase() !== countryCode.toLowerCase()
  } catch {
    return false
  }
}
