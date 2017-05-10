import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CalendarContainer from './CalendarContainer'
import moment from 'moment'
import Sugar from 'sugar'
import _ from 'underscore'
import axios from 'axios'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/genie.css'

const apiHolidays = "https://holidayapi.com/v1/holidays"
Date.prototype.getWeek = function () {
  var target = new Date(this.valueOf());
  var dayNr = (this.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  var firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() != 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000);
}



class App extends Component {
  state = {
    arrayMonth: [],
    holidays: []
  }
  onSubmit = (e) => {
    e.preventDefault()
    const dateStart = e.target.dateStart.value
    const numberOfDays = e.target.numberDays.value
    const countryCod = e.target.countryCode.value
    this.calculateCalendar(dateStart, numberOfDays)
    axios.get(apiHolidays, {
      params: {
        key: '1627c860-844b-4d25-8495-ddaae982a946',
        country: countryCod.toUpperCase(),
        year: '2008'
      }
    })
      .then((result) => {
        if (result.data.status == 200) {
          this.setState({
            holidays: result.data.holidays
          })
          Alert.success('Holidays data successfull fetched', {
            position: 'top-right',
            effect: 'genie',
            beep: false,
            timeout: 2000,
            offset: 100
          })
        } else {
          Alert.warning('Holidays data could not be fetched', {
            position: 'top-right',
            effect: 'genie',
            beep: false,
            timeout: 2000,
            offset: 100
          });
        }


      })
      .catch((err) => {
        console.log(err.message)
        Alert.warning(`<h1>${err.message}</h1>`, {
          position: 'top-right',
          effect: 'genie',
          beep: false,
          timeout: 'none',
          offset: 100
        });
      })

  }

  calculateCalendar(dateStart, numberOfDays) {

    const monthName = {
      0: "JANUARY",
      1: "FEBRUARY",
      2: "MARCH",
      3: "APRIL",
      4: "MAY",
      5: "JUNE",
      6: "JULY",
      7: "AUGUST",
      8: "SEPTEMBER",
      9: "OCTUBRE",
      10: "NOVEMBER",
      11: "DICEMBER"
    }

    let arrayFechas = []
    for (let i = 0; i < numberOfDays; i++) {
      const posSemana = Sugar.Date(dateStart).addDays(i).getWeekday() //posicion en la semana
      const fechaDelDia = Sugar.Date(dateStart).addDays(i).getDate() //fecha del dia
      const mes = Sugar.Date(dateStart).addDays(i).getMonth() //mes
      const year = Sugar.Date(dateStart).addDays(i).getFullYear() //año
      const week = moment(dateStart).add(i, 'days').week()
      arrayFechas.push({
        year: year.raw,
        month: mes.raw,
        day: fechaDelDia.raw,
        posWeek: posSemana.raw,
        week: week
      })
    }
    const groupByMonth = _.groupBy(arrayFechas, 'month')
    let arrayMonth = []
    for (const m in groupByMonth) {
      arrayMonth.push({
        month: monthName[m],
        dates: groupByMonth[m]
      })
    }
    this.setState({ arrayMonth: arrayMonth })
  }
  render() {

    return (
      <div>
        <div className="form-container">
          <form onSubmit={this.onSubmit}>
            Start Date: <input type="date" name="dateStart" defaultValue="2008-01-01" required /><br />
            Number of Days: <input type="number" name="numberDays" min="1" step="1" required /><br />
            Country Code: <input type="text" name="countryCode" placeholder="exp: US" maxLength={2} required /><br />
            <input type="submit" value="Create Calendar" />

          </form>
        </div>
        {this.state.arrayMonth.map((month, index) => {
          return <CalendarContainer key={index} month={month} holidays={this.state.holidays} />
        })}
      <Alert stack={{limit: 3}} />
      </div>


    );
  }
}

export default App;
