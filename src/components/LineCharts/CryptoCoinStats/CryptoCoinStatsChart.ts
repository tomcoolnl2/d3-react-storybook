
import * as d3 from 'd3'
import { 
    D3ScaleLinear,
    D3ScaleTime,
    D3AxisCall,
    D3SVGGElementSelection, 
    D3SVGSVGElementSelection,
    MarginCoords, 
    D3SVGTextElementSelection
} from '../../../models'
import { 
    CryptoCoinData, 
    CryptoCoinDataOptionId, 
    CryptoCoinDataOptions, 
    CryptoCoinStatistics, 
    RawCryptoCoinData, 
    RawCryptoCoinStatistics
} from './models'
import { CryptoCurrencyEnum } from './enums'


export class CryptoCoinStatsChart {

    // Measurements to calculate with
	private readonly fullWidth: number = 800
	private readonly fullHeight: number = 500
	private readonly margin: MarginCoords = { left: 100, right: 100, top: 50, bottom: 100 }
	private readonly width: number = this.fullWidth - this.margin.left - this.margin.right
	private readonly height: number = this.fullHeight - this.margin.top - this.margin.bottom

    // Variables that change during update
    private normalizedData: CryptoCoinStatistics = null
    private filteredData: CryptoCoinStatistics = null
    private selectedCurrency: CryptoCurrencyEnum = null
    private selectedDataOption: CryptoCoinDataOptionId = null

    // D3/SVG Elements
	private readonly parent: SVGSVGElement = null
	private svg: D3SVGSVGElementSelection = null
	private mainGroup: D3SVGGElementSelection = null
    private xLabel: D3SVGTextElementSelection = null
    private yLabel: D3SVGTextElementSelection = null
	private xScale: D3ScaleTime  = null
	private yScale: D3ScaleLinear = null
	private xAxisGroup: D3SVGGElementSelection = null
	private yAxisGroup: D3SVGGElementSelection = null
    private xAxisCall: D3AxisCall = null
    private yAxisCall: D3AxisCall = null
    private xAxis: D3SVGGElementSelection = null
    private yAxis: D3SVGGElementSelection = null

    // Static values
    public static cryptoCoinDataOptions: CryptoCoinDataOptions = {
        volume24h: '24 Hour Trading Volume ($)',
        marketCap: 'Market Capitalization ($)',
        priceUSD: 'Price ($)'
    }

    constructor(
        parent: SVGSVGElement, 
        data: RawCryptoCoinStatistics, 
        selectedCurrency: CryptoCurrencyEnum,
        selectedDataOption: CryptoCoinDataOptionId
    ) {

        this.parent = parent
        this.selectedCurrency = selectedCurrency
        this.selectedDataOption = selectedDataOption

        // straighten data
		this.normalize(data)
		// prepare
		this.initialize()
		// force initial state
		this.update()
    }

    private normalize(data: RawCryptoCoinStatistics): void {

        const formattedData: CryptoCoinStatistics = {}
        let currency: CryptoCurrencyEnum = null

        for (currency in data) {
            formattedData[currency] = data[currency]
                // .filter(({ price_usd }: RawCryptoCoinData): boolean => !price_usd === null)
                .map((coinData: RawCryptoCoinData): CryptoCoinData => ({
                    volume24h: Number(coinData['24h_vol']),
                    date: CryptoCoinStatsChart.parseTime(coinData.date),
                    marketCap: Number(coinData.market_cap),
                    priceUSD: Number(coinData.price_usd)
                })
            )
        }

        this.normalizedData = formattedData
        this.filteredData = formattedData
    }

