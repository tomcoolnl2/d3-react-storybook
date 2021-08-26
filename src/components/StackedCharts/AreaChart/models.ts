
import { DSVRowArray } from 'd3'


export type RawMeasurement = DSVRowArray<string>

export type Measurement = {
    date: Date 
    value: number
}