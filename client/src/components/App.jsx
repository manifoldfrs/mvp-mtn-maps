import React from 'react';
import ReactMapGl, { Popup, Marker } from 'react-map-gl';
import axios from 'axios';
import Geocoder from 'react-map-gl-geocoder';
import TOKEN from '../config/mapboxToken';

// TODO:
//  Refactor geocoder to use react-mapbox-gl-geocoder instead
//  Refactor trail popups and markers into separate component
//  Include additional info in trail markers and popups
//  Use deck.gl to render marker of input address on screen?
//  Add navigation component
//    -trails by region
//    -trails by difficulty (gain & length)
//    -trails by pass requirements
//    -trails by rating
//  Style application

// test coordinates: [-122.317768,47.67894]

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null,
      token: TOKEN,
      trails: null,
      showMarkers: false,
      showPopups: false,
      mapRef: React.createRef(),
      viewport: {
        latitude: 47.67894,
        longitude: -122.317768,
        zoom: 10
      }
    };

      this.sortTrails = this.sortTrails.bind(this);
      this.calculateNearestTrails = this.calculateNearestTrails.bind(this);
      this.updateAddress = this.updateAddress.bind(this);
      this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    axios.get('/api/trails')
      .then((result) => {
        this.setState({
          isLoaded: true,
          trails: result.data
        });
    }, (error) => {
      console.log('Error retrieving trail data: ', error);
      this.setState({
        isLoaded: true,
        error
      });
    });

    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize() {
    this.handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  sortTrails() {
    // Mutates the trail data, calling the calculation function to return the distance from the input address
    let sortedTrailsByDistance = this.state.trails.map((trail) => {
      return {
        coordinates: trail.coordinates,
        distance_from_addr: this.calculateNearestTrails(this.state.viewport.longitude, this.state.viewport.latitude, trail.coordinates),
        trail_name: trail.trail_name
      }
    }).sort((a, b) => a.distance_from_addr - b.distance_from_addr);

    this.setState({
      trails: sortedTrailsByDistance,
      showMarkers: true,
      showPopups: true
    });
  }

  calculateNearestTrails(inputLongitude, inputLatitude, trailCoord) {
    // distance formula
    let distance = Math.sqrt(((trailCoord[0] - inputLongitude)**2) + ((trailCoord[1] - inputLatitude)**2));
    console.log('Longitude: ', inputLongitude, ' and Latitude: ', inputLatitude);
    return distance;
  }

  updateAddress(e) {
    let coordinates = e.target.value.split(',').map(coordinate => Number(coordinate));
    this.setState({ address: coordinates });
  }

  handleViewportChange = (viewport) => {
    this.setState({
      viewport: {...this.state.viewport, ...viewport }
    });
  }

  handleGeocoderViewportChange = (viewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  }

  render() {

    let mapInfo  = this.state;

    if (mapInfo.error) {
      return <div>Error...{mapInfo.error.message}</div>
    } else if (mapInfo.isLoaded === false) {
      return <div>Loading...</div>
    } else {
      return (
        <div style={{ height: "100vh" }}>
        <ReactMapGl
          ref={mapInfo.mapRef}
          {...mapInfo.viewport}
          width="100%"
          height="100%"
          onViewportChange={this.handleViewportChange}
          mapStyle="mapbox://styles/fhabib229/cjthy79rr0ccb1fm8ok7tvzkc"
          mapboxApiAccessToken={mapInfo.token}
        >
        <Geocoder
          mapRef={mapInfo.mapRef}
          onViewportChange={this.handleGeocoderViewportChange}
          mapboxApiAccessToken={mapInfo.token}
          placeholder="Explore"
          position="top-left"
          zoom="10"
          onClear={this.sortTrails}
        />
        {mapInfo.showPopups && (
          <div>
              <Popup latitude={mapInfo.trails[0].coordinates[1]} longitude={mapInfo.trails[0].coordinates[0]} tipsize={5} anchor='top'>
                <div>{mapInfo.trails[0].trail_name}</div>
              </Popup>
              <Popup latitude={mapInfo.trails[1].coordinates[1]} longitude={mapInfo.trails[0].coordinates[0]} tipsize={5} anchor='top'>
                <div>{mapInfo.trails[1].trail_name}</div>
              </Popup>
              <Popup latitude={mapInfo.trails[2].coordinates[1]} longitude={mapInfo.trails[0].coordinates[0]} tipsize={5} anchor='top'>
                <div>{mapInfo.trails[2].trail_name}</div>
              </Popup>
              <Popup latitude={mapInfo.trails[3].coordinates[1]} longitude={mapInfo.trails[0].coordinates[0]} tipsize={5} anchor='top'>
                <div>{mapInfo.trails[3].trail_name}</div>
              </Popup>
              <Popup latitude={mapInfo.trails[4].coordinates[1]} longitude={mapInfo.trails[0].coordinates[0]} tipsize={5} anchor='top'>
                <div>{mapInfo.trails[4].trail_name}</div>
              </Popup>
            </div>
        )}
        {mapInfo.showMarkers && (
            <div>
              <Marker latitude={mapInfo.trails[0].coordinates[1]} longitude={mapInfo.trails[0].coordinates[0]}>
                <div>⛰️</div>
              </Marker>
              <Marker latitude={mapInfo.trails[1].coordinates[1]} longitude={mapInfo.trails[0].coordinates[0]}>
                <div>⛰️</div>
              </Marker>
              <Marker latitude={mapInfo.trails[2].coordinates[1]} longitude={mapInfo.trails[0].coordinates[0]}>
                <div>⛰️</div>
              </Marker>
              <Marker latitude={mapInfo.trails[3].coordinates[1]} longitude={mapInfo.trails[0].coordinates[0]}>
                <div>⛰️</div>
              </Marker>
              <Marker latitude={mapInfo.trails[4].coordinates[1]} longitude={mapInfo.trails[0].coordinates[0]}>
                <div>⛰️</div>
              </Marker>
            </div>
        )}
        </ReactMapGl>
        </div>
      );
    }
  }
}

export default App;
