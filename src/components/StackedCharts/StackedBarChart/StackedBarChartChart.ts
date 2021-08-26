
import * as d3 from 'd3'
import { D3IterableStackData, D3Series, D3Stack, MarginCoords } from '../../../models'
import { 
    D3Axis, 
    D3ScaleBand, 
    D3ScaleLinear, 
    D3ScaleOrdinal, 
    D3Selection 
} from '../../../models'
import { CausesEnum } from './enums'
import { CrimeCauses, CrimeObservation, CrimeStatistics, RawCrimeStatistics } from './models'


export class StackedBarChartChart {
    
    private readonly fullWidth: number = 460
    private readonly fullHeight: number = 400
    private readonly margin: MarginCoords = { top: 10, right: 30, bottom: 20, left: 50   }
    private readonly width: number = this.fullWidth - this.margin.left - this.margin.right
    private readonly height: number = this.fullHeight - this.margin.top - this.margin.bottom

    private readonly parent: SVGSVGElement = null
    private svg: D3Selection<SVGSVGElement> = null
    private mainGroup: D3Selection<SVGGElement> = null
    
    private xScale: D3ScaleBand = null
    private yScale: D3ScaleLinear = null
    private colorScale: D3ScaleOrdinal = null
    
    private xAxis: D3Axis = null
    private yAxis: D3Axis = null

    private stack: D3Stack = null
    private data: CrimeStatistics = null

    subgroups: any
    groups: IterableIterator<number>

    constructor(parent: SVGSVGElement, data: any) {

        this.parent = parent

        this.normalize(data)

        this.initialize()
    }

    private normalize(data: any): void {

        // data ?? delete data.columns
        this.subgroups = data.columns.slice(1)
        this.groups = d3.map(data, function(d: any){ return(d.group) }).keys()

        this.data = data
    }

    private initialize(): void {

        this.stack = d3.stack()
        
        this.svg = d3.select(this.parent)
            .attr('width', this.fullWidth)
            .attr('height', this.fullHeight)

        this.mainGroup = this.svg.append('g')
                .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
        
        this.xScale = d3.scaleBand()
            .domain(this.groups as Iterable<string>)
            .range([0, this.width])
            .padding(0.2)

        this.yScale = d3.scaleLinear()
                .domain([0, 60])
                .range([this.height, 0])
        
        this.colorScale = d3.scaleOrdinal()
            .domain(this.subgroups)
            .range(d3.schemeCategory10)

        this.xAxis = d3.axisBottom(this.xScale).tickSizeOuter(0)
        this.yAxis = d3.axisLeft(this.yScale)

        this.draw()
    }

    private draw(): void {
        
        const stackGen = this.stack.keys(this.subgroups)
        const stackedSeries = stackGen(<D3IterableStackData>this.data)
        console.log('stackedSeries', stackedSeries)
        
        this.mainGroup.selectAll('g.series')
			.data(stackedSeries)
            .join('g')
            .enter().append('g')
                .attr('fill', (d) => {
                    console.log('color', d)
                    return this.colorScale(d.key)
                })
                .attr('x', (d) => { 
                    console.log(d)
                    return this.xScale(d.data.group) 
                })
                .attr('y', (d) => this.yScale(d[1]))
                .attr('height', (d) => this.yScale(d[0]) - this.yScale(d[1]))
                .attr('width', this.xScale.bandwidth)
    }
}
