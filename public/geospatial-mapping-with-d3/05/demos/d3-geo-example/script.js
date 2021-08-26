/* global d3,topojson */

class Tooltip {
  constructor (svgX, svgY) {
    this.svgX = svgX
    this.svgY = svgY
    this.div = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0)
  }

  moveTo (x, y, country) {
    this.div.transition().duration(200).style('opacity', 1)
    this.div
      .html(
        `
    <strong class='title'>${country.properties.name}</strong><br/>
    <strong>GDP Per capita:</strong> ${Math.floor(gdpPerCapita(country))} USD
    `
      )
      .style('left', x + this.svgX + 'px')
      .style('top', y + this.svgY + 'px')
  }

  remove () {
    this.div.transition().duration(200).style('opacity', 0)
  }
}

const defaultScale = 1
const defaultTranslate = [ 0, 0 ]

class D3Map {
  constructor (topology) {
    this.svg = d3.select('#map-container').append('svg').attr('id', 'map').append('g')

    this.countryGroup = this.svg.append('g')
    this.cityGroup = this.svg.append('g')

    const { height, width, x, y } = document.getElementById('map-container').getBoundingClientRect()
    this.height = height
    this.width = width

    const geojson = topojson.feature(topology, topology.objects['custom.geo'])
    this.countries = geojson.features
    this.projection = d3.geoAlbers()
    this.projection.rotate(-75).fitExtent([ [ 0, 0 ], [ width, height ] ], geojson)

    const { min, max } = getGdpPerCapitaRange(geojson.features)
    this.min = min
    this.max = max

    this.tooltip = new Tooltip(x, y)
    this.scale = defaultScale
    this.translate = defaultTranslate

    const listener = d3.drag()
    listener.on('drag', () => {
      this.translate = [ this.translate[0] + d3.event.dx, this.translate[1] + d3.event.dy ]
      this.svg.attr('transform', 'translate(' + this.translate + ')scale(' + this.scale + ')')
    })
    this.svg.call(listener)
  }

  drawCountries () {
    const path = d3.geoPath().projection(this.projection)

    const countryGroup = this.countryGroup
      .selectAll('path')
      .data(this.countries)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('stroke', 'white')
      .attr('fill', 'lightgray')
      .on('mouseover', (d, i, countries) => {
        if (!this.choroplethEnabled) {
          d3.select(countries[i]).transition().attr('fill', 'darkgrey')
        }
        const [ x, y ] = this.transformCoordinates(path.centroid(d))
        this.tooltip.moveTo(x, y, d)
        d3.select(`#city_${d.properties.iso_a3}`).style('opacity', 1)
      })
      .on('mouseout', (d, i, countries) => {
        if (!this.choroplethEnabled) {
          d3.select(countries[i]).transition().attr('fill', 'lightgrey')
        }
        this.tooltip.remove()
        d3.select(`#city_${d.properties.iso_a3}`).style('opacity', 0)
      })
      .on('click', this.zoomToCountry.bind(this))

    return countryGroup
  }

  zoomToCountry (country) {
    const { scale, translate } = this.getTransformation(country)
    this.scale = scale
    this.translate = translate
    this.svg
      .transition()
      .duration(750)
      .on('start', () => {
        this.cityGroup.selectAll('circle').remove()
        this.cityGroup.selectAll('text').remove()
      })
      .on('end', () => {
        if (this.currentlySelectedCountry !== country.properties.iso_a3) {
          this.drawCitiesForCountry(country)
          this.currentlySelectedCountry = country.properties.iso_a3
          return
        }
        this.currentlySelectedCountry = null
      })
      .attr('transform', 'translate(' + translate + ')scale(' + scale + ')')
  }

  getTransformation (country) {
    if (this.currentlySelectedCountry === country.properties.iso_a3) {
      return { scale: defaultScale, translate: defaultTranslate }
    }
    const path = d3.geoPath().projection(this.projection)

    const bounds = path.bounds(country)
    const width = bounds[1][0] - bounds[0][0]
    const height = bounds[1][1] - bounds[0][1]
    const centerX = (bounds[0][0] + bounds[1][0]) / 2
    const centerY = (bounds[0][1] + bounds[1][1]) / 2
    const scale = 0.8 / Math.max(width / this.width, height / this.height)
    const translate = [ this.width / 2 - scale * centerX, this.height / 2 - scale * centerY ]
    return { scale, translate }
  }

  drawCitiesForCountry (country) {
    this.cityGroup
      .selectAll('circle')
      .data(country.properties.cities)
      .enter()
      .append('circle')
      .attr('r', '2')
      .attr('cx', (city) => this.projection([ city.lng, city.lat ])[0])
      .attr('cy', (city) => this.projection([ city.lng, city.lat ])[1])

    const textSize = 5
    this.cityGroup
      .selectAll('text')
      .data(country.properties.cities)
      .enter()
      .append('text')
      .attr('x', (city) => this.projection([ city.lng, city.lat ])[0])
      .attr('y', (city) => this.projection([ city.lng, city.lat ])[1])
      .attr('font-size', textSize + 'px')
      .attr('transform', `translate(3, ${textSize / 2})`)
      .text((city) => city.city)
  }

