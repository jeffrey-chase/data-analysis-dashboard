(function (package) {

  package.tabularize = (data, columns, parent) => {
    let colWidth = 100 / columns.length + '%';

    let table = parent
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

    header.exit().remove();


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

    rows.exit().remove();

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
      .style('width', colWidth);

    cells.exit().remove();
  };

})(Vis);
