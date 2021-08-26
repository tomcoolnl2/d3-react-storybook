
import * as d3 from 'd3'
import { GenderEnum, D3Selection } from '../../../models';


export type PersonData = {
	height: string,
	name: string
}

export type Person = {
	height: number,
	name: string
}

const MARGIN = { TOP: 10, BOTTOM: 50, LEFT: 70, RIGHT: 10 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

export class D3Chart {

	private readonly parent: SVGSVGElement = null
	private mainGroup: D3Selection<SVGGElement> = null
	private xLabel: D3Selection<SVGTextElement> = null
	private xAxisGroup: D3Selection<SVGGElement> = null
	private yAxisGroup: D3Selection<SVGGElement> = null

	public data: Person[] = null
	private menData: Person[] = null
	private womenData: Person[] = null

	constructor(parent: SVGSVGElement) {
		this.parent = parent
		this.initialize()
	}

	private async initialize() {

		this.mainGroup = d3.select(this.parent)
			.attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
			.attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
			.append('g')
				.attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

		this.xLabel = this.mainGroup.append('text')
			.attr('x', WIDTH / 2)
			.attr('y', HEIGHT + 50)
			.attr('text-anchor', 'middle')

		this.mainGroup.append('text')
			.attr('x', - (HEIGHT / 2))
			.attr('y', -50)
			.attr('text-anchor', 'middle')
			.text('Height in cm')
			.attr('transform', 'rotate(-90)')

		this.xAxisGroup = this.mainGroup.append('g')
			.attr('transform', `translate(0, ${HEIGHT})`)

		this.yAxisGroup = this.mainGroup.append('g')

		const datasets: PersonData[][] = await Promise.all([
			d3.json<PersonData[]>('https://udemy-react-d3.firebaseio.com/tallest_men.json'),
			d3.json<PersonData[]>('https://udemy-react-d3.firebaseio.com/tallest_women.json')
		])

		this.normalize(datasets)
		this.draw(GenderEnum.MALE)
	}

	private normalize(datasets: PersonData[][]) {

		const [menData, womenData]: PersonData[][] = datasets
		const toNumber = (n: string): number => Number(n) << 0

		this.menData = menData.filter(Boolean)
							.map(({ height, name }) => ({ height: toNumber(height), name}))

		this.womenData = womenData.filter(Boolean)
							.map(({ height, name }) => ({ height: toNumber(height), name}))
	}

	public draw(gender: GenderEnum) {

		this.data = (gender === GenderEnum.MALE) ? this.menData : this.womenData
		this.xLabel.text(`The world's tallest ${gender}`)

		const y = d3.scaleLinear()
			.domain([
				d3.min(this.data, ({ height }) => height) * 0.95, 
				d3.max(this.data, ({ height }) => height)
			])
			.range([HEIGHT, 0])

		const x = d3.scaleBand()
			.domain(this.data.map(({ name }) => name))
			.range([0, WIDTH])
			.padding(0.4)

		const xAxisCall = d3.axisBottom(x)
		this.xAxisGroup.transition().duration(500).call(xAxisCall)

		const yAxisCall = d3.axisLeft(y)
		this.yAxisGroup.transition().duration(500).call(yAxisCall)
		
		// DATA JOIN
		const rects = this.mainGroup.selectAll('rect')
			.data<Person>(this.data)

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