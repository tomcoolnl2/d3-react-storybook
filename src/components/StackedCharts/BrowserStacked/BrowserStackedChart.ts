/**
    Adapted from Maggie Lee at bl.ocks.org
    https://bl.ocks.org/greencracker/e08d5e789737e91d6e73d7dcc34969bf
**/

import * as d3 from 'd3'
import { 
    D3Axis, 
    D3ScaleLinear, 
    D3ScaleOrdinal, 
    D3ScaleTime, 
    D3SVGGElementSelection, 
    D3Selection,
    D3Stack,
    MarginCoords 
} from '../../../models'
import { CountriesEnum, RawStackedItem, StackedItem } from './models'


export class BrowserStackedChart {

    // Measurements to calculate with
    private readonly fullWidth: number = 600
    private readonly fullHeight: number = 400
    private readonly margin: MarginCoords = { top: 20, right: 100, bottom: 30, left: 50 }
    private readonly width: number = this.fullWidth - this.margin.left - this.margin.right
    private readonly height: number = this.fullHeight - this.margin.top - this.margin.bottom

    private data: StackedItem[] = null

    // D3/SVG Elements
	private readonly parent: SVGSVGElement = null
    private stack: D3Stack = null
	private svg: D3Selection<SVGSVGElement> = null
	private mainGroup: D3SVGGElementSelection = null
	private xScale: D3ScaleTime = null
	private yScale: D3ScaleLinear = null
    private colorScale: D3ScaleOrdinal = null

    private xAxis: D3Axis = null
    private yAxis: D3Axis = null
    area: d3.Area<StackedItem[]>

    constructor(parent: SVGSVGElement, data: RawStackedItem[]) {

        this.parent = parent

        this.normalize(data)

        this.initialize()

        this.draw()
    }

    private normalize(data: RawStackedItem[]): void {
        console.log('normalize',data)
        const formattedData: StackedItem[] = data.map((d: RawStackedItem): StackedItem => ({
            ...d,
            date: d3.timeParse('%Y')(d.date),
        }))

        this.data = formattedData
    }

    private initialize(): void {
        
        this.stack = d3.stack()

        this.svg = d3.select(this.parent)
            .attr('width', this.fullWidth)
            .attr('height', this.fullHeight)
        
        this.mainGroup = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        // Scales
        this.xScale = d3.scaleTime().range([0, this.width])

        this.yScale = d3.scaleLinear().range([this.height, 0])

        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10)

        // Axes
        this.xAxis = d3.axisBottom(this.xScale).scale(this.xScale)

        this.yAxis = d3.axisLeft(this.yScale)
            .scale(this.xScale)
            .tickFormat(x => this.formatBillion(x as number))
        
        this.area = d3.area<StackedItem[]>()
            .x((d) => this.xScale(((d as unknown) as { date: number }).date))
            .y0(d => this.yScale(d[0])
            .y1((d: any) => this.yScale(d[1])))
    }

    private draw(): void {

        this.colorScale.domain(
            Object.keys(this.data[0]).filter((key: string): boolean => key !== 'date')
        )
        
        const keys: CountriesEnum[] = Object.values(CountriesEnum)

        const maxDate = d3.max(this.data, (item: StackedItem): number => {
            const nums = Object.keys(item).map((key: string) => {
                return (key !== 'date' ? Number(item[key as keyof StackedItem]) : 0)
            })
            return d3.sum(nums)
        })

        // Set domains for axes
        this.xScale.domain(d3.extent(this.data, ({ date }: StackedItem) => date))
        this.yScale.domain([0, maxDate])

        this.stack.keys(keys)
        this.stack.order(d3.stackOrderNone)
        this.stack.offset(d3.stackOffsetNone)
    }

    private formatBillion(x: number): string {
        return d3.format('.1f')(x / 1e9)
    }
}