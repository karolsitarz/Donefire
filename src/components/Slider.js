import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.section`
  width: 100%;
  height: 4em;
`;

const Handle = styled.div.attrs(({ $value }) => ({
  style: {
    transform: `translateY(-50%) translateX(calc(${$value} * (100vw - 4em - 100%)))`
  }
}))`
  width: 2.5em;
  height: 2.5em;
  border-radius: 50%;
  top: 50%;
  position: absolute;
  transform: translateY(-50%);
  transition: ${props => props.precise ? 'none' : 'transform .3s ease'};
`;

const HandleFill = styled.div.attrs(({ $value }) => ({
  style: {
    background: `
      linear-gradient(to right bottom,
        hsl(calc(171 + ${$value * 180}), 81%, 64%) 0%,
        hsl(calc(-146 + ${$value * 180}), 100%, 72%) 100%)`
  }
}))`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform: ${props => props.precise ? 'scale(1.2)' : 'scale(1)'};
  transition: ${props => props.precise ? 'transform .25s cubic-bezier(0.33, 0.37, 0.16, 2.35)' : 'transform .2s ease'};
  > svg {
    width: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    fill: #fff;
    pointer-events: none;
  }
`;

const Track = styled.div`
  width: calc(100% - 2.5em);
  height: .15em;
  background: #0002;
  border-radius: 1em;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default class Slider extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: 0.5,
      precise: false
    };
  }
  componentDidMount () {
    const { handle } = this;
    let { left, width } = this.box.getBoundingClientRect();
    window.addEventListener('resize', e => ({ left, width } = this.box.getBoundingClientRect()));

    let longPressTimeout;
    let longPressInit = false;
    let longPress = false;
    let longPressDelta = { x: 0, y: 0 };
    //

    handle.addEventListener('touchmove', e => {
      if (!e || !e.touches || !e.touches[0]) return;

      if (longPressInit && longPressDelta != null) {
        // if the distance moved is higher than some value
        if ((Math.pow((longPressDelta.x - e.touches[0].clientX), 2) + Math.pow((longPressDelta.y - e.touches[0].clientY), 2)) > 200) {
          if (longPressTimeout) clearTimeout(longPressTimeout);
          if (longPressInit) longPressInit = !longPressInit;
          if (longPress) longPress = !longPress;
          if (this.state.precise) this.setState({ precise: false });
        }
      }

      let calculated = ((e.touches[0].clientX - left) / width).toFixed(3);
      if (longPress) {
        calculated = calculated >= 0 && calculated <= 1 ? calculated : calculated > 1 ? 1 : 0;
      } else {
        if (calculated < 0.125) calculated = 0;
        else if (calculated < 0.375) calculated = 0.25;
        else if (calculated < 0.625) calculated = 0.5;
        else if (calculated < 0.875) calculated = 0.75;
        else calculated = 1;
      }

      this.setState({ value: calculated });
      this.props.sendSlider(calculated);
    });

    handle.addEventListener('touchstart', e => {
      e.preventDefault();
      longPressInit = true;
      longPressDelta = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };

      longPressTimeout = setTimeout(e => {
        longPressInit = false;
        longPress = true;
        this.setState({ precise: true });
      }, 500);
    });

    handle.addEventListener('touchend', e => {
      e.preventDefault();
      // tap event
      if (!longPress && longPressInit) {
        this.props.tapHandle(e);
      }

      if (longPressTimeout) clearTimeout(longPressTimeout);
      if (longPressInit) longPressInit = !longPressInit;
      if (longPress) longPress = !longPress;
      if (this.state.precise) this.setState({ precise: false });
    });
  }
  render () {
    return (
      <Container>
        <Track ref={e => (this.box = e)} />
        <Handle
          precise={this.state.precise}
          ref={e => (this.handle = e)}
          $value={this.state.value}>
          <HandleFill
            precise={this.state.precise}
            $value={this.state.value}>
            <svg viewBox='0 0 450 450'>
              <path d='M422.843,111.442L168.284,366a20.361,20.361,0,0,1-28.568,0L26.579,252.863a20,20,0,0,1,28.284-28.284L154,323.716,394.558,83.157A20,20,0,1,1,422.843,111.442Z' />
            </svg>
          </HandleFill>
        </Handle>
      </Container>
    );
  }
}