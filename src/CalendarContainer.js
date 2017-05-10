import React, { Component } from 'react'
import './CalendarContainer.css'
import moment from 'moment'
import Sugar from 'sugar'
import _ from 'underscore'
import classNames from 'classnames'

Date.prototype.getWeek = function () {
    var target  = new Date(this.valueOf());
    var dayNr   = (this.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}



const DayContainer =({day,isWeekEndDay,invalid,holidays})=>{
  
   const numberDay = invalid ? "":day.day
   const contentDay = ()=>{
       if(holidays){
           console.log(holidays)
           return (
               <div>
                <div>{numberDay}</div>
                {}
               </div>
               
           )
       }else{
           return <span>{numberDay}</span>
       }
   }
   const classDay = classNames({
       'day-weekend':isWeekEndDay,
       'day-workday':!isWeekEndDay,
       'day-invalid':invalid,
       'day-holiday':holidays
   })
    return (
        <td className={classDay}>
            <div>
                {numberDay}
            </div>
            {holidays && 
                <ul>
                    {holidays.map((holiday,index)=><li key={index}>{holiday.name}</li>)}
                </ul>
            }
        </td>
    )
}
const WeekContainer = ({days,holidays})=>{
   
    const totalArrayDayWeek = [0,1,2,3,4,5,6]
    const arrayDays = totalArrayDayWeek.map((pos)=>{
        let arrayResult
        arrayResult = {
            day:null
        }
        
        for(let i =0;i<days.length;i++){
            if(days[i].posWeek === pos){
                arrayResult=days[i]
            }
        }

        return arrayResult
    })

    const formatHoly = arrayDays.map((day)=>{
        if(day.day){
            return moment(new Date(day.year,day.month,day.day)).format('YYYY-MM-DD')
        }
    })
  
 

    return (
        <tr>
            {arrayDays.map((day,index)=>{
                const isWeekEndDay = (index == 0 || index == 6) ? true:false
                const invalid = day.day ? false:true
                const formatHoliday = moment(new Date(day.year,day.month,day.day)).format('YYYY-MM-DD')
                const dayHolidays = holidays[formatHoliday]
                
                return <DayContainer 
                key={index} 
                day={day} 
                isWeekEndDay={isWeekEndDay} 
                holidays={dayHolidays}
                invalid={invalid}/>
              
            })}
        </tr>
    )
}

const BodyCalendar = ({dates,holidays}) => {

    const groupByWeek = _.groupBy(dates,'week')
    let arrayWeeks = []
    for (const m in groupByWeek) {
      arrayWeeks.push({
        week: m,
        dates: groupByWeek[m]
      })
    }
   
    return (
        <tbody>
            {arrayWeeks.map((week,index)=>{
                return <WeekContainer days = {week.dates} key={index} holidays={holidays}/>
            })}
        </tbody>
    )
}


const CalendarHeader = ({month,holidays}) => {
    const year = month.dates[0].year
    
    return (
        <table className="calendarMonth">
            <thead>
                <tr>
                    <th colSpan="7">
                        <span className="calendarMonth">{month.month}</span>
                        <span> {year}</span>
                    </th>

                </tr>

                <tr className="calendarWeekdays">
                    <th>Sunday</th>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                    <th>Thursday</th>
                    <th>Friday</th>
                    <th>Saturday</th>

                </tr>
            </thead>
            <BodyCalendar dates = {month.dates} holidays={holidays} />
        </table>
    )
}

class FormInput extends Component {
    render() {
        return (
            <form>

            </form>
        )
    }
}
export default class Calendar extends Component {

    render() {
        
        return (
            <div>
                <CalendarHeader month={this.props.month} holidays={this.props.holidays}/>
            </div>

        )
    }
}

