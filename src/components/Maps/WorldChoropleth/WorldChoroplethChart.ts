
import * as d3 from 'd3'
import { 
    D3DSVData, 
    D3GeoPath, 
    D3GeoProjection, 
    D3ScaleThreshold, 
    D3Selection, 
    Feature as GeoJSONFeature, 
    FeatureCollection as GeoJSONFeatureCollection,
} from '../../../models'
import { PoulationPerCountryMap } from './models'


export class WorldChoroplethChart {

    private readonly width: number = 400
    private readonly height: number = 300

    private readonly parent: SVGSVGElement = null
    private svg: D3Selection<SVGSVGElement> = null
    private mainGroup: D3Selection<SVGGElement> = null
    private colorScale: D3ScaleThreshold = null

    private geoPath: D3GeoPath = null
    private geoProjection: D3GeoProjection = null
    private choroplethMap: D3Selection<SVGPathElement> = null

    private topographyData: GeoJSONFeatureCollection = null
    private populationDataMap: PoulationPerCountryMap = new Map()
    
    constructor(
        parent: SVGSVGElement, 
        topographyData: GeoJSONFeatureCollection, 
        populationData: D3DSVData
    ) {
        this.parent = parent
        this.normalize(topographyData, populationData)
        this.initialize()
        this.draw()
    }

    private normalize(topographyData: GeoJSONFeatureCollection, populationData: D3DSVData): void {
        
        this.topographyData = topographyData
        
        populationData.forEach((country): void => {
            this.populationDataMap.set(country.code, Number(country.pop))
        })
    }

    private initialize(): void {

        this.svg = d3.select(this.parent)
            .attr('width', this.width)
            .attr('height', this.height)
        
        this.mainGroup = this.svg.append('g')

        this.colorScale = d3.scaleThreshold<number, string>()
            .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
            .range(d3.schemeBlues[7])

        this.geoPath = d3.geoPath()

        this.geoProjection = d3.geoMercator()
            .scale(70)
            .center([0,20])
            .translate([this.width / 2, this.height / 2])
    }

    private draw(): void {
        
        this.choroplethMap = this.mainGroup.append('g')
            .selectAll<SVGPathElement, unknown>('path')
                .data<GeoJSONFeature>(this.topographyData.features)
                .join('path')
                // draw each country
                .attr('d', d3.geoPath().projection(this.geoProjection))
                // set the color of each country
                .attr('fill', (d: GeoJSONFeature): string => {
                    const total: number = this.populationDataMap.get(String(d.id)) || 0
                    return this.colorScale(total)
                })
    }
}