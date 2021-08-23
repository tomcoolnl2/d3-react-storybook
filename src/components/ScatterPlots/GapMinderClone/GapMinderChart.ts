

import * as d3 from 'd3'
import {
	MarginCoords,
	D3ScaleLinear, 
	D3ScaleLog, 
	D3ScaleOrdinal, 
	D3SVGGElementSelection, 
	D3SVGSVGElementSelection, 
	D3SVGTextElementSelection
} from '../../../models'
import { 
	PublicationData, 
	Country, 
	ContinentsEnum, 
	continentList,
	continentReadableList
} from './model'


export class GapMinderChart {

	// Measurements to calculate with
	public static readonly min: number = 1800
	public static readonly max: number = 2014
	private readonly fullWidth: number = 800
	private readonly fullHeight: number = 500
	private readonly margin: MarginCoords = { left: 100, right: 10, top: 10, bottom: 100 }
	private readonly width: number = this.fullWidth - this.margin.left - this.margin.right
	private readonly height: number = this.fullHeight - this.margin.top - this.margin.bottom
	private readonly continentColor: D3ScaleOrdinal = d3.scaleOrdinal(d3.schemeSet2)

	// Variables that change during update
    private time: number = 0
    private interval: number = null
    private normalizedData: PublicationData[] = null
    private filteredData: PublicationData[] = null
	private yearChangeHandler: (year: number) => void = () => {}

	// D3/SVG Elements
	private readonly parent: SVGSVGElement = null
	private svg: D3SVGSVGElementSelection = null
	private mainGroup: D3SVGGElementSelection = null
	private x: D3ScaleLog = null
	private y: D3ScaleLinear = null
	private area: D3ScaleLinear = null
	private timeLabel: D3SVGTextElementSelection = null

    constructor(parent: SVGSVGElement, data: PublicationData[]) {

		this.parent = parent
		// straighten data
		this.normalize(data)
		// prepare
		this.initialize()
		// force initial state
		this.update(this.filteredData[0])
    }

	private initialize() {

		this.svg = d3.select(this.parent)
			.attr('width', this.fullWidth)
  			.attr('height', this.fullHeight)

		this.mainGroup = this.svg.append('g')
  			.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
		
		// Scales
		this.setupScales()

		// Labels
		this.setupLabels()

		// Axes
		this.setupAxes()

		// Legend
		this.createStaticLegend()
	}

	private setupScales() {

		this.x = d3.scaleLog()
			.base(10)
			.range([0, this.width])
			.domain([142, 150000])

		this.y = d3.scaleLinear()
			.range([this.height, 0])
			.domain([0, 90])

		this.area = d3.scaleLinear()
			.range([25 * Math.PI, 1500 * Math.PI])
			.domain([2000, 1400000000])	
	}

	private setupLabels() {

		const xLabel: D3SVGTextElementSelection = this.mainGroup.append('text')
			.attr('y', this.height + 50)
			.attr('x', this.width / 2)
			.attr('font-size', '20px')
			.attr('text-anchor', 'middle')
			.text('GDP Per Capita ($)')

		const yLabel: D3SVGTextElementSelection = this.mainGroup.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', -40)
			.attr('x', -170)
			.attr('font-size', '20px')
			.attr('text-anchor', 'middle')
			.text('Life Expectancy (Years)')

		this.timeLabel = this.mainGroup.append('text')
			.attr('y', this.height - 10)
			.attr('x', this.width - 40)
			.attr('font-size', '40px')
			.attr('opacity', '0.4')
			.attr('text-anchor', 'middle')
			.text(String(GapMinderChart.min))
	}

	private setupAxes() {
		
		// X Axis
		const xAxisCall = d3.axisBottom(this.x)
			.tickValues([400, 4000, 40000])
			.tickFormat(d3.format('$'))

		this.mainGroup.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0, ${this.height})`)
			.call(xAxisCall)

		// Y Axis
		const yAxisCall = d3.axisLeft(this.y)

		this.mainGroup.append('g')
			.attr('class', 'y axis')
			.call(yAxisCall)
	}

	private createStaticLegend() {

		const legend: D3SVGGElementSelection = this.mainGroup.append('g')
			.attr('transform', `translate(${this.width - 10}, ${this.height - 125})`)

		// i starts at 1, to skip 'all'
		for (let i: number = 1, continent: ContinentsEnum; continent = continentList[i]; i += 1) {

			const legendRow: D3SVGGElementSelection = legend.append('g')
				.attr('transform', `translate(0, ${(i - 1) * 20})`)

			legendRow.append('rect')
				.attr('width', 10)
				.attr('height', 10)
				.attr('fill', this.continentColor(continent))

			legendRow.append('text')
				.attr('x', -10)
				.attr('y', 10)
				.attr('text-anchor', 'end')
				.text(continentReadableList[i])
		}
	}

    private normalize(data: PublicationData[]) {
		// clean data
		data.forEach((year: PublicationData) => {
			year.countries = year.countries.filter((country: Country) => {
				return country.income && country.life_exp
			})
		})

		this.normalizedData = [...data]
		this.filteredData = [...data] // initially, use all data
    }

	private setTime(time: number) {
		this.time = time
		this.yearChangeHandler(time)
	}

	private step() {
		// at the end of the data, loop back
		this.setTime((this.time < this.filteredData.length - 1) ? this.time + 1 : 0)
		this.update(this.filteredData[this.time])
	}

    public update(data: PublicationData) {

		// JOIN new data with old elements.
		const circles = this.mainGroup.selectAll('circle')
			.data(data.countries)
			
		// // EXIT old elements not present in new data.
		circles.exit().remove()
		
		// ENTER new elements present in new data.
		circles.enter().append('circle')
			.merge(circles)
			.transition().duration(0)
				.attr('fill', ({ continent }: Country) => this.continentColor(continent))
				.attr('cy', ({ life_exp }: Country) => this.y(life_exp))
				.attr('cx', ({ income }: Country) => this.x(income))
				.attr('r', ({ population }: Country) => Math.sqrt(this.area(population) / Math.PI))

		// update the time label
		this.timeLabel.text(String(this.time + GapMinderChart.min))
    }

	public play() {
		this.interval = window.setInterval(() => this.step(), 100)
	}

	public pause() {
		window.clearInterval(this.interval)
	}

	public reset() {
		this.pause()
		this.setTime(0)
		this.filteredData = this.normalizedData
		this.update(this.filteredData[this.time])
	}

	public filterDataByContinent(continent: ContinentsEnum = ContinentsEnum.ALL) {
		
		let dataPerContinent: PublicationData[] = []

		if (continent === ContinentsEnum.ALL) {
			dataPerContinent = this.normalizedData
		} 
		else {
			for (let i:number = 0, year: PublicationData; year = this.normalizedData[i]; i += 1) {
				
				const countries = year.countries.filter((country: Country) => {
					return country.continent === continent
				})

				dataPerContinent.push({
					countries,
					year: year.year
				})
			}
			
		}
		
		this.filteredData = dataPerContinent
		this.update(this.filteredData[this.time])
	}

	public filterDataByYear(year: number) {
		this.setTime(year - GapMinderChart.min)
		this.update(this.filteredData[this.time])
	}

	public registerYearChangeHandler(fn: (year: number) => void) {
		this.yearChangeHandler = fn
	}
}
