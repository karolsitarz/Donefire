import React, { Component } from 'react';
import styled from 'styled-components';

const Track = styled.div`
  height: 1em;
  width: 100%;
  margin-top: 1em;
  border-radius: .25em;
  background:
    linear-gradient(
    90deg,
    hsl(351, 81%, 64%) calc(0 / 6 * 100%),
    hsl(411, 81%, 64%) calc(1 / 6 * 100%),
    hsl(471, 81%, 64%) calc(2 / 6 * 100%),
    hsl(531, 81%, 64%) calc(3 / 6 * 100%),
    hsl(591, 81%, 64%) calc(4 / 6 * 100%),
    hsl(651, 81%, 64%) calc(5 / 6 * 100%),
    hsl(711, 81%, 64%) calc(6 / 6 * 100%));
`;

const Handle = styled.div.attrs(({ $value }) => ({
  style: {
    transform: `translateY(-50%) translateX(calc(${$value} * (100vw - 4em - 100%)))`
  }
}))`
  height: 1em;
  width: 1em;
  top: 50%;
  position: absolute;
  transform: translateY(-50%);
`;

const HandleFill = styled.div.attrs(({ $value }) => ({
  style: {
    background: `hsl(${351 + $value * 360},81%,64%)`
    // boxShadow: `0 0 0 2px hsl(${171 + $value * 360},81%,64%)`
  }
}))`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0 0 0 3px #666;
  transform: ${props => props.$scrolling ? 'scale(2)' : 'scale(1)'};
  transition: transform .2s ease;
`;

export default class ColorPicker extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value1: 0.25,
      value2: 0.75,
      scrolling1: false,
      scrolling2: false
    };
  }
  componentDidMount () {
    const { handle1, handle2 } = this;
    let { left, width } = this.box.getBoundingClientRect();
    window.addEventListener('resize', e => ({ left, width } = this.box.getBoundingClientRect()));

    handle1.addEventListener('touchmove', e => {
      if (!this.state.scrolling1) this.setState({ scrolling1: true });
      let calculated = ((e.touches[0].clientX - left) / width).toFixed(3);
      const low = this.state.value2 - 0.1;
      const high = this.state.value2 * 1 + 0.1;

      if (low < 0 && calculated <= 0) calculated = high;
      if (high > 1 && calculated >= 1) calculated = low;
      if (calculated > low && calculated < this.state.value2) calculated = low;
      if (calculated < high && calculated >= this.state.value2) calculated = high;
      if (calculated < 0) calculated = 0;
      if (calculated > 1) calculated = 1;

      this.setState({ value1: calculated });
      this.props.handleValue1(calculated);
    });
    handle1.addEventListener('touchend', e => {
      if (this.state.scrolling1) this.setState({ scrolling1: false });
    });

    handle2.addEventListener('touchmove', e => {
      if (!this.state.scrolling2) this.setState({ scrolling2: true });
      let calculated = ((e.touches[0].clientX - left) / width).toFixed(3);
      const low = this.state.value1 - 0.1;
      const high = this.state.value1 * 1 + 0.1;

      console.log(calculated, high);

      if (low < 0 && calculated <= 0) calculated = high;
      if (high > 1 && calculated >= 1) calculated = low;
      if (calculated > low && calculated < this.state.value1) calculated = low;
      if (calculated < high && calculated >= this.state.value1) calculated = high;
      if (calculated < 0) calculated = 0;
      if (calculated > 1) calculated = 1;

      this.setState({ value2: calculated });
      this.props.handleValue2(calculated);
    });
    handle2.addEventListener('touchend', e => {
      if (this.state.scrolling2) this.setState({ scrolling2: false });
    });
  }
  render () {
    return (
      <Track ref={e => (this.box = e)} >
        <Handle
          $value={this.state.value1}
          ref={e => (this.handle1 = e)}>
          <HandleFill
            $scrolling={this.state.scrolling1}
            $value={this.state.value1} />
        </Handle>
        <Handle
          $value={this.state.value2}
          ref={e => (this.handle2 = e)}>
          <HandleFill
            $scrolling={this.state.scrolling2}
            $value={this.state.value2} />
        </Handle>
      </Track>
    );
  }
}
