import * as Photo from '@/types/unsplash/photos';
import * as Collection from '@/types/unsplash/collections';

export declare type SearchOrderBy = 'relevant' | 'latest';

export declare type ColorId =
  | 'white'
  | 'black'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'purple'
  | 'magenta'
  | 'green'
  | 'teal'
  | 'blue'
  | 'black_and_white';

export declare type ContentFilter = 'high' | 'low';

export declare enum Language {
  Afrikaans = 'af',
  Amharic = 'am',
  Arabic = 'ar',
  Azerbaijani = 'az',
  Belarusian = 'be',
  Bulgarian = 'bg',
  Bengali = 'bn',
  Bosnian = 'bs',
  Catalan = 'ca',
  Cebuano = 'ceb',
  Corsican = 'co',
  Czech = 'cs',
  Welsh = 'cy',
  Danish = 'da',
  German = 'de',
  Greek = 'el',
  English = 'en',
  Esperanto = 'eo',
  Spanish = 'es',
  Estonian = 'et',
  Basque = 'eu',
  Persian = 'fa',
  Finnish = 'fi',
  French = 'fr',
  Frisian = 'fy',
  Irish = 'ga',
  ScotsGaelic = 'gd',
  Galician = 'gl',
  Gujarati = 'gu',
  Hausa = 'ha',
  Hawaiian = 'haw',
  Hindi = 'hi',
  Hmong = 'hmn',
  Croatian = 'hr',
  HaitianCreole = 'ht',
  Hungarian = 'hu',
  Armenian = 'hy',
  Indonesian = 'id',
  Igbo = 'ig',
  Icelandic = 'is',
  Italian = 'it',
  Hebrew = 'iw',
  Japanese = 'ja',
  Javanese = 'jw',
  Georgian = 'ka',
  Kazakh = 'kk',
  Khmer = 'km',
  Kannada = 'kn',
  Korean = 'ko',
  Kurdish = 'ku',
  Kyrgyz = 'ky',
  Latin = 'la',
  Luxembourgish = 'lb',
  Lao = 'lo',
  Lithuanian = 'lt',
  Latvian = 'lv',
  Malagasy = 'mg',
  Maori = 'mi',
  Macedonian = 'mk',
  Malayalam = 'ml',
  Mongolian = 'mn',
  Marathi = 'mr',
  Malay = 'ms',
  Maltese = 'mt',
  Myanmar = 'my',
  Nepali = 'ne',
  Dutch = 'nl',
  Norwegian = 'no',
  Nyanja = 'ny',
  Oriya = 'or',
  Punjabi = 'pa',
  Polish = 'pl',
  Pashto = 'ps',
  Portuguese = 'pt',
  Romanian = 'ro',
  Russian = 'ru',
  Kinyarwanda = 'rw',
  Sindhi = 'sd',
  Sinhala = 'si',
  Slovak = 'sk',
  Slovenian = 'sl',
  Samoan = 'sm',
  Shona = 'sn',
  Somali = 'so',
  Albanian = 'sq',
  Serbian = 'sr',
  Sesotho = 'st',
  Sundanese = 'su',
  Swedish = 'sv',
  Swahili = 'sw',
  Tamil = 'ta',
  Telugu = 'te',
  Tajik = 'tg',
  Thai = 'th',
  Turkmen = 'tk',
  Filipino = 'tl',
  Turkish = 'tr',
  Tatar = 'tt',
  Uighur = 'ug',
  Ukrainian = 'uk',
  Urdu = 'ur',
  Uzbek = 'uz',
  Vietnamese = 'vi',
  Xhosa = 'xh',
  Yiddish = 'yi',
  Yoruba = 'yo',
  ChineseSimplified = 'zh',
  ChineseTraditional = 'zh-TW',
  Zulu = 'zu',
}

export declare enum OrderBy {
  LATEST = 'latest',
  POPULAR = 'popular',
  VIEWS = 'views',
  DOWNLOADS = 'downloads',
  OLDEST = 'oldest',
}

export type Orientation = 'landscape' | 'portrait' | 'squarish';

interface Response<A> {
  results: A[];
  total: number;
  total_pages?: number;
}

export interface Photos extends Response<Photo.Basic> {}

export interface Collections extends Response<Collection.Basic> {}
