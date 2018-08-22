import React from 'react'

export default class Counter extends React.Component {
  state = {value: 0}
  render() {
    return (
      <div>
        <button onClick={() => this.setState({value: this.state.value + 1})}>+</button>
        {this.state.value}
        <button onClick={() => this.setState({value: this.state.value - 1})}>-</button>
      </div>
    )
  }
}
