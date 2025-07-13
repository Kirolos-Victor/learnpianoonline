<?php

namespace App\Services;

class LocationService
{
    /**
     * Get timezone based on country and optional state/city
     */
    public static function getTimezoneByLocation(string $country, ?string $stateProvince = null, ?string $city = null): string
    {
        $timezoneMap = self::getTimezoneMap();

        // First try to match with state/province for countries with multiple timezones
        if ($stateProvince && isset($timezoneMap[$country]['states'][$stateProvince])) {
            return $timezoneMap[$country]['states'][$stateProvince];
        }

        // Try to match with city
        if ($city && isset($timezoneMap[$country]['cities'][$city])) {
            return $timezoneMap[$country]['cities'][$city];
        }

        // Fall back to default timezone for the country
        if (isset($timezoneMap[$country]['default'])) {
            return $timezoneMap[$country]['default'];
        }

        // Ultimate fallback
        return 'UTC';
    }

    /**
     * Get list of countries with their display names
     */
    public static function getCountries(): array
    {
        return [
            'US' => 'United States',
            'CA' => 'Canada',
            'GB' => 'United Kingdom',
            'AU' => 'Australia',
            'DE' => 'Germany',
            'FR' => 'France',
            'IT' => 'Italy',
            'ES' => 'Spain',
            'NL' => 'Netherlands',
            'BE' => 'Belgium',
            'CH' => 'Switzerland',
            'AT' => 'Austria',
            'SE' => 'Sweden',
            'NO' => 'Norway',
            'DK' => 'Denmark',
            'FI' => 'Finland',
            'IE' => 'Ireland',
            'PT' => 'Portugal',
            'JP' => 'Japan',
            'KR' => 'South Korea',
            'CN' => 'China',
            'IN' => 'India',
            'BR' => 'Brazil',
            'MX' => 'Mexico',
            'AR' => 'Argentina',
            'CL' => 'Chile',
            'CO' => 'Colombia',
            'PE' => 'Peru',
            'VE' => 'Venezuela',
            'ZA' => 'South Africa',
            'EG' => 'Egypt',
            'MA' => 'Morocco',
            'NG' => 'Nigeria',
            'KE' => 'Kenya',
            'GH' => 'Ghana',
            'RU' => 'Russia',
            'UA' => 'Ukraine',
            'PL' => 'Poland',
            'CZ' => 'Czech Republic',
            'HU' => 'Hungary',
            'RO' => 'Romania',
            'BG' => 'Bulgaria',
            'HR' => 'Croatia',
            'SI' => 'Slovenia',
            'SK' => 'Slovakia',
            'LT' => 'Lithuania',
            'LV' => 'Latvia',
            'EE' => 'Estonia',
            'ID' => 'Indonesia',
            'MY' => 'Malaysia',
            'SG' => 'Singapore',
            'TH' => 'Thailand',
            'VN' => 'Vietnam',
            'PH' => 'Philippines',
            'NZ' => 'New Zealand',
            'TR' => 'Turkey',
            'IL' => 'Israel',
            'SA' => 'Saudi Arabia',
            'AE' => 'United Arab Emirates',
            'QA' => 'Qatar',
            'KW' => 'Kuwait',
            'BH' => 'Bahrain',
            'OM' => 'Oman',
        ];
    }

    /**
     * Get countries that require state/province selection for accurate timezone detection
     */
    public static function getCountriesRequiringStateSelection(): array
    {
        return ['US', 'CA', 'AU'];
    }

    /**
     * Check if a country requires state/province selection for timezone accuracy
     */
    public static function countryRequiresStateSelection(string $countryCode): bool
    {
        return in_array($countryCode, self::getCountriesRequiringStateSelection());
    }

