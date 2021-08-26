
import { FC, useRef, useState, useEffect } from 'react'
import { D3Chart } from './D3Chart'
import { StudentData } from './ScatterPlotStudentHeight'


type ChartWrapperProps = {
	data: StudentData[], 
	setActiveName: (name: string) => void
}

export const ChartWrapper: FC<ChartWrapperProps> = ({ data, setActiveName }) => {
	
	const chartArea = useRef<SVGSVGElement>(null)
	const [chart, setChart] = useState<D3Chart>(null)

	useEffect(() => {
		if (!chart) {
			setChart(new D3Chart(chartArea.current, data, setActiveName))
		}
		else {
			chart?.draw(data)
		}
	}, [chart, data, setActiveName])

	return <svg className='chart-area' ref={chartArea}></svg>
}