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

    let filePath = formElements[5].value;

    let dataText = document.getElementById('data-text').value;

    //  sampleData();
    readData(dataType, filePath, dataText, delimiter);

    //  Not working
    let e = document.getElementById('data-table');
    e.classList.remove('hidden');

  }


  function readData(dataType, filePath, dataText, delimiter) {
    console.log('data type ' + dataType + ' filepath' + filePath);
    if (dataType === 'csv') {
      if (dataText === '') {
        d3.csv(filePath).then(function (data) {
          let columns = d3.keys(data[0]);
          tabularize(data, columns);
          summarize(data, columns);
          scatterplot(data, columns);

        });
      } else {
        console.log('no file');

        let data = d3.csvParse(dataText);
        let columns = d3.keys(data[0]);

        tabularize(data, columns);
        summarize(data, columns);
        scatterplot(data, columns);

      }
    } else if (dataType === 'tsv') {
      if (dataText === '') {
        d3.tsv(filePath).then(function (data) {
          let columns = d3.keys(data[0]);
          tabularize(data, columns);
          summarize(data, columns);
          scatterplot(data, columns);

        });
      } else {
        console.log('no file');

        let data = d3.tsvParse(dataText);
        let columns = d3.keys(data[0]);

        tabularize(data, columns);
        summarize(data, columns);
        scatterplot(data, columns);

      }
    } else if (dataType === 'json') {
      if (dataText === '') {
        d3.json(filePath).then(function (data) {
          let columns = d3.keys(data[0]);
          tabularize(data, columns);
          summarize(data, columns);
          scatterplot(data, columns);

        });
      } else {
        console.log('no file');

        let data = JSON.parse(dataText);
        let columns = d3.keys(data[0]);

        tabularize(data, columns);
        summarize(data, columns);
        scatterplot(data, columns);

      }
    } else if (dataType === 'other') {
      if (dataText === '') {
        d3.dsv(delimiter, filePath).then(function (data) {
          let columns = d3.keys(data[0]);
          tabularize(data, columns);
          summarize(data, columns);
          scatterplot(data, columns);
        });
      } else {
        console.log('no file');
        console.log('delmiter: ' + delimiter)
        let psv = d3.dsvFormat(delimiter);

        let data = psv.parse(dataText);
        let columns = d3.keys(data[0]);

        tabularize(data, columns);
        summarize(data, columns);
      }
    }

  }


  function tabularize(data, columns) {
    console.log(data);
    let colWidth = 100 / columns.length + '%';

    let table = d3.select('body').select('article')
      .select('div#data-table');

    let header = table.append('div')
      .attr('id', 'table-head');

    header.append('div')
      .attr('class', 'row');

    let tableBody = table.append('div')
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
    let colWidth = 'calc(' + 100 / columns.length + '% - ' + margin * 2 + "px)";

    let summarySection = d3.select('body').select('article')
      .select('div#summaries');

    let summaries = summarySection.selectAll('div.summary')
      .data(columns)
      .enter()
      .append('div')
      .attr('class', 'summary')
      .style('width', colWidth)
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
        selectVariables(data, svg, 400, 400);
      });
    plot(data, columns[0], columns[0], svg, 400, 400)

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
      .range([height - padding, padding/10]);

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
      .attr('cy', function(d){
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
