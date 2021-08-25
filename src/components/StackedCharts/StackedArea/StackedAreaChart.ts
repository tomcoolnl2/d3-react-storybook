/**
    Adapted from Maggie Lee at bl.ocks.org
    https://bl.ocks.org/greencracker/e08d5e789737e91d6e73d7dcc34969bf
**/

import * as d3 from 'd3'
import { Area } from 'd3'
import { 
    D3AxisCall, 
    D3ScaleLinear, 
    D3ScaleOrdinal, 
    D3ScaleTime, 
    D3SVGGElementSelection, 
    D3SVGSVGElementSelection,
    D3Stack,
    MarginCoords, 
    D3Series
} from '../../../models'
import { CountriesEnum, RawStackedItem, StackedItem } from './models'


export class StackedAreaChart {

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
	private svg: D3SVGSVGElementSelection = null
	private mainGroup: D3SVGGElementSelection = null
	private xScale: D3ScaleTime = null
	private yScale: D3ScaleLinear = null
    private colorScale: D3ScaleOrdinal = null

    private xAxis: D3AxisCall = null
    private yAxis: D3AxisCall = null
    private area: any = null // TODO

    constructor(parent: SVGSVGElement, data: RawStackedItem[]) {

        this.parent = parent

        this.normalize(data)

        this.initialize()

        this.update()
    }

    private normalize(data: RawStackedItem[]): void {

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
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)

        // Scales
        this.xScale = d3.scaleTime().range([0, this.width])

        this.yScale = d3.scaleLinear().range([this.height, 0])

        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10)

        // Axes
        this.xAxis = d3.axisBottom(this.xScale).scale(this.xScale)

        this.yAxis = d3.axisLeft(this.yScale)
            .scale(this.yScale)
            .tickFormat(x => this.formatBillion(x as number))
        
        // TODO: Typing area chaining methods needs more investigation. 
        // Documentation is very hard to find. 
        this.area = d3.area()
            .x((d: any) => {
                return this.xScale(d.data.date)
            })
            .y0((d: any) => this.yScale(d[0]))
            .y1((d: any) => this.yScale(d[1]))
    }

    private update(): void {

        this.colorScale.domain(
            Object.keys(this.data[0]).filter((key: string): boolean => key !== 'date')
        )
        
        console.log(this.data)
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

        const browser = this.mainGroup.selectAll('.browser')
            .data(this.stack(this.data as Iterable<{ [key: string]: number }>)) // TODO
            .enter()
            .append('g')
                .attr('class', ({ key }: D3Series): string => 'browser ' + key)
                .attr('fill-opacity', 0.5)

        browser.append('path')
            .attr('class', 'area')
            .attr('d', this.area)
            .style('fill', ({ key }: D3Series): string => this.colorScale(key))

        browser.append('text')
            .datum(d => d)
            .attr('transform', (d: D3Series): string => {
                const j: number = this.data.length - 1
                return `translate(${this.xScale(this.data[j].date)}, ${this.yScale(d[j][1])})`
            })
            .attr('x', -6) 
            .attr('dy', '.35em')
            .style('text-anchor', 'start')
            .text(({ key }: D3Series): string => key)
                .attr('fill-opacity', 1)

        this.mainGroup.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${this.height})`)
            .call(this.xAxis)

        this.mainGroup.append('g')
            .attr('class', 'y-axis')
            .call(this.yAxis)

        this.mainGroup.append('text')
            .attr('x', 0 - this.margin.left)
            .text('Billions of liters')
    }

    private formatBillion(x: number): string {
        return d3.format('.1f')(x / 1e9)
    }
}
