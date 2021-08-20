
import { Selection } from 'd3'


export { GenderEnum } from './gender'

// encaptulate D3 Typings
export interface D3SVGSVGElementSelection extends Selection<SVGSVGElement | null, unknown, null, undefined> {}
export interface D3SVGGElementSelection extends Selection<SVGGElement | null, unknown, null, undefined> {}
export interface D3SVGTextElementSelection extends Selection<SVGTextElement | null, unknown, null, undefined> {}