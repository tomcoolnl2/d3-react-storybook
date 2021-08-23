
import { FC, useRef, useState, useEffect, ChangeEvent } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import RangeSlider from 'react-bootstrap-range-slider'
import { GapMinderChart } from './GapMinderChart'
import { 
	PublicationData, 
	continentList, 
	continentReadableList, 
	ContinentsEnum 
} from './model'


enum AnimationState {
	PLAYING = 'Play',
	PAUZED = 'Pause'
}

type ChartWrapperProps = {
	data: PublicationData[]
}

export const ChartWrapper: FC<ChartWrapperProps> = ({ data }) => {
	
	const chartArea = useRef<SVGSVGElement>(null)
	const [chart, setChart] = useState<GapMinderChart>(null)
	const [animationState, setAnimationState] = useState<AnimationState>(AnimationState.PAUZED)
	const [selection, setSelection] = useState<ContinentsEnum>(continentList[0])
	const [year, setYear] = useState<number>(GapMinderChart.min)

	useEffect(() => {
		if (!chart) {
			setChart(new GapMinderChart(chartArea.current, data))
		}
		else {
			chart.registerYearChangeHandler(yearChange)
		}
	}, [chart])

	const yearChange = (time: number): void => {
		setYear(time + GapMinderChart.min)
	}	

	const handleAnimationState = (): void => {
		if (animationState === AnimationState.PAUZED) {
			chart.play()
			setAnimationState(AnimationState.PLAYING)
		}
		else {
			chart.pause()
			setAnimationState(AnimationState.PAUZED)
		}
	}

	const handleReset = (): void => {
		setSelection(continentList[0])
		chart.reset()
	}

	const handleContinentChange = (continent: ContinentsEnum): void => {
		setSelection(continent)
		chart.filterDataByContinent(continent)
	}

	const handleYearChange = (event: ChangeEvent<HTMLInputElement>): void => {
		const year = Number(event.target.value)
		setYear(year)
		chart.filterDataByYear(year)
	}

	return (
		<>
			<svg className='chart-area' ref={chartArea}></svg>

			<RangeSlider
				value={year}
				min={GapMinderChart.min}
				max={GapMinderChart.max}
				onChange={handleYearChange}
			/>
				
			<br/><br/>

			<Button
				variant={'primary'}
				type={'button'}
				onClick={handleReset}
			>
				Reset
			</Button>
			{'  '}
			<Button
				variant={'primary'}
				type={'button'}
				onClick={handleAnimationState}
			>
				{animationState === AnimationState.PAUZED 
					? AnimationState.PLAYING
					: AnimationState.PAUZED}
			</Button>
			
			<br/><br/>

			<Dropdown>
				<Dropdown.Toggle variant="primary" id="dropdown-basic">
					{selection.charAt(0).toUpperCase() + selection.slice(1)}
				</Dropdown.Toggle>

				<Dropdown.Menu>
					{continentList.map((continent: ContinentsEnum, i: number) => (
						<Dropdown.Item key={continent} onSelect={() => handleContinentChange(continent)}>
							{continentReadableList[i]}
						</Dropdown.Item>
					))}
				</Dropdown.Menu>
			</Dropdown>	
		</>
	)
}