    /**
     * Get US states
     */
    public static function getUSStates(): array
    {
        return [
            'AL' => 'Alabama',
            'AK' => 'Alaska',
            'AZ' => 'Arizona',
            'AR' => 'Arkansas',
            'CA' => 'California',
            'CO' => 'Colorado',
            'CT' => 'Connecticut',
            'DE' => 'Delaware',
            'FL' => 'Florida',
            'GA' => 'Georgia',
            'HI' => 'Hawaii',
            'ID' => 'Idaho',
            'IL' => 'Illinois',
            'IN' => 'Indiana',
            'IA' => 'Iowa',
            'KS' => 'Kansas',
            'KY' => 'Kentucky',
            'LA' => 'Louisiana',
            'ME' => 'Maine',
            'MD' => 'Maryland',
            'MA' => 'Massachusetts',
            'MI' => 'Michigan',
            'MN' => 'Minnesota',
            'MS' => 'Mississippi',
            'MO' => 'Missouri',
            'MT' => 'Montana',
            'NE' => 'Nebraska',
            'NV' => 'Nevada',
            'NH' => 'New Hampshire',
            'NJ' => 'New Jersey',
            'NM' => 'New Mexico',
            'NY' => 'New York',
            'NC' => 'North Carolina',
            'ND' => 'North Dakota',
            'OH' => 'Ohio',
            'OK' => 'Oklahoma',
            'OR' => 'Oregon',
            'PA' => 'Pennsylvania',
            'RI' => 'Rhode Island',
            'SC' => 'South Carolina',
            'SD' => 'South Dakota',
            'TN' => 'Tennessee',
            'TX' => 'Texas',
            'UT' => 'Utah',
            'VT' => 'Vermont',
            'VA' => 'Virginia',
            'WA' => 'Washington',
            'WV' => 'West Virginia',
            'WI' => 'Wisconsin',
            'WY' => 'Wyoming',
        ];
    }

    /**
     * Get Canadian provinces
     */
    public static function getCanadianProvinces(): array
    {
        return [
            'AB' => 'Alberta',
            'BC' => 'British Columbia',
            'MB' => 'Manitoba',
            'NB' => 'New Brunswick',
            'NL' => 'Newfoundland and Labrador',
            'NS' => 'Nova Scotia',
            'ON' => 'Ontario',
            'PE' => 'Prince Edward Island',
            'QC' => 'Quebec',
            'SK' => 'Saskatchewan',
            'NT' => 'Northwest Territories',
            'NU' => 'Nunavut',
            'YT' => 'Yukon',
        ];
    }

