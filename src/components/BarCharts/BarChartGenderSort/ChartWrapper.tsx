
import { FC } from 'react'
import { useRef, useState, useEffect } from 'react'
import { GenderEnum } from '../../../models'
import { D3Chart } from './D3Chart'


export type ChartWrapperProps = {
    gender: GenderEnum
}

export const ChartWrapper: FC<ChartWrapperProps> = ({ gender }) => {
	
    const chartArea = useRef<HTMLDivElement>(null)
	const [chart, setChart] = useState<D3Chart>(null)

	useEffect(() => {
		if (!chart) {
			setChart(new D3Chart(chartArea.current))
		}
		// skip the loading state, when data is still a pending promise
		else if (chart.menData) {
			chart.update(gender)
		}
	}, [chart, gender])

	return (
		<div className="chart-area" ref={chartArea}></div>
	)
}