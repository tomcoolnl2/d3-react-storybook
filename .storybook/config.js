import { configure } from '@storybook/react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import 'rc-slider/assets/index.css'
import '../src/index.css'

function loadStories() {
    require('../src/stories.js')
    // You can require as many stories as you need.
}

configure(loadStories, module)
