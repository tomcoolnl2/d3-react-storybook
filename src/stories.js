
import { storiesOf } from '@storybook/react'
import {
    Axis,
    Update,
    Transition,
    ScatterPlot
} from './components'

storiesOf('Basics', module)
    .add('Simple Axis', () => <Axis />)
    .add('Update example', () => <Update />)
    .add('Transition example', () => <Transition />)
    .add('Scatter Plot', () => <ScatterPlot />)
