
import * as d3 from 'd3'
import { FC, useEffect, useRef, useState } from 'react'
import { D3DSVData, FeatureCollection as GeoJSONFeatureCollection } from '../../../models'
import { WorldChoroplethChart } from './WorldChoroplethChart'


export const WorldChoropleth: FC = () => {

    const svgRef = useRef<SVGSVGElement>(null)
    const [topographyData, setTopographyData] = useState<GeoJSONFeatureCollection>(null)
    const [populationData, setPopulationData] = useState<D3DSVData>(null)
    const [, setChart] = useState<WorldChoroplethChart>(null)

    const fetchData = async () => {
        
        const [topography, population] = await Promise.all([
            d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'),
            d3.csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv')
        ])
        
        setTopographyData(topography as GeoJSONFeatureCollection)
        setPopulationData(population)
    }

    useEffect(() => {
        fetchData()
    }, [])
    
    useEffect(() => {
        if (topographyData && populationData) {
            setChart(new WorldChoroplethChart(svgRef.current, topographyData, populationData))
        }
    }, [topographyData, populationData])

    return <svg ref={svgRef} />
}