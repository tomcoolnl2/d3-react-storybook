

export type Country = {
    continent: string
    country: string
    income: number,
    life_exp: number,
    population: number
}

export type PublicationData = {
    countries: Country[]
    year: `${number}${number}${number}${number}`
}

export enum ContinentsEnum {
	ALL = 'all',
	EU = 'europe',
	AS = 'asia',
	AM = 'americas',
	AF = 'africa'
}

export const continentList = Object.values(ContinentsEnum)

export const continentReadableList = continentList.map((continent: string) => {
    return continent.charAt(0).toUpperCase() + continent.slice(1)
})
