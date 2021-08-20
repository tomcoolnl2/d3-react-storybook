
import * as d3 from 'd3'
import { GenderEnum, D3SVGGElementSelection, D3SVGTextElementSelection } from '../../../models';


export type PersonData = {
	height: string,
	name: string
}

export type Person = PersonData & {
	height: number
}

const MARGIN = { TOP: 10, BOTTOM: 50, LEFT: 70, RIGHT: 10 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

export class D3Chart {

	public svg: D3SVGGElementSelection = null
	public xLabel: D3SVGTextElementSelection = null
	public xAxisGroup: D3SVGGElementSelection = null
	public yAxisGroup: D3SVGGElementSelection = null

	public data: Person[] = null
	public menData: Person[] = null
	public womenData: Person[] = null

	constructor(
		private element: HTMLElement = null
	) {

		
	}

	initialize() {

		this.svg = d3.select(this.element)
			.append('svg')
				.attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
				.attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
			.append('g')
				.attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

		this.xLabel = this.svg.append('text')
			.attr('x', WIDTH / 2)
			.attr('y', HEIGHT + 50)
			.attr('text-anchor', 'middle')

		this.svg.append('text')
			.attr('x', -(HEIGHT / 2))
			.attr('y', -50)
			.attr('text-anchor', 'middle')
			.text('Height in cm')
			.attr('transform', 'rotate(-90)')

		this.xAxisGroup = this.svg.append('g')
			.attr('transform', `translate(0, ${HEIGHT})`)

		this.yAxisGroup = this.svg.append('g')

		Promise.all([
			d3.json<PersonData[]>('https://udemy-react-d3.firebaseio.com/tallest_men.json'),
			d3.json<PersonData[]>('https://udemy-react-d3.firebaseio.com/tallest_women.json')
		])
		.then((datasets: Array<PersonData[]>) => {
			this.normalize(datasets)
			this.update(GenderEnum.MALE)
		})
	}

	normalize(datasets: Array<PersonData[]>) {

		const [menData, womenData]: Array<PersonData[]> = datasets

		this.menData = menData.filter(Boolean)
							.map(({ height, name }) => ({ height: Number(height), name}))

		this.womenData = womenData.filter(Boolean)
							.map(({ height, name }) => ({ height: Number(height), name}))
	}

	update(gender: GenderEnum) {

		this.data = (gender === GenderEnum.MALE) ? this.menData : this.womenData
		this.xLabel.text(`The world's tallest ${gender}`)

		const y = d3.scaleLinear()
			.domain([
				d3.min(this.data, ({ height }) => Number(height)) * 0.95, 
				d3.max(this.data, ({ height }) => Number(height))
			])
			.range([HEIGHT, 0])

		const x = d3.scaleBand()
			.domain(this.data.map(d => d.name))
			.range([0, WIDTH])
			.padding(0.4)

		const xAxisCall = d3.axisBottom(x)
		this.xAxisGroup.transition().duration(500).call(xAxisCall)

		const yAxisCall = d3.axisLeft(y)
		this.yAxisGroup.transition().duration(500).call(yAxisCall)

		// DATA JOIN
		const rects = this.svg.selectAll('rect')
			.data(this.data)

		// EXIT
		rects.exit()
			.transition().duration(500)
				.attr('height', 0)
				.attr('y', HEIGHT)
				.remove()

		// UPDATE
		rects.transition().duration(500)
			.attr('x', ({ name }) => x(name))
			.attr('y', ({ height }) => y(height))
			.attr('width', x.bandwidth)
			.attr('height', ({ height }) => HEIGHT - y(height))

		// ENTER
		rects.enter().append('rect')
			.attr('x', ({ name }) => x(name))
			.attr('width', x.bandwidth)
			.attr('fill', 'grey')
			.attr('y', HEIGHT)
			.transition().duration(500)
				.attr('height', ({ height }) => HEIGHT - y(height))
				.attr('y', ({ height }) => y(height))
	}
}