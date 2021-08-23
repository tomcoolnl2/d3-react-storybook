
export enum CryptoCurrencyEnum {
    BTC = 'bitcoin',
    BCH = 'bitcoin_cash',
    ETC = 'ethereum',
    LTC = 'litecoin',
    XRP = 'ripple'
}

export const cryptoCurrencies: CryptoCurrencyEnum[] = Object.values(CryptoCurrencyEnum)

export const cryptoCurrenciesAbbr: string[] = Object.keys(CryptoCurrencyEnum)

export const readableCryptoCurrencies: string[] = cryptoCurrencies.map((currency: CryptoCurrencyEnum): string => {
    return currency.split('_').map((str: string) => str.charAt(0).toUpperCase() + str.slice(1)).join(' ')
})