import React, { Component } from 'react';
import axios from 'axios';
import InnerComponent from './InnerComponent/InnerComponent.js'

const searchString = (inputValue) => {
  const URL = '/big.txt';
  return new Promise(resolve =>
    axios.get(URL)
    .then(function (response) {
      console.log('response', response);
      resolve(response.data);
    })
    .catch(function (error) {
      console.log(error);
    })
  );
}

export default class Home extends Component {
  state = { inputValue: '' };
  componentDidMount() {
    searchString().then((data) => this.setState({inputValue: data}));
  }
  render() {
    return (
      <div>
        <InnerComponent
          bookData={this.state.inputValue}
        />
      </div>
    );
  }
}
