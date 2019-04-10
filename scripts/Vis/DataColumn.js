(function (package) {
  this.DataColumn = (dataArray) => {

    this.data = dataArray.map((d) => {
      return d
    });
    this.numericData = data.filter((d) => {
      return isNaN(+d);
    })

    this.levels;
    this.listOfLevels;
    this.has;

    if (window.Set !== 'undefined') {
      this.levels = new Set();
      dataArray.forEach((d) => this.unique.add(d));
      this.has = (el) => this.unique.has(el);
    } else {
      this.unique = {};
      dataArray.forEach((d) => {
      [d]: true
      });
      this.has = (el) => this.unique[d] === true;
      this.listOfLevels = [];
      for (let i in this.unique) this.listOfLevels.push(i);


      this.dataType = '';
      this.dataType2 = '';
      this.typeAmbivalent = true; // For now, always ask the user to confirm
      this.typeAmbivalent2 = true;

      if (this.numericData.length / this.data.length > 0.7) {
        if (this.listOfLevels.length / this.data.length > 0.2) {
          this.dataType = 'categorical';
          this.dataType2 = 'ordinal';
        } else {
          this.dataType = 'numeric';
          let extent = d3.extent(this.numericData)
          if (extent[0] < 0 && extent[1] > 0) {
            this.dataType2 = 'diverging';
          }
        }
      } else {
        this.dataType = 'categorical';
      }

    }
  }
})(Vis);
