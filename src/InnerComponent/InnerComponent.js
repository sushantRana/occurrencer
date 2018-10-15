import React, { Component } from 'react';
import './InnerComponent.css';
import * as config from '../config.js';

export default class InnerComponent extends Component {
  state = {
    fetchURIOutput: []
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.bookData !== this.props.bookData) {
      const bookData = nextProps.bookData;
      const processed = bookData.split(' ').sort();
      console.log(processed);
      let currentWord = '';
      let wordcount = 0;
      const finalArray = [];
      const result10Array = [];
      processed.forEach((current) => {
        if (current !== currentWord) {
          finalArray.push({
            word: currentWord,
            count: wordcount
          });
          currentWord = current;
          wordcount = 1;
        } else {
          wordcount++;
        }
      })
      const finalSortedArray = finalArray.sort((current, next) => {
        return next.count - current.count;
      })
      console.log('finalSortedArray', finalSortedArray);
      for(let index = 0; index< 10; index ++ ) {
        result10Array.push(finalSortedArray[index]);
      }
      let countSelected = 0;
      let selectedArray = []
      finalSortedArray.forEach((current) => {
        if (current.word && countSelected < 10) {
          countSelected++
          selectedArray.push({word: current.word, count: current.count});
        }
      });
      const fetchURIOutput = [];
      const fetchPromise = [];
      selectedArray.forEach((current, index) => {
        fetchPromise.push(this.fetchWords(current.word))
        fetchURIOutput.push({
          word: current.word,
          count: current.count
        })
      })
      Promise.all(fetchPromise).then((response) => {
        console.log('response ==>', response);
        response.forEach((value, index) => {
          fetchURIOutput[index].result = value.def[0];
        })
        console.log('fetchURIOutput ==>', fetchURIOutput);
        this.setState({
          fetchURIOutput
        })
      });
    }
  }
  async fetchWords(word) {
    const APIKEY = config.APIKEY;
    const URL = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?';
    const finalURL = `${URL}key=${APIKEY}&lang=en-en&text=${word}`;
    const response = await fetch(finalURL);
    const json = await response.json();
    return json;
  }
  render () {
    return (
      <div>
        {
          this.state.fetchURIOutput.map(current => {
            return (
              <div>
                <div>
                  <th className="tableTD"> Word : </th>
                  <td className="tableTD"> {current.word}</td>
                </div>
                <table>
                  <tr>
                    <th className="tableTD"> Count : </th>
                    <td className="tableTD"> {current.count}</td>
                  </tr>
                  <tr>
                    <th className="tableTD"> POS : </th>
                    <td className="tableTD"> {current.result && JSON.stringify(current.result.pos)}</td>
                  </tr>
                  <tr>
                    <th className="tableTD"> Synonyms : </th>
                    <td className="tableTD"> {current.result && JSON.stringify(current.result.tr)}</td>
                  </tr>
                </table>
              </div>
          )})
        }
      </div>)
  }
}
