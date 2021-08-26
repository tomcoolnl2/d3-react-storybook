
import { D3DSVData } from '../../../models'
import { CausesEnum/*, causesList*/ } from './enums'


export type RawCrimeCauses = {
    [key in CausesEnum]: string
}

export type RawCrimeObservation = RawCrimeCauses & {
    date: string
    total: string
}

export type RawCrimeStatistics = D3DSVData


export type CrimeCauses = {} | {
    [key in CausesEnum]: number
}

export type CrimeObservation = CrimeCauses & {
    date: Date
    total: number
}

export type CrimeStatistics = CrimeObservation[]