    /**
     * Get cities/states based on country
     */
    public static function getLocationsByCountry(string $countryCode): array
    {
        $locations = [
            'US' => self::getUSStates(),
            'CA' => self::getCanadianProvinces(),
            'GB' => [
                'England' => 'England',
                'Scotland' => 'Scotland',
                'Wales' => 'Wales',
                'Northern Ireland' => 'Northern Ireland',
            ],
            'AU' => [
                'NSW' => 'New South Wales',
                'VIC' => 'Victoria',
                'QLD' => 'Queensland',
                'WA' => 'Western Australia',
                'SA' => 'South Australia',
                'TAS' => 'Tasmania',
                'NT' => 'Northern Territory',
                'ACT' => 'Australian Capital Territory',
            ],
            'DE' => [
                'Berlin' => 'Berlin',
                'Hamburg' => 'Hamburg',
                'Munich' => 'Munich',
                'Cologne' => 'Cologne',
                'Frankfurt' => 'Frankfurt',
                'Stuttgart' => 'Stuttgart',
                'Düsseldorf' => 'Düsseldorf',
                'Dortmund' => 'Dortmund',
                'Essen' => 'Essen',
                'Leipzig' => 'Leipzig',
            ],
            'FR' => [
                'Paris' => 'Paris',
                'Marseille' => 'Marseille',
                'Lyon' => 'Lyon',
                'Toulouse' => 'Toulouse',
                'Nice' => 'Nice',
                'Nantes' => 'Nantes',
                'Strasbourg' => 'Strasbourg',
                'Montpellier' => 'Montpellier',
                'Bordeaux' => 'Bordeaux',
                'Lille' => 'Lille',
            ],
            'IT' => [
                'Rome' => 'Rome',
                'Milan' => 'Milan',
                'Naples' => 'Naples',
                'Turin' => 'Turin',
                'Palermo' => 'Palermo',
                'Genoa' => 'Genoa',
                'Bologna' => 'Bologna',
                'Florence' => 'Florence',
                'Bari' => 'Bari',
                'Catania' => 'Catania',
            ],
            'ES' => [
                'Madrid' => 'Madrid',
                'Barcelona' => 'Barcelona',
                'Valencia' => 'Valencia',
                'Seville' => 'Seville',
                'Zaragoza' => 'Zaragoza',
                'Málaga' => 'Málaga',
                'Murcia' => 'Murcia',
                'Palma' => 'Palma',
                'Las Palmas' => 'Las Palmas',
                'Bilbao' => 'Bilbao',
            ],
            'NL' => [
                'Amsterdam' => 'Amsterdam',
                'Rotterdam' => 'Rotterdam',
                'The Hague' => 'The Hague',
                'Utrecht' => 'Utrecht',
                'Eindhoven' => 'Eindhoven',
                'Tilburg' => 'Tilburg',
                'Groningen' => 'Groningen',
                'Almere' => 'Almere',
                'Breda' => 'Breda',
                'Nijmegen' => 'Nijmegen',
            ],
            'JP' => [
                'Tokyo' => 'Tokyo',
                'Osaka' => 'Osaka',
                'Kyoto' => 'Kyoto',
                'Yokohama' => 'Yokohama',
                'Nagoya' => 'Nagoya',
                'Kobe' => 'Kobe',
                'Fukuoka' => 'Fukuoka',
                'Sapporo' => 'Sapporo',
                'Hiroshima' => 'Hiroshima',
                'Sendai' => 'Sendai',
            ],
            'KR' => [
                'Seoul' => 'Seoul',
                'Busan' => 'Busan',
                'Incheon' => 'Incheon',
                'Daegu' => 'Daegu',
                'Daejeon' => 'Daejeon',
                'Gwangju' => 'Gwangju',
                'Ulsan' => 'Ulsan',
                'Changwon' => 'Changwon',
                'Goyang' => 'Goyang',
                'Yongin' => 'Yongin',
            ],
            'BR' => [
                'São Paulo' => 'São Paulo',
                'Rio de Janeiro' => 'Rio de Janeiro',
                'Brasília' => 'Brasília',
                'Salvador' => 'Salvador',
                'Belo Horizonte' => 'Belo Horizonte',
                'Fortaleza' => 'Fortaleza',
                'Manaus' => 'Manaus',
                'Curitiba' => 'Curitiba',
                'Recife' => 'Recife',
                'Porto Alegre' => 'Porto Alegre',
            ],
            'MX' => [
                'Mexico City' => 'Mexico City',
                'Guadalajara' => 'Guadalajara',
                'Monterrey' => 'Monterrey',
                'Puebla' => 'Puebla',
                'Tijuana' => 'Tijuana',
                'León' => 'León',
                'Juárez' => 'Juárez',
                'Zapopan' => 'Zapopan',
                'Mérida' => 'Mérida',
                'San Luis Potosí' => 'San Luis Potosí',
            ],
            'IN' => [
                'Mumbai' => 'Mumbai',
                'Delhi' => 'Delhi',
                'Bangalore' => 'Bangalore',
                'Hyderabad' => 'Hyderabad',
                'Chennai' => 'Chennai',
                'Kolkata' => 'Kolkata',
                'Pune' => 'Pune',
                'Ahmedabad' => 'Ahmedabad',
                'Jaipur' => 'Jaipur',
                'Surat' => 'Surat',
            ],
        ];

        return $locations[$countryCode] ?? [];
    }

