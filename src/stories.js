
import { storiesOf } from '@storybook/react'
import {
    BarChartChangeData,
    BarChartAxis,
    BarChartUpdate,
    BarChartTransition,
    BarChartGenderSort,
    ScatterPlot
} from './components'

storiesOf('Bar Charts', module)
    .add('Simple Axis', () => <BarChartAxis />)
    .add('Simple BarChart', () => <BarChartChangeData />)
    .add('Update example', () => <BarChartUpdate />)
    .add('Transition example', () => <BarChartTransition />)
    .add('BarChart Gender Sort', () => <BarChartGenderSort />)

storiesOf('Scatter Plots', module)
    .add('Scatter Plot', () => <ScatterPlot />)