  transformCoordinates ([ x, y ]) {
    return [ this.scale * x + this.translate[0], this.scale * y + this.translate[1] ]
  }

  colorCountries (countryGroup) {
    const scale = getScale(this.min, this.max)
    countryGroup.transition().duration(200).attr('fill', (country) => {
      return scale(gdpPerCapita(country))
    })
    this.choroplethEnabled = true
  }

  discolorCountries (countryGroup) {
    countryGroup.transition().duration(200).attr('fill', 'lightgrey')
    this.choroplethEnabled = false
  }

  drawLegend () {
    const gradient = this.svg
      .append('defs')
      .append('svg:linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '100%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%')
      .attr('spreadMethod', 'pad')

    const lowColor = d3.interpolatePurples(0)
    const highColor = d3.interpolatePurples(1)
    gradient.append('stop').attr('offset', '0%').attr('stop-color', highColor).attr('stop-opacity', 1)

    gradient.append('stop').attr('offset', '100%').attr('stop-color', lowColor).attr('stop-opacity', 1)

    const w = 20
    const h = 200

    const legend = this.svg.append('g').attr('id', 'map-legend').attr('transform', 'translate(30,30)')

    legend.append('rect').attr('width', w).attr('height', h).style('fill', 'url(#gradient')

    const axisScale = d3.scaleLinear().range([ h, 0 ]).domain([ this.min, this.max ])
    const axis = d3.axisRight(axisScale)
    legend.append('g').attr('class', 'axis').attr('transform', `translate(${w}, 0)`).call(axis)
  }

  removeLegend () {
    d3.select('#map-legend').remove()
  }

  drawBubbles (countryGroup) {
    const path = d3.geoPath().projection(this.projection)
    const scale = d3.scaleLinear().range([ 5, 35 ]).domain([ this.min, this.max ])
    this.svg
      .append('g')
      .attr('id', 'map-bubbles')
      .selectAll('circle')
      .data(this.countries)
      .enter()
      .append('circle')
      .attr('cx', (d) => path.centroid(d)[0])
      .attr('cy', (d) => path.centroid(d)[1])
      .attr('fill', 'green')
      .attr('stroke', 'black')
      .transition()
      .duration(200)
      .attr('r', (d) => scale(gdpPerCapita(d)))
  }

  removeBubbles () {
    d3.select('#map-bubbles').remove()
  }

  addLabel (city, i, cities) {
    const textSize = 10
    this.svg
      .append('text')
      .attr('id', cityLabel(city, i))
      .attr('x', this.projection([ city.lng, city.lat ])[0])
      .attr('y', this.projection([ city.lng, city.lat ])[1])
      .attr('font-size', textSize + 'px')
      .attr('transform', `translate(7, ${textSize / 2})`)
      .text(city.city)

    d3.select(cities[i]).transition().duration(200).attr('r', '7')
  }

  removeLabel (city, i, cities) {
    d3.select('#' + cityLabel(city, i)).remove()
    d3.select(cities[i]).transition().duration(200).attr('r', '5')
  }
}

Promise.all([ d3.json('data/custom.topo.json'), d3.csv('data/cities.csv') ])
  .then(([ topology, cities ]) => {
    topology = attachCities(topology, cities)
    const map = new D3Map(topology)

    const countryGroup = map.drawCountries()

    document.getElementById('checkbox-choropleth').addEventListener('click', (e) => {
      const { checked } = e.target
      if (checked) {
        map.colorCountries(countryGroup)
        map.drawLegend()
      } else {
        map.discolorCountries(countryGroup)
        map.removeLegend()
      }
    })

    document.getElementById('checkbox-bubble').addEventListener('click', (e) => {
      const { checked } = e.target
      if (checked) {
        map.drawBubbles(countryGroup)
      } else {
        map.removeBubbles()
      }
    })
  })
  .catch((err) => console.error('error fetching topojson:', err))

function getScale (min, max) {
  const scale = d3.scaleSequential(d3.interpolatePurples)
  scale.domain([ min, max ])
  return scale
}

function gdpPerCapita (country) {
  return country.properties.gdp_md_est * 1e6 / country.properties.pop_est
}

function getGdpPerCapitaRange (countries) {
  let min = Infinity
  let max = -Infinity

  countries.forEach((country) => {
    const gpc = gdpPerCapita(country)
    if (gpc < min) {
      min = gpc
    }
    if (gpc > max) {
      max = gpc
    }
  })

  return { min, max }
}

function cityLabel (city, i) {
  return `label_${city.city}_${i}`
}

function denormalizeCities (cities) {
  const cityMap = {}
  cities.forEach((city) => {
    if (!cityMap[city.iso3]) {
      cityMap[city.iso3] = [ city ]
      return
    }
    cityMap[city.iso3].push(city)
  })

  Object.keys(cityMap).forEach((country) => {
    cityMap[country] = cityMap[country].sort((c1, c2) => Number(c1.population) < Number(c2.population)).slice(0, 5)
  })
  return cityMap
}

function attachCities (topology, cities) {
  const cityMap = denormalizeCities(cities)
  topology.objects['custom.geo'].geometries.forEach((country) => {
    country.properties.cities = cityMap[country.properties.iso_a3] || []
  })
  return topology
}