    /**
     * Get country code (phone) for a specific country
     */
    public static function getCountryPhoneCode(string $countryCode): string
    {
        $phoneCodes = [
            'US' => '+1',
            'CA' => '+1',
            'GB' => '+44',
            'AU' => '+61',
            'DE' => '+49',
            'FR' => '+33',
            'IT' => '+39',
            'ES' => '+34',
            'NL' => '+31',
            'BE' => '+32',
            'CH' => '+41',
            'AT' => '+43',
            'SE' => '+46',
            'NO' => '+47',
            'DK' => '+45',
            'FI' => '+358',
            'IE' => '+353',
            'PT' => '+351',
            'JP' => '+81',
            'KR' => '+82',
            'CN' => '+86',
            'IN' => '+91',
            'BR' => '+55',
            'MX' => '+52',
            'AR' => '+54',
            'CL' => '+56',
            'CO' => '+57',
            'PE' => '+51',
            'VE' => '+58',
            'ZA' => '+27',
            'EG' => '+20',
            'MA' => '+212',
            'NG' => '+234',
            'KE' => '+254',
            'GH' => '+233',
            'RU' => '+7',
            'UA' => '+380',
            'PL' => '+48',
            'CZ' => '+420',
            'HU' => '+36',
            'RO' => '+40',
            'BG' => '+359',
            'HR' => '+385',
            'SI' => '+386',
            'SK' => '+421',
            'LT' => '+370',
            'LV' => '+371',
            'EE' => '+372',
            'ID' => '+62',
            'MY' => '+60',
            'SG' => '+65',
            'TH' => '+66',
            'VN' => '+84',
            'PH' => '+63',
            'NZ' => '+64',
            'TR' => '+90',
            'IL' => '+972',
            'SA' => '+966',
            'AE' => '+971',
            'QA' => '+974',
            'KW' => '+965',
            'BH' => '+973',
            'OM' => '+968',
        ];

        return $phoneCodes[$countryCode] ?? '+1';
    }

    /**
     * Get all country phone codes
     */
    public static function getAllCountryPhoneCodes(): array
    {
        $countries = self::getCountries();
        $result = [];

        foreach ($countries as $code => $name) {
            $result[$code] = [
                'name' => $name,
                'phone_code' => self::getCountryPhoneCode($code),
            ];
        }

        return $result;
    }

