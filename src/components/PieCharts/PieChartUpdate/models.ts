
import { DefaultArcObject } from 'd3'
import { D3InternMap, D3PieArcDatum } from '../../../models'


export type Product = 'Apples' | 'Oranges'

export type Region = 'Central' | 'North' | 'East' | 'South' | 'West'

export type ProductByRegion = {
    count: number
    fruit: Product
    region: Region
}

export type GroupedByProduct = D3InternMap<Product, ProductByRegion[]>

export type GroupedItem = [Product, ProductByRegion[]]

export type ArcData = D3PieArcDatum<ProductByRegion> & { _current?: any }

export type ArcAngle = Partial<DefaultArcObject>