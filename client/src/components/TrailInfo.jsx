import React, { PureComponent } from 'react';

export default class TrailInfo extends PureComponent {
  render() {
    const { info } = this.props;

    return (
      <div>
        <img width={300} height={200} src={info.image} />
        <div id="title">{info.trail_name}</div>
        <div>{`Trail Length: ${info.length_roundtrip} miles, roundtrip`}</div>
        <div>{`Gain: ${info.gain}ft`}</div>
        <div>{`Rating: ${info.rating}/5`}</div>
        <div>{`Parking Pass: ${info.parking_pass}`}</div>
        <a target='_blank' href={info.link} id="link">Learn More</a>
      </div>
    );
  }
}