    /**
     * Comprehensive timezone mapping
     */
    private static function getTimezoneMap(): array
    {
        return [
            'US' => [
                'default' => 'America/New_York',
                'states' => [
                    'AL' => 'America/Chicago',
                    'AK' => 'America/Anchorage',
                    'AZ' => 'America/Phoenix',
                    'AR' => 'America/Chicago',
                    'CA' => 'America/Los_Angeles',
                    'CO' => 'America/Denver',
                    'CT' => 'America/New_York',
                    'DE' => 'America/New_York',
                    'FL' => 'America/New_York',
                    'GA' => 'America/New_York',
                    'HI' => 'Pacific/Honolulu',
                    'ID' => 'America/Denver',
                    'IL' => 'America/Chicago',
                    'IN' => 'America/New_York',
                    'IA' => 'America/Chicago',
                    'KS' => 'America/Chicago',
                    'KY' => 'America/New_York',
                    'LA' => 'America/Chicago',
                    'ME' => 'America/New_York',
                    'MD' => 'America/New_York',
                    'MA' => 'America/New_York',
                    'MI' => 'America/New_York',
                    'MN' => 'America/Chicago',
                    'MS' => 'America/Chicago',
                    'MO' => 'America/Chicago',
                    'MT' => 'America/Denver',
                    'NE' => 'America/Chicago',
                    'NV' => 'America/Los_Angeles',
                    'NH' => 'America/New_York',
                    'NJ' => 'America/New_York',
                    'NM' => 'America/Denver',
                    'NY' => 'America/New_York',
                    'NC' => 'America/New_York',
                    'ND' => 'America/Chicago',
                    'OH' => 'America/New_York',
                    'OK' => 'America/Chicago',
                    'OR' => 'America/Los_Angeles',
                    'PA' => 'America/New_York',
                    'RI' => 'America/New_York',
                    'SC' => 'America/New_York',
                    'SD' => 'America/Chicago',
                    'TN' => 'America/Chicago',
                    'TX' => 'America/Chicago',
                    'UT' => 'America/Denver',
                    'VT' => 'America/New_York',
                    'VA' => 'America/New_York',
                    'WA' => 'America/Los_Angeles',
                    'WV' => 'America/New_York',
                    'WI' => 'America/Chicago',
                    'WY' => 'America/Denver',
                ],
            ],
            'CA' => [
                'default' => 'America/Toronto',
                'states' => [
                    'AB' => 'America/Edmonton',
                    'BC' => 'America/Vancouver',
                    'MB' => 'America/Winnipeg',
                    'NB' => 'America/Moncton',
                    'NL' => 'America/St_Johns',
                    'NS' => 'America/Halifax',
                    'ON' => 'America/Toronto',
                    'PE' => 'America/Halifax',
                    'QC' => 'America/Montreal',
                    'SK' => 'America/Regina',
                    'NT' => 'America/Edmonton',
                    'NU' => 'America/Iqaluit',
                    'YT' => 'America/Whitehorse',
                ],
            ],
            'GB' => [
                'default' => 'Europe/London',
                'states' => [
                    'England' => 'Europe/London',
                    'Scotland' => 'Europe/London',
                    'Wales' => 'Europe/London',
                    'Northern Ireland' => 'Europe/London',
                ],
            ],
            'AU' => [
                'default' => 'Australia/Sydney',
                'states' => [
                    'NSW' => 'Australia/Sydney',
                    'VIC' => 'Australia/Melbourne',
                    'QLD' => 'Australia/Brisbane',
                    'WA' => 'Australia/Perth',
                    'SA' => 'Australia/Adelaide',
                    'TAS' => 'Australia/Hobart',
                    'NT' => 'Australia/Darwin',
                    'ACT' => 'Australia/Sydney',
                ],
            ],
            'DE' => [
                'default' => 'Europe/Berlin',
                'cities' => [
                    'Berlin' => 'Europe/Berlin',
                    'Hamburg' => 'Europe/Berlin',
                    'Munich' => 'Europe/Berlin',
                    'Cologne' => 'Europe/Berlin',
                    'Frankfurt' => 'Europe/Berlin',
                    'Stuttgart' => 'Europe/Berlin',
                    'Düsseldorf' => 'Europe/Berlin',
                    'Dortmund' => 'Europe/Berlin',
                    'Essen' => 'Europe/Berlin',
                    'Leipzig' => 'Europe/Berlin',
                ],
            ],
            'FR' => [
                'default' => 'Europe/Paris',
                'cities' => [
                    'Paris' => 'Europe/Paris',
                    'Marseille' => 'Europe/Paris',
                    'Lyon' => 'Europe/Paris',
                    'Toulouse' => 'Europe/Paris',
                    'Nice' => 'Europe/Paris',
                    'Nantes' => 'Europe/Paris',
                    'Strasbourg' => 'Europe/Paris',
                    'Montpellier' => 'Europe/Paris',
                    'Bordeaux' => 'Europe/Paris',
                    'Lille' => 'Europe/Paris',
                ],
            ],
            'IT' => [
                'default' => 'Europe/Rome',
                'cities' => [
                    'Rome' => 'Europe/Rome',
                    'Milan' => 'Europe/Rome',
                    'Naples' => 'Europe/Rome',
                    'Turin' => 'Europe/Rome',
                    'Palermo' => 'Europe/Rome',
                    'Genoa' => 'Europe/Rome',
                    'Bologna' => 'Europe/Rome',
                    'Florence' => 'Europe/Rome',
                    'Bari' => 'Europe/Rome',
                    'Catania' => 'Europe/Rome',
                ],
            ],
            'ES' => [
                'default' => 'Europe/Madrid',
                'cities' => [
                    'Madrid' => 'Europe/Madrid',
                    'Barcelona' => 'Europe/Madrid',
                    'Valencia' => 'Europe/Madrid',
                    'Seville' => 'Europe/Madrid',
                    'Zaragoza' => 'Europe/Madrid',
                    'Málaga' => 'Europe/Madrid',
                    'Murcia' => 'Europe/Madrid',
                    'Palma' => 'Europe/Madrid',
                    'Las Palmas' => 'Atlantic/Canary',
                    'Bilbao' => 'Europe/Madrid',
                ],
            ],
            'NL' => [
                'default' => 'Europe/Amsterdam',
                'cities' => [
                    'Amsterdam' => 'Europe/Amsterdam',
                    'Rotterdam' => 'Europe/Amsterdam',
                    'The Hague' => 'Europe/Amsterdam',
                    'Utrecht' => 'Europe/Amsterdam',
                    'Eindhoven' => 'Europe/Amsterdam',
                    'Tilburg' => 'Europe/Amsterdam',
                    'Groningen' => 'Europe/Amsterdam',
                    'Almere' => 'Europe/Amsterdam',
                    'Breda' => 'Europe/Amsterdam',
                    'Nijmegen' => 'Europe/Amsterdam',
                ],
            ],
            'BE' => ['default' => 'Europe/Brussels'],
            'CH' => ['default' => 'Europe/Zurich'],
            'AT' => ['default' => 'Europe/Vienna'],
            'SE' => ['default' => 'Europe/Stockholm'],
            'NO' => ['default' => 'Europe/Oslo'],
            'DK' => ['default' => 'Europe/Copenhagen'],
            'FI' => ['default' => 'Europe/Helsinki'],
            'IE' => ['default' => 'Europe/Dublin'],
            'PT' => ['default' => 'Europe/Lisbon'],
            'JP' => [
                'default' => 'Asia/Tokyo',
                'cities' => [
                    'Tokyo' => 'Asia/Tokyo',
                    'Osaka' => 'Asia/Tokyo',
                    'Kyoto' => 'Asia/Tokyo',
                    'Yokohama' => 'Asia/Tokyo',
                    'Nagoya' => 'Asia/Tokyo',
                    'Kobe' => 'Asia/Tokyo',
                    'Fukuoka' => 'Asia/Tokyo',
                    'Sapporo' => 'Asia/Tokyo',
                    'Hiroshima' => 'Asia/Tokyo',
                    'Sendai' => 'Asia/Tokyo',
                ],
            ],
            'KR' => [
                'default' => 'Asia/Seoul',
                'cities' => [
                    'Seoul' => 'Asia/Seoul',
                    'Busan' => 'Asia/Seoul',
                    'Incheon' => 'Asia/Seoul',
                    'Daegu' => 'Asia/Seoul',
                    'Daejeon' => 'Asia/Seoul',
                    'Gwangju' => 'Asia/Seoul',
                    'Ulsan' => 'Asia/Seoul',
                    'Changwon' => 'Asia/Seoul',
                    'Goyang' => 'Asia/Seoul',
                    'Yongin' => 'Asia/Seoul',
                ],
            ],
            'CN' => ['default' => 'Asia/Shanghai'],
            'IN' => [
                'default' => 'Asia/Kolkata',
                'cities' => [
                    'Mumbai' => 'Asia/Kolkata',
                    'Delhi' => 'Asia/Kolkata',
                    'Bangalore' => 'Asia/Kolkata',
                    'Hyderabad' => 'Asia/Kolkata',
                    'Chennai' => 'Asia/Kolkata',
                    'Kolkata' => 'Asia/Kolkata',
                    'Pune' => 'Asia/Kolkata',
                    'Ahmedabad' => 'Asia/Kolkata',
                    'Jaipur' => 'Asia/Kolkata',
                    'Surat' => 'Asia/Kolkata',
                ],
            ],
            'BR' => [
                'default' => 'America/Sao_Paulo',
                'cities' => [
                    'São Paulo' => 'America/Sao_Paulo',
                    'Rio de Janeiro' => 'America/Sao_Paulo',
                    'Brasília' => 'America/Sao_Paulo',
                    'Salvador' => 'America/Bahia',
                    'Belo Horizonte' => 'America/Sao_Paulo',
                    'Fortaleza' => 'America/Fortaleza',
                    'Manaus' => 'America/Manaus',
                    'Curitiba' => 'America/Sao_Paulo',
                    'Recife' => 'America/Recife',
                    'Porto Alegre' => 'America/Sao_Paulo',
                ],
            ],
            'MX' => [
                'default' => 'America/Mexico_City',
                'cities' => [
                    'Mexico City' => 'America/Mexico_City',
                    'Guadalajara' => 'America/Mexico_City',
                    'Monterrey' => 'America/Monterrey',
                    'Puebla' => 'America/Mexico_City',
                    'Tijuana' => 'America/Tijuana',
                    'León' => 'America/Mexico_City',
                    'Juárez' => 'America/Ojinaga',
                    'Zapopan' => 'America/Mexico_City',
                    'Mérida' => 'America/Merida',
                    'San Luis Potosí' => 'America/Mexico_City',
                ],
            ],
            'AR' => ['default' => 'America/Argentina/Buenos_Aires'],
            'CL' => ['default' => 'America/Santiago'],
            'CO' => ['default' => 'America/Bogota'],
            'PE' => ['default' => 'America/Lima'],
            'VE' => ['default' => 'America/Caracas'],
            'ZA' => ['default' => 'Africa/Johannesburg'],
            'EG' => ['default' => 'Africa/Cairo'],
            'MA' => ['default' => 'Africa/Casablanca'],
            'NG' => ['default' => 'Africa/Lagos'],
            'KE' => ['default' => 'Africa/Nairobi'],
            'GH' => ['default' => 'Africa/Accra'],
            'RU' => ['default' => 'Europe/Moscow'],
            'UA' => ['default' => 'Europe/Kiev'],
            'PL' => ['default' => 'Europe/Warsaw'],
            'CZ' => ['default' => 'Europe/Prague'],
            'HU' => ['default' => 'Europe/Budapest'],
            'RO' => ['default' => 'Europe/Bucharest'],
            'BG' => ['default' => 'Europe/Sofia'],
            'HR' => ['default' => 'Europe/Zagreb'],
            'SI' => ['default' => 'Europe/Ljubljana'],
            'SK' => ['default' => 'Europe/Bratislava'],
            'LT' => ['default' => 'Europe/Vilnius'],
            'LV' => ['default' => 'Europe/Riga'],
            'EE' => ['default' => 'Europe/Tallinn'],
            'ID' => ['default' => 'Asia/Jakarta'],
            'MY' => ['default' => 'Asia/Kuala_Lumpur'],
            'SG' => ['default' => 'Asia/Singapore'],
            'TH' => ['default' => 'Asia/Bangkok'],
            'VN' => ['default' => 'Asia/Ho_Chi_Minh'],
            'PH' => ['default' => 'Asia/Manila'],
            'NZ' => ['default' => 'Pacific/Auckland'],
            'TR' => ['default' => 'Europe/Istanbul'],
            'IL' => ['default' => 'Asia/Jerusalem'],
            'SA' => ['default' => 'Asia/Riyadh'],
            'AE' => ['default' => 'Asia/Dubai'],
            'QA' => ['default' => 'Asia/Qatar'],
            'KW' => ['default' => 'Asia/Kuwait'],
            'BH' => ['default' => 'Asia/Bahrain'],
            'OM' => ['default' => 'Asia/Muscat'],
        ];
    }
}
