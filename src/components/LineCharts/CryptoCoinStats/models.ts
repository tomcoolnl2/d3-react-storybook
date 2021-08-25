
import { CryptoCurrencyEnum } from './enums'

export type RawCryptoCoinData = {
    "24h_vol": string,
    date: string,
    market_cap: string,
    price_usd: string
}

export type CryptoCoinData = {
    volume24h: number,
    date: Date,
    marketCap: number,
    priceUSD: number
}

export type CryptoCoinDataOptions = {
    volume24h: string,
    marketCap: string,
    priceUSD: string
}

export type CryptoCoinDataOptionId = keyof CryptoCoinDataOptions

export type RawCryptoCoinStatistics = {
    [key in CryptoCurrencyEnum]?: RawCryptoCoinData[]
}

export type CryptoCoinStatistics = {
    [key in CryptoCurrencyEnum]?: CryptoCoinData[]
}
