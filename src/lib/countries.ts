export type CountryOption = {
  code: string;
  name: string;
  timeZone: string;
  flag: string;
  regionLabel?: string;
};

export const COUNTRIES: CountryOption[] = [
  { code: "NZ", name: "New Zealand", timeZone: "Pacific/Auckland", flag: "🇳🇿", regionLabel: "First to launch" },
  { code: "FJ", name: "Fiji", timeZone: "Pacific/Fiji", flag: "🇫🇯" },
  { code: "AU-SYD", name: "Australia (Sydney)", timeZone: "Australia/Sydney", flag: "🇦🇺" },
  { code: "AU-MEL", name: "Australia (Melbourne)", timeZone: "Australia/Melbourne", flag: "🇦🇺" },
  { code: "AU-BNE", name: "Australia (Brisbane)", timeZone: "Australia/Brisbane", flag: "🇦🇺" },
  { code: "AU-ADL", name: "Australia (Adelaide)", timeZone: "Australia/Adelaide", flag: "🇦🇺" },
  { code: "AU-PER", name: "Australia (Perth)", timeZone: "Australia/Perth", flag: "🇦🇺" },
  { code: "JP", name: "Japan", timeZone: "Asia/Tokyo", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", timeZone: "Asia/Seoul", flag: "🇰🇷" },
  { code: "SG", name: "Singapore", timeZone: "Asia/Singapore", flag: "🇸🇬" },
  { code: "MY", name: "Malaysia", timeZone: "Asia/Kuala_Lumpur", flag: "🇲🇾" },
  { code: "PH", name: "Philippines", timeZone: "Asia/Manila", flag: "🇵🇭" },
  { code: "HK", name: "Hong Kong", timeZone: "Asia/Hong_Kong", flag: "🇭🇰" },
  { code: "CN", name: "China", timeZone: "Asia/Shanghai", flag: "🇨🇳" },
  { code: "TH", name: "Thailand", timeZone: "Asia/Bangkok", flag: "🇹🇭" },
  { code: "VN", name: "Vietnam", timeZone: "Asia/Ho_Chi_Minh", flag: "🇻🇳" },
  { code: "ID-JKT", name: "Indonesia (Jakarta)", timeZone: "Asia/Jakarta", flag: "🇮🇩" },
  { code: "BD", name: "Bangladesh", timeZone: "Asia/Dhaka", flag: "🇧🇩" },
  { code: "IN", name: "India", timeZone: "Asia/Kolkata", flag: "🇮🇳" },
  { code: "NP", name: "Nepal", timeZone: "Asia/Kathmandu", flag: "🇳🇵" },
  { code: "PK", name: "Pakistan", timeZone: "Asia/Karachi", flag: "🇵🇰" },
  { code: "AE", name: "United Arab Emirates", timeZone: "Asia/Dubai", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", timeZone: "Asia/Riyadh", flag: "🇸🇦" },
  { code: "QA", name: "Qatar", timeZone: "Asia/Qatar", flag: "🇶🇦" },
  { code: "TR", name: "Türkiye", timeZone: "Europe/Istanbul", flag: "🇹🇷" },
  { code: "ZA", name: "South Africa", timeZone: "Africa/Johannesburg", flag: "🇿🇦" },
  { code: "EG", name: "Egypt", timeZone: "Africa/Cairo", flag: "🇪🇬" },
  { code: "NG", name: "Nigeria", timeZone: "Africa/Lagos", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", timeZone: "Africa/Nairobi", flag: "🇰🇪" },
  { code: "RU-MSK", name: "Russia (Moscow)", timeZone: "Europe/Moscow", flag: "🇷🇺" },
  { code: "FI", name: "Finland", timeZone: "Europe/Helsinki", flag: "🇫🇮" },
  { code: "GR", name: "Greece", timeZone: "Europe/Athens", flag: "🇬🇷" },
  { code: "DE", name: "Germany", timeZone: "Europe/Berlin", flag: "🇩🇪" },
  { code: "FR", name: "France", timeZone: "Europe/Paris", flag: "🇫🇷" },
  { code: "IT", name: "Italy", timeZone: "Europe/Rome", flag: "🇮🇹" },
  { code: "ES", name: "Spain", timeZone: "Europe/Madrid", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", timeZone: "Europe/Amsterdam", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", timeZone: "Europe/Stockholm", flag: "🇸🇪" },
  { code: "NO", name: "Norway", timeZone: "Europe/Oslo", flag: "🇳🇴" },
  { code: "PL", name: "Poland", timeZone: "Europe/Warsaw", flag: "🇵🇱" },
  { code: "GB", name: "United Kingdom", timeZone: "Europe/London", flag: "🇬🇧" },
  { code: "IE", name: "Ireland", timeZone: "Europe/Dublin", flag: "🇮🇪" },
  { code: "PT", name: "Portugal", timeZone: "Europe/Lisbon", flag: "🇵🇹" },
  { code: "BR-SP", name: "Brazil (São Paulo)", timeZone: "America/Sao_Paulo", flag: "🇧🇷" },
  { code: "AR", name: "Argentina", timeZone: "America/Argentina/Buenos_Aires", flag: "🇦🇷" },
  { code: "CL", name: "Chile", timeZone: "America/Santiago", flag: "🇨🇱" },
  { code: "CA-NL", name: "Canada (St. John's)", timeZone: "America/St_Johns", flag: "🇨🇦" },
  { code: "CA-HFX", name: "Canada (Halifax)", timeZone: "America/Halifax", flag: "🇨🇦" },
  { code: "US-NY", name: "United States (New York)", timeZone: "America/New_York", flag: "🇺🇸" },
  { code: "CA-TOR", name: "Canada (Toronto)", timeZone: "America/Toronto", flag: "🇨🇦" },
  { code: "US-CHI", name: "United States (Chicago)", timeZone: "America/Chicago", flag: "🇺🇸" },
  { code: "US-DEN", name: "United States (Denver)", timeZone: "America/Denver", flag: "🇺🇸" },
  { code: "US-PHX", name: "United States (Phoenix)", timeZone: "America/Phoenix", flag: "🇺🇸" },
  { code: "US-LA", name: "United States (Los Angeles)", timeZone: "America/Los_Angeles", flag: "🇺🇸" },
  { code: "CA-VAN", name: "Canada (Vancouver)", timeZone: "America/Vancouver", flag: "🇨🇦" },
  { code: "MX", name: "Mexico (Mexico City)", timeZone: "America/Mexico_City", flag: "🇲🇽" },
];

export const DEFAULT_COUNTRY_CODE = "PK";
export const REFERENCE_COUNTRY_CODE = "NZ";
