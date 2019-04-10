"use strict";
/*
Javascript is a work in progress, 
but it does make the table for data input as text 
*/


(function () {
  window.onload = function () {
    document.getElementById('parse-button').onclick = parseData;
  };

  function parseData() {
    let formElements = document.getElementsByTagName('input');
    let dataType;
    let delimiter;

    if (formElements[0].checked) {
      dataType = 'csv';
    } else if (formElements[1].checked) {
      dataType = 'tsv';
    } else if (formElements[2].checked) {
      dataType = 'json';
    } else {
      delimiter = formElements[4].value;
      dataType = 'other';
    }

    let fileInput = document.getElementById('data-file');
    let file = fileInput.files[0];

    let filePath = '';
    let dataText = document.getElementById('data-text').value;

    if (file) {


      let reader = new FileReader();
      reader.onloadend = function (e) {
        let filePath = e.target.result;
        readData(dataType, filePath, dataText, delimiter);
      }
      reader.readAsDataURL(file);

    } else {
      readData(dataType, filePath, dataText, delimiter);

    }


  }

  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300 || response.status == 0) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }


  function readData(dataType, filePath, dataText, delimiter) {
    console.log('data type ' + dataType + ' filepath' + filePath);
    if (dataType === 'csv') {
      if (dataText === '') {
        fetch(filePath)
          .then(checkStatus)
          .then(d3.csvParse)
          .then(show)
          .catch((e) => alert('File could not be read'));
      } else {
        let data = d3.csvParse(dataText);
        show(data);
      }
    } else if (dataType === 'tsv') {
      if (dataText === '') {
        fetch(filePath)
          .then(checkStatus)
          .then(d3.tsvParse)
          .then(show);
      } else {
        let data = d3.tsvParse(dataText);
        show(data);
      }
    } else if (dataType === 'json') {
      if (dataText === '') {
        fetch(filePath)
          .then(checkStatus)
          .then(JSON.parse)
          .then(show);
      } else {
        let data = JSON.parse(dataText);
        show(data);
      }
    } else if (dataType === 'other') {
      if (dataText === '') {
        fetch(filePath)
          .then(checkStatus)
          .then((d) => {
            return d3.dsvFormat(delimiter).parse(d);
          })
          .then(show);
      } else {
        console.log('delimiter: ' + delimiter)
        let psv = d3.dsvFormat(delimiter);

        let data = psv.parse(dataText);
        show(data);
      }
    }

  }

  function show(data) {
    let columns = d3.keys(data[0]);

    tabularize(data, columns);
    summarize(data, columns);
    scatterplot(data, columns);
    let dataInputSection = document.querySelector('#data');
    
    // Initial value for transition
    dataInputSection.classList.add('hide');
  }

  function tabularize(data, columns) {
    console.log(data);
//    let colWidth = 100 / columns.length + '%';
    let colWidth = '300px';
    let table = d3.select('div#data-table');
    
    let tableContents = table.append('div')
      .attr('id', 'table-contents');

    let header = tableContents.append('div')
      .attr('id', 'table-head');

    header.append('div')
      .attr('class', 'row');

    let tableBody = tableContents.append('div')
      .attr('id', 'table-body');
    
    
    header.select('div.row').selectAll('div.cell')
      .data(columns)
      .enter()
      .append('div')
      .text(function (c) {
        return c;
      })
      .attr('class', 'cell')
      .attr('draggable', 'true')
      .style('width', colWidth)
      .attr('id', function (d) {
        return 'var-' + d
      });


    let rows = tableBody.selectAll('div.row')
      .data(data)
      .enter()
      .append('div')
      .attr('class', function (d, i) {
        if (i % 2 === 0) {
          return 'row even'
        } else {
          return 'row'
        }
      })
      .attr('id', function (d, i) {
        return i;
      })
      .attr('draggable', 'true');

    let cells = rows.selectAll('div.cell')
      .data(function (row) {
        return columns.map(function (col) {
          return {
            col: col,
            val: row[col]
          };
        });
      })
      .enter()
      .append('div')
      .attr('class', 'cell')
      .text(function (d) {
        return d.val;
      })
      .style('width', colWidth)

  }

  function summarize(data, columns) {
    let margin = 10;

    let summarySection = d3.select('div#summaries');

    let summaries = summarySection.selectAll('div.summary')
      .data(columns)
      .enter()
      .append('div')
      .attr('class', 'summary')
      .attr('id', function (c) {
        return "summary-" + c
      });

    summaries
      .insert('h3')
      .text(function (c) {
        return c;
      });

    summaries
      .append('div')
      .attr('class', 'stat-holder');

    summaries
      .append('div')
      .attr('class', 'value-holder');

    let stats = {};
    for (let i = 0; i < columns.length; i++) {
      stats[columns[i]] = {
        "Mean": 0,
        "Minimum": 0,
        "Maximum": 0,
        "Median": 0,
        "Std. Dev.": 0
      }
    }

    let mean;
    for (let i = 0; i < columns.length; i++) {
      mean = d3.mean(data, function (d) {
        return d[columns[i]];
      })
      stats[columns[i]]['Mean'] = mean;
    }

    let min;
    for (let i = 0; i < columns.length; i++) {
      min = d3.min(data, function (d) {
        return d[columns[i]];
      })
      stats[columns[i]]['Minimum'] = min;
    }

    let max;
    for (let i = 0; i < columns.length; i++) {
      max = d3.max(data, function (d) {
        return d[columns[i]];
      })
      stats[columns[i]]['Maximum'] = max;
    }

    let median;
    for (let i = 0; i < columns.length; i++) {
      median = d3.median(data, function (d) {
        return d[columns[i]];
      })
      stats[columns[i]]['Median'] = median;
    }

    let stdDev;
    for (let i = 0; i < columns.length; i++) {
      stdDev = d3.deviation(data, function (d) {
        return d[columns[i]];
      })
      stats[columns[i]]['Std. Dev.'] = stdDev;
    }
    console.log(stats);

    for (let i = 0; i < columns.length; i++) {
      console.log('div#summary-' + columns[i]);
      summarySection
        .select('div#summary-' + columns[i])
        .select('div.stat-holder')
        .selectAll('div.stats')
        .data(d3.keys(stats[columns[i]]))
        .enter()
        .append('div')
        .attr('class', 'stats')
        .text(function (d) {
          return d;
        });
    }

    for (let i = 0; i < columns.length; i++) {
      console.log('div#summary-' + columns[i]);
      summarySection
        .select('div#summary-' + columns[i])
        .select('div.value-holder')
        .selectAll('div.values')
        .data(d3.values(stats[columns[i]]))
        .enter()
        .append('div')
        .attr('class', 'values')
        .text(function (d) {
          return Math.round(+d * 100) / 100;
        });
    }
  }

  function scatterplot(data, columns) {

    d3.select('#plot')
      .append('label')
      .text('X-Axis')
      .attr('for', 'x-axis-selector')

    let xSelector = d3.select('#plot')
      .append('select')
      .attr('id', 'x-axis-selector');

    d3.select('#plot')
      .append('label')
      .text('Y-Axis')
      .attr('for', 'y-axis-selector')

    let ySelector = d3.select('#plot')
      .append('select')
      .attr('id', 'y-axis-selector');


    let svg = d3.select('#plot').append('svg')

    xSelector.selectAll("#x-axis-selector option").data(columns).enter()
      .append('option')
      .text(function (d) {
        return d;
      })
      .attr('value', function (d) {
        return d;
      });

    ySelector.selectAll("#y-axis-selector option").data(columns).enter()
      .append('option')
      .text(function (d) {
        return d;
      })
      .attr('value', function (d) {
        return d;
      });

    let selectors = d3.selectAll('#plot select')
      .on('change', function () {
        selectVariables(data, svg, 400, 600);
      });
    plot(data, columns[0], columns[0], svg, 400, 600)

  }

  function mapXY(data, x, y) {
    return data.map(d => [d[x], d[y]]);
  }

  function selectVariables(data, svg, height, width) {
    let xVariable = document.getElementById('x-axis-selector').value;
    let yVariable = document.getElementById("y-axis-selector").value;

    plot(data, xVariable, yVariable, svg, height, width);

  }

  function plot(data, x, y, svg, height, width) {
    data = mapXY(data, x, y);

    let padding = 60;


    svg.attr('width', width + "px")
      .attr('height', height + "px");

    let xScale = d3.scaleLinear()
      .domain([d3.min(data, function (d) {
          return +d[0];
        }) * 0.95,
               d3.max(data, function (d) {
          return +d[0];
        })])
      .range([padding, width - padding]);

    let yScale = d3.scaleLinear()
      .domain([d3.min(data, function (d) {
          return +d[1];
        }) * 0.95,
               d3.max(data, function (d) {
          return +d[1];
        })])
      .range([height - padding, padding / 10]);

    let xAxis = d3.axisBottom().scale(xScale).ticks(5);
    let yAxis = d3.axisLeft().scale(yScale).ticks(5);

    let t = d3.transition()
      .delay(500)
      .duration(1000)
      .ease(d3.easeLinear)

    d3.selectAll('#plot svg *').remove();


    svg.selectAll('.point').data(data).enter().append('circle')
      .attr('class', 'point')
      .attr('r', 5)
      .attr('cx', function (d) {
        return xScale(d[0]);
      })
      .attr('cy', yScale(d3.min(data, function (d) {
        return +d[1];
      })))
      //      .style('transform', function (d) {
      //        return "translateY(" + (-height + yScale(d[1])+padding)+ "px)";
      //      })
      .style('fill', '#187cce')
      .style('stroke', 'black')
      .style('opacity', 0.8)
      .transition(t)
      .attr('cy', function (d) {
        return yScale(d[1]);
      });

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0 " + (height - padding) + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis);


    svg.append("text")
      .attr("class", "axis-label")
      .text(x)
      .attr('y', height - padding / 2)
      .attr('x', (width - padding) / 2)

    svg.append("text")
      .attr("class", "axis-label")
      .text(y)
      .attr('x', -(height / 2))
      .attr('y', padding / 2)
      .style('transform', 'rotate(-90deg)');
  }
})();