    private initialize(): void {

        this.svg = d3.select(this.parent)
            .attr('width', this.fullWidth)
            .attr('height', this.fullHeight)
      
        this.mainGroup = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      
        // add the line for the first time
        this.mainGroup.append('path')
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', 'cadetblue')
            .attr('stroke-width', '2px')
      
        // axis labels
        this.xLabel = this.mainGroup.append('text')
            .attr('class', 'x axisLabel')
            .attr('y', this.height + 50)
            .attr('x', this.width / 2)
            .attr('font-size', '20px')
            .attr('text-anchor', 'middle')
            .text('Time')

        this.yLabel = this.mainGroup.append('text')
            .attr('class', 'y axisLabel')
            .attr('transform', 'rotate(-90)')
            .attr('y', -60)
            .attr('x', -170)
            .attr('font-size', '20px')
            .attr('text-anchor', 'middle')
            .text('Price ($)')
        
        // scales
        this.xScale = d3.scaleTime().range([0, this.width])
        this.yScale = d3.scaleLinear().range([this.height, 0])
      
        // axis generators
        this.xAxisCall = d3.axisBottom(this.xScale)
        this.yAxisCall = d3.axisLeft(this.yScale)
            .ticks(6)
            .tickFormat(d3NumberValue => `${parseInt(String((d3NumberValue as number) / 1000))}k`)
      
        // axis groups
        this.xAxis = this.mainGroup.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${this.height})`)
      
        this.yAxis = this.mainGroup.append('g')
            .attr('class', 'y-axis')
    }

    public update(): void {

        // filter data based on selections
        const currency: CryptoCurrencyEnum = this.selectedCurrency
        const yValue: CryptoCoinDataOptionId = this.selectedDataOption
        const yLabel = CryptoCoinStatsChart.cryptoCoinDataOptions[yValue]

        const sliderValues: [Date, Date] = [
            CryptoCoinStatsChart.parseTime('12/05/2013'), 
            CryptoCoinStatsChart.parseTime('31/10/2017')
        ]
        const dataTimeFiltered = this.normalizedData[currency].filter(({ date }: CryptoCoinData) => {
            return ((date >= sliderValues[0]) && (date <= sliderValues[1]))
        })

        // update scales
        this.xScale.domain(d3.extent(dataTimeFiltered, ({ date }: CryptoCoinData) => date))
        this.yScale.domain([
            d3.min(dataTimeFiltered, (d: CryptoCoinData) => d[yValue]) / 1.005, 
            d3.max(dataTimeFiltered, (d: CryptoCoinData) => d[yValue]) * 1.005
        ])

        // fix for format values
        const formatSi = d3.format('.2s')
        function formatAbbreviation(x: number) {
            const s = formatSi(x)
            switch (s[s.length - 1]) {
                case 'G': return s.slice(0, -1) + 'B' // billions
                case 'k': return s.slice(0, -1) + 'K' // thousands
            }
            return s
        }

        // update axes
        this.xAxisCall.scale(this.xScale)
        this.xAxis
            .transition().duration(1000)
            .call(this.xAxisCall)

        this.yAxisCall.scale(this.yScale)
        this.yAxis
            .transition().duration(1000)
            .call(this.yAxisCall.tickFormat(x => formatAbbreviation(x as number)))

        // Path generator
	    const lineGraph = d3.line<CryptoCoinData>()
            .x(cryptoCoinData => this.xScale(cryptoCoinData.date))
            .y(cryptoCoinData => this.yScale(cryptoCoinData[yValue]))

        // Update our line path
        this.mainGroup.select('.line')
            .transition().duration(1000)
            .attr('d', lineGraph(dataTimeFiltered))

        this.yLabel.text(yLabel)
    }

    public filterDataByCurrency(currency: CryptoCurrencyEnum): void {
        this.selectedCurrency = currency
        this.update()
    }

    public filterDataByOption(optionId: CryptoCoinDataOptionId): void {
        this.selectedDataOption = optionId
        this.update()
    }

    public static parseTime(time: string, format: string = '%d/%m/%Y'): Date {
        return d3.timeParse(format)(time)
    }

    public static formatTime(date: Date, format: string = '%d/%m/%Y'): string {
        return d3.timeFormat(format)(date)
    }
}