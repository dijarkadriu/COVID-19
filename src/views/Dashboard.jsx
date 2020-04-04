
import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";


class Dashboard extends Component {
  constructor(props){
    super(props)
    this.state = {
      
      confirmedCases :[],
      recoveredCases:[],
      deathCases: [],
      isDLoading : true,
      isCLoading : true,
      isRLoading : true,
      totalRCases: 1,
      totalCCases: 1,
      totalDCases: 1

    }
  }
  componentDidMount(){
    
 
   
    fetch('https://api.covid19api.com/dayone/country/Kosovo/status/recovered/live')
    .then(response => response.json())
    .then(data => this.setState( {recoveredCases :data,isDLoading:false,totalRCases:data.slice(-1).pop().Cases}))
   
    fetch('https://api.covid19api.com/dayone/country/Kosovo/status/confirmed/live')
    .then(response => response.json())
    .then(data => this.setState( {confirmedCases :data,isCLoading:false,totalCCases:data.slice(-1).pop().Cases}))
  
    fetch('https://api.covid19api.com/dayone/country/Kosovo/status/deaths/live')
    .then(response => response.json())
    .then(data => this.setState( {deathCases :data,isRLoading:false, totalDCases:data.slice(-1).pop().Cases}))
  
  }

   
  


  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
  render() {
    var legendSales = {
      names: ["Confirmed", "Recovered", "Deaths"],
      types: ["warning", "success", "danger"]
    };
    var dataSales = {
      labels: this.state.confirmedCases.map(item => item.Date.split('T')[0]).slice(this.state.confirmedCases.length - 7,this.state.confirmedCases.length),
      series: [
        this.state.confirmedCases.map(item => item.Cases).slice(this.state.confirmedCases.length - 7,this.state.confirmedCases.length),
        this.state.recoveredCases.map(item => item.Cases).slice(this.state.recoveredCases.length - 7,this.state.confirmedCases.length),
        this.state.deathCases.map(item => item.Cases).slice(this.state.deathCases.length - 7,this.state.confirmedCases.length)
      ]
    };
    var optionsSales = {
      low: 0,
      high:this.state.totalCCases,
      showArea: false,
      height: "450px",
      axisX: {
        showGrid: false,
        labelInterpolationFnc: function(value) {
          // If value is numeric, only return integers
          return (isNaN(value) || value % 1 == 0 ) ? value : ' ';  //returning a space still draws grid lines
       }
      },
      axisY: {
        labelInterpolationFnc: function(value) {
          // If value is numeric, only return integers
          return (isNaN(value) || value % 1 == 0 ) ? value : ' ';  //returning a space still draws grid lines
       }  
        },
     onlyInteger: true,
      lineSmooth: true,
      showLine: true,
      showPoint: true,
      fullWidth: true,
      
    };
   
    var dataPie = {
      labels: [this.state.totalCCases,this.state.totalRCases,this.state.totalDCases],
      series: [this.state.totalCCases,this.state.totalRCases,this.state.totalDCases]
    };
    var responsiveSales = [
      [
        "screen and (max-width: 640px)",
        {
          axisX: {
            labelInterpolationFnc: function(value) {
              return value[0];
            }
          }
        }
      ]
    ];
    if(this.state.isCLoadingading && this.state.isDLoading && this.state.isRLoading)
    {
      return <p>wait</p>
    }else{
      console.log(this.state.totalCases)
      return (
        <div className="content">
          <Grid fluid>
           
            <Row>
              <Col md={8}>
                <Card
                 
                  id="chartHours"
                  title="COVID-19 Cases in Kosovo"
                  category="Daily"               
                  content={
                    <div>
                      <ChartistGraph 
                      
                        id="chartPreferences"
                        data={dataSales}
                        type="Bar"
                        options={optionsSales}
                        responsiveOptions={responsiveSales}
                      />
                    </div>
                  }
                  legend={
                    <div className="legend">{this.createLegend(legendSales)}</div>
                  }
                />
              </Col>
              <Col md={4}>
                <Card
                  title="Total Cases"
                  category="Total"
                  
                  content={
                    <div
                      id="chartPreferences"
                      className="ct-chart ct-perfect-fourth"
                    >
                      <ChartistGraph data={dataPie} type="Pie" />
                    </div>
                  }
                  legend={
                    <div className="legend">{this.createLegend(legendSales)}</div>
                  }
                />
              </Col>
            </Row>
  
            
          </Grid>
        </div>
      );
    }
   
  }
}

export default Dashboard;
