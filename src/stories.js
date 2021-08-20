
import { storiesOf } from '@storybook/react'
import {
    BarChart,
    Axis,
    Update,
    Transition,
    ScatterPlot
} from './components'

storiesOf('Bar Charts', module)
    .add('Simple Axis', () => <Axis />)
    .add('Simple BarChart', () => <BarChart />)
    .add('Update example', () => <Update />)
    .add('Transition example', () => <Transition />)
    .add('Scatter Plot', () => <ScatterPlot />)
