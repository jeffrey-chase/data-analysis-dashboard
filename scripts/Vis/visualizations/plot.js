(function (package) {
  package.plotContainer = (data, columns, parent)=>{

    parent
      .append('label')
      .text('X-Axis')
      .attr('for', 'x-axis-selector')

    let xSelector = parent
      .append('select')
      .attr('id', 'x-axis-selector');

    parent
      .append('label')
      .text('Y-Axis')
      .attr('for', 'y-axis-selector')

    let ySelector = parent
      .append('select')
      .attr('id', 'y-axis-selector');


    let svg = parent.append('svg')

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

    let selectors = parent.selectAll('select')
      .on('change', function () {
        selectVariables(data, svg, 400, 400);
      });
    plot(data, columns[0], columns[0], svg, 400, 400)
  };
})(Vis);
