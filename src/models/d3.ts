
import { 
    ScaleLinear, 
    ScaleLogarithmic, 
    ScaleOrdinal, 
    ScaleTime, 
    Selection, 
    Axis,
    Stack,
    Series,
    ScaleBand,
    DSVRowArray,
    BaseType,
    Transition,
    Area,
    ScaleThreshold,
    GeoPath,
    GeoPermissibleObjects,
    GeoProjection,
    NumberValue,
    Pie,
    DefaultArcObject,
    Arc,
    InternMap,
    PieArcDatum,
    HierarchyRectangularNode
} from 'd3'


export interface D3DSVData extends DSVRowArray<string> {}

// Maybe we need this in future cases:
// export interface D3Selection<T extends BaseType, V = unknown, PT extends BaseType = null, PV = undefined> extends Selection<T, V, PT, PV> {}
export interface D3Selection<T extends BaseType> extends Selection<T, any, any, any> {}
export interface D3Transition extends Transition<any, any, any, any> {}

export interface D3ScaleLinear extends ScaleLinear<number, number, never> {}
export interface D3ScaleLog extends ScaleLogarithmic<number, number, never> {}
export interface D3ScaleOrdinal extends ScaleOrdinal<string, any, never> {}
export interface D3ScaleTime extends ScaleTime<number, number, never> {}
export interface D3ScaleBand extends ScaleBand<string> {}
export interface D3ScaleThreshold extends ScaleThreshold<any, any, never> {}

export interface D3Axis extends Axis<any> {}

export interface D3Area<T = any> extends Area<T> {}
export interface D3AreaShape<T = any> { [key: number]: number, data: T }
export interface D3Stack extends Stack<any, { [key: string]: number }, string | string[]> {}
export interface D3IterableStackData extends Iterable<{ [key: string]: number }> {}
export interface D3Series extends Series<{ [key: string]: number }, string> {}
export interface D3InternMap<K = any, V = any> extends InternMap<K, V> {}

export interface D3GeoPath extends GeoPath<any, GeoPermissibleObjects> {}
export interface D3GeoProjection extends GeoProjection {}

export interface D3Pie<T = NumberValue> extends Pie<any, T> {}
export interface D3Arc<T = DefaultArcObject> extends Arc<any, T> {}
export interface D3PieArcDatum<T = any> extends PieArcDatum<T> {}

export interface D3HierarchyRectangularNode<T = unknown> extends HierarchyRectangularNode<T> {}