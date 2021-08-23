
import { 
    ScaleLinear, 
    ScaleLogarithmic, 
    ScaleOrdinal, 
    ScaleTime, 
    Selection, 
    Axis, 
    NumberValue, 
    Transition, 
    BaseType
} from 'd3'

// encaptulate D3 Typings
export interface D3ScaleLinear extends ScaleLinear<number, number, never> {}
export interface D3ScaleLog extends ScaleLogarithmic<number, number, never> {}
export interface D3ScaleOrdinal extends ScaleOrdinal<string, string, never> {}
export interface D3ScaleTime extends ScaleTime<number, number, never> {}

export interface D3AxisCall extends Axis<Date | NumberValue> {}

export interface D3SVGSVGElementSelection extends Selection<SVGSVGElement | null, unknown, null, undefined> {}
export interface D3SVGGElementSelection extends Selection<SVGGElement | null, unknown, null, undefined> {}
export interface D3SVGTextElementSelection extends Selection<SVGTextElement | null, unknown, null, undefined> {}
export interface D3SVGCircleElementSelection extends Selection<SVGCircleElement | null, unknown, null, undefined> {}
