
export enum CountriesEnum {
    BE = 'Belgium',
    CA = 'Canada',
    DO = 'Dominican Republic',
    DE = 'Germany',
    IE = 'Ireland',
    IT = 'Italy',
    MX = 'Mexico',
    NL = 'Netherlands',
    PL = 'Poland',
    UK = 'United Kingdom',
    REST = 'Rest of the world'
}

export type RawStackedItem = {
    date: `${number}${number}${number}${number}`
    'Belgium': string,
    'Canada': string,
    'Dominican Republic': string,
    'Germany': string,
    'Ireland': string,
    'Italy': string,
    'Mexico': string,
    'Netherlands': string,
    'Poland': string,
    'United Kingdom': string,
    'Rest of the world': string,
}

export type StackedItem = {
    date: Date
    'Belgium': string,
    'Canada': string,
    'Dominican Republic': string,
    'Germany': string,
    'Ireland': string,
    'Italy': string,
    'Mexico': string,
    'Netherlands': string,
    'Poland': string,
    'United Kingdom': string,
    'Rest of the world': string
}

export type StackedItemIterable = StackedItem & Iterable<{ [key: string]: number }>