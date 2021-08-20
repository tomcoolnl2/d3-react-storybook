
import * as d3 from 'd3'
import { FC, useRef, useState, useEffect } from 'react'


type ChartProps = {
    width: number, 
    height: number, 
    data: number[]
}

const Chart: FC<ChartProps> = ({ width, height, data }) => {
    
    const ref = useRef<SVGSVGElement>(null)
    
    useEffect(() => {
        d3.select(ref.current)
            .attr('width', width)
            .attr('height', height)
            .style('border', '1px solid black')
    }, [])

    useEffect(() => {
        draw()
    }, [data])

    const draw = () => {
        
        const svg = d3.select(ref.current)

        const selection = svg.selectAll('rect').data<number>(data)

        const yScale = d3.scaleLinear()
							.domain([0, d3.max(data)] as [number, number])
							.range([0, height - 100])
        
        selection
            .transition().duration(300)
                .attr('height', (d: number) => yScale(d))
                .attr('y', (d: number) => height - yScale(d))

        selection
            .enter()
            .append('rect')
            .attr('x', (d: number, i: number) => i * 45)
            .attr('y', () => height)
            .attr('width', 40)
            .attr('height', 0)
            .attr('fill', 'orange')
            .transition().duration(300)
                .attr('height', (d: number) => yScale(d))
                .attr('y', (d: number) => height - yScale(d))
        
        selection
            .exit()
            .transition().duration(300)
                .attr('y', () => height)
                .attr('height', 0)
            .remove()
    }

    return <svg ref={ref} />
}

const dataset: number[][] = [
	[10, 30, 40, 20],
	[10, 40, 30, 20, 50, 10],
	[60, 30, 40, 20, 30]
]

export const BarChartChangeData: FC = () => {

    const initialIndex = 0, 
        width = 600, 
        height = 400, 
        dataSize = dataset.length

	const [data, setData] = useState<number[]>([])
    const [index, setIndex] = useState<number>(initialIndex)

	useEffect(() => {
		changeData()
	}, [])

	const changeData = () => {
        
        setIndex(index + 1)
		setData(dataset[index])

        if (index === dataSize - 1) {
            setIndex(initialIndex)
        }
	}

	return (
		<>
			<button onClick={changeData}>Change Data</button>
            <br />
            <br />
			<Chart width={width} height={height} data={data} />
            <br />
            <pre>{JSON.stringify(data, null, 4)}</pre>
		</>
	)
}