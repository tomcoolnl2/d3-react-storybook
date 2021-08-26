
import { FC, useRef, useState, useEffect } from 'react'
import { Data, DataRange } from './models'
import { BarChart } from './BarChart'


const dataSet: Data = [
	[10, 30, 40, 20],
	[10, 40, 30, 20, 50, 10],
	[60, 30, 40, 20, 30]
]

export const BarChartChangeData: FC = () => {

    const initialIndex = 0
    const dataSize = dataSet.length - 1

    const ref = useRef<SVGSVGElement>(null)
	const [data, setData] = useState<DataRange>(dataSet[initialIndex])
    const [index, setIndex] = useState<number>(initialIndex)
    const [chart, setChart] = useState<BarChart>(null)

	useEffect(() => {
		setChart(new BarChart(ref.current, data))
	}, [])

    useEffect(() => {
		setData(dataSet[index])	
	}, [index])

    useEffect(() => {
        chart && chart.draw(data)
    }, [data])

	const changeData = () => {
        setIndex(index === dataSize ? initialIndex : index + 1)
	}

	return (
		<>
			<button onClick={() => changeData()}>Change Data</button>
            <br />
            {index}
            <br />
            <svg ref={ref} />
            <br />
            <pre>{JSON.stringify(data, null, 4)}</pre>
		</>
	)
}