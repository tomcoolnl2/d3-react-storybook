
import * as d3 from 'd3'
import { MarginCoords, D3ScaleLinear, D3SVGGElementSelection } from '../../../models'
import { StudentData, Student } from './ScatterPlotStudentHeight'


export class D3Chart {

	// Measurements to calculate with
	private readonly fullWidth: number = 500
	private readonly fullHeight: number = 300
	private readonly margin: MarginCoords = { left: 70, right: 10, top: 10, bottom: 80 }
	private readonly width: number = this.fullWidth - this.margin.left - this.margin.right
	private readonly height: number = this.fullHeight - this.margin.top - this.margin.bottom

	// Variables that change during update
    private setActiveName: (name: string) => void = () => {}
    private mainGroup: D3SVGGElementSelection = null
	private x: D3ScaleLinear = null
	private y: D3ScaleLinear = null
	private xAxisGroup: D3SVGGElementSelection = null
	private yAxisGroup: D3SVGGElementSelection = null
	private data: Student[] = null
    
	constructor(parent: SVGSVGElement, data: StudentData[], setActiveName: (name: string) => void) {
		
		this.setActiveName = setActiveName

		this.mainGroup = d3.select(parent)
            .attr('width', this.fullWidth)
            .attr('height', this.fullHeight)
			.append('g')
				.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)

		this.x = d3.scaleLinear()
			.range([0 , this.width])

		this.y = d3.scaleLinear()
			.range([this.height, 0])

		this.xAxisGroup = this.mainGroup.append('g')
			.attr('transform', `translate(0, ${this.height})`)
		this.yAxisGroup = this.mainGroup.append('g')

		this.mainGroup.append('text')
			.attr('x', this.width / 2)
			.attr('y', this.height + 40)
			.attr('font-size', 20)
			.attr('text-anchor', 'middle')
			.text('Age')

		this.mainGroup.append('text')
			.attr('x', -(this.height / 2))
			.attr('y', -50)
			.attr('transform', 'rotate(-90)')
			.attr('font-size', 20)
			.attr('text-anchor', 'middle')
			.text('Height in cm')

		this.update(data)
	}

	private normalize(data: StudentData[]): void {
		this.data = data.map(({ name, age, height }: StudentData): Student => ({
			name, age: Number(age), height: Number(height)
		}))
	}

	public update(data: StudentData[]): void {

		this.normalize(data)

		this.x.domain([0 , d3.max(this.data, ({ age }: Student) => age)] as [number, number])
		this.y.domain([0 , d3.max(this.data, ({ height }: Student) => height)] as [number, number])

		const xAxisCall = d3.axisBottom(this.x)
		const yAxisCall = d3.axisLeft(this.y)

		this.xAxisGroup.transition().duration(1000).call(xAxisCall)
		this.yAxisGroup.transition().duration(1000).call(yAxisCall)

		// JOIN
		const circles = this.mainGroup.selectAll('circle')
			.data<Student>(this.data)

		// EXIT
		circles.exit()
			.attr('cy', this.y(0))
			.remove()

		// UPDATE
		circles.transition().duration(1000)
			.attr('cx', ({ age }: Student) => this.x(age))
			.attr('cy', ({ height }: Student) => this.y(height))

		// ENTER
		circles.enter().append('circle')
			.attr('cy', this.y(0))
			.attr('cx', ({ age }: Student) => this.x(age))
			.attr('r', 10)
			.attr('fill', 'peru')
			.attr('stroke', 'black')
			.attr('data-name', (({name}: Student) => name))
			.on('click', (d: Event) => {
				const { name } = ((d.target as HTMLInputElement).dataset)
				this.setActiveName(name)
			})
			.transition().duration(1000)
				.attr('cy', ({ height }: Student) => this.y(height))

	}
}
