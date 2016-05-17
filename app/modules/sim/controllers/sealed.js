class SealedController {
  constructor(SimService, UserService, $state, $stateParams, $firebaseObject) {
    this._$firebaseObject = $firebaseObject;
    this._SimService = SimService;
    this._UserService = UserService;
    this._$state = $state;
    this._$stateParams = $stateParams;

    this.edit = false;
    this.display = 'sealed';
    this.filterOption = "#";
    this.filter = {};
    this.sort = ['colors.length', 'colors', 'cmc', 'name'];
    this.showFilter = false;
    this.showSort = false;
    this.showLands = false;
    this.analyzing = false;
    this.numLands = 0;

    this._UserService.isLoggedIn()
      .then((response) => {
        this.user = response;
        this.getCards();
      })
      .catch((error) => {
        this._$state.go("login");
      });

  }

  editTitle() {
    this.edit = !this.edit;
  }

  saveTitle() {
    this._SimService.saveTitle(this.title);
    this.edit = false;
  }

  getCards() {
    this._SimService.getSealedPool(this.user.uid, this._$stateParams.id)
      .then((response) => {
        this.sealedPool = response[0];
        this.cards = response[1];
        this.title = this.sealedPool.title;
        this.count = 0;
        this.cards.forEach((card) => {
          if(card.selected === true) {
            this.count += 1;
          }
        });
        this._SimService.getSet(this.sealedPool.set)
          .then((response) => {
            this.set = response.set;
          });
      });
  }

  toggleCard(card) {
    if (card.selected === false) {
      this.count += 1;
    }
    else {
      this.count -= 1;
    }

    card.selected = !card.selected;
    this._SimService.save(card);
  }

  addLands(land) {
    this._SimService.addLand(land, this.numLands);
    this.count += this.numLands;
    this.numLands = 0;
  }

  displayChange() {
    if (this.display === 'sealed') {
      this.display = 'deck';
    }
    else {
      this.display = 'sealed';
    }
  }

  displaySort() {
    this.showFilter = false;
    this.showLands = false;
    this.showSort = !this.showSort;
  }

  displayFilter() {
    this.showSort = false;
    this.showLands = false;
    this.showFilter = !this.showFilter;
  }

  displayLands() {
    this.showFilter = false;
    this.showSort = false;
    this.showLands = !this.showLands;
  }

  analyzeShow() {
    this.showFilter = false;
    this.showSort = false;
    this.showLands = false;
    this.analyzing = !this.analyzing;

    this.analyze();
    this.chart();
  }

  sortCards(option) {
    if(this.sort.indexOf('colors.length') >= 0) {
      this.sort = [];
    }

    this.sort.push(option);
  }

  resetSort() {
    this.sort = ['colors.length', 'colors', 'cmc', 'name'];
  }

  filterCards(property) {
    if (property === 'cmc') {
      this.filterOption = Number(this.filterOption);
    }
    else {
      this.filter[property] = this.filterOption;
    }
  }

  resetFilters() {
    this.filterOption = "#";
    this.filter = {};
  }

  analyze() {
    const colors = ['White', 'Blue', 'Black', 'Red', 'Green']

    //Analyze Colors
    colors.forEach((color) => {
      this[color] = 0;
    })
    this.multicolor = 0;
    this.colorless = 0;

    //Analyze CMC
    for(let k = 0; k <= 6; k++) {
      this[`cmc${k}`] = 0;
    }
    this.cmc7Plus = 0;

    //Analyze Card Types
    this.creatures = 0;
    this.lands = 0;
    this.spells = 0;

    //Analyze Mana Symbols
    const manaSymbols = ['W', 'U', 'B', 'R', 'G'];

    manaSymbols.forEach((symbol) => {
      this[symbol] = 0;
    })

    //Begin Analyzing
    this.cards.forEach((card) => {

      if(card.selected === true) {

        //Analyzing Color Breakdown
        if(card.colors === undefined) {
          if(card.types.indexOf('Land') === -1) {
            this.colorless += 1;
          }
        }
        else if(card.colors.length > 1) {
          this.multicolor += 1;
        }
        else {
          colors.forEach((color) => {
            if(card.colors.indexOf(color) > -1) {
              this[color] += 1;
            }
          })
        }

        //Analyzing CMC
        for(let i = 0; i <= 6; i++) {
          if(card.cmc === i) {
            this[`cmc${i}`] += 1;
          }
        }

        if(card.cmc >= 7) {
          this.cmc7Plus += 1;
        }

        //Analyze Card Types
        if(card.types.indexOf('Creature') > -1) {
          this.creatures += 1;
        }
        else if (card.types.indexOf('Land') > -1) {
          this.lands += 1;
        }
        else {
          this.spells += 1;
        }

        //Analyze Mana Symbols
        manaSymbols.forEach((symbol) => {
          if(card.manaCost !== undefined) {

            card.manaCost.split("").forEach((i) => {
              if(i === symbol) {
                this[symbol] += 1;
              }
            });

          }
        });
      }

    });

  }

  chart() {
    document.querySelector('.charts').innerHTML = '';

    const colorContainer = document.createElement('div');
    colorContainer.classList.add('chart');
    document.querySelector('.charts').appendChild(colorContainer);

    window.chart = new Highcharts.Chart({
        chart: {
            renderTo: colorContainer,
            backgroundColor: 'rgba(0,0,0,0)',
            type: 'pie',
            width: 350
        },
        title: {
            text: 'Color Breakdown',
            style: {
              color: '#fff'
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    style: {
                      color: '#fff'
                    }
                }
            }
        },
        series: [{
          type: 'pie',
          name: 'Cards',
          borderColor: '#000',
          data: [{
              name: 'White',
              y: this.White,
              color: '#fff'
            },
            {
              name: 'Blue',
              y: this.Blue,
              color: 'blue'
            },
            {
              name: 'Black',
              y: this.Black,
              color: '#111'
            },              {
              name: 'Red',
              y: this.Red,
              color: 'crimson'
            },
            {
              name: 'Green',
              y: this.Green,
              color: 'green'
            },
            {
              name: 'Multicolor',
              y: this.multicolor,
              color: 'gold'
            },
            {
              name: 'Colorless',
              y: this.colorless,
              color: 'grey'
            }]
        }]
    });

    const symbolContainer = document.createElement('div');
    symbolContainer.classList.add('chart');
    document.querySelector('.charts').appendChild(symbolContainer);

    window.chart = new Highcharts.Chart({
      chart: {
        renderTo: symbolContainer,
        backgroundColor: 'rgba(0,0,0,0)',
        type: 'column',
        width: 350
      },
      legend: {
        enabled: false
      },
      title: {
        text: 'Mana Symbols',
        style: {
          color: '#fff'
        }
      },
      xAxis: {
        title: {
          text: 'Symbols',
          style: {
            color: '#fff'
          }
        },
        categories: ['W', 'U', 'B', 'R', 'G'],
        labels: {
          style: {
            color: '#fff'
          }
        }
      },
      yAxis: {
        title: {
          text: 'Number of Symbols',
          style: {
            color: '#fff'
          }
        },
        labels: {
          style: {
            color: '#fff'
          }
        }
      },
      series: [{
        name: 'Cards',
        color: '#fff',
        borderColor: '#000',
        data: [{
          name: 'W',
          y: this.W,
          color: 'white'
        },
        {
          name: 'U',
          y: this.U,
          color: 'blue'
        },
        {
          name: 'B',
          y: this.B,
          color: 'black'
        },
        {
          name: 'R',
          y: this.R,
          color: 'red'
        },
        {
          name: 'G',
          y: this.G,
          color: 'green'
        }]
      }]
    });

    const typeContainer = document.createElement('div');
    typeContainer.classList.add('chart');
    document.querySelector('.charts').appendChild(typeContainer);

    window.chart = new Highcharts.Chart({
      chart: {
        renderTo: typeContainer,
        backgroundColor: 'rgba(0,0,0,0)',
        type: 'pie',
        width: 350
      },
      title: {
        text: 'Card Types'
      },
      title: {
          text: 'Card Types',
          style: {
            color: '#fff'
          }
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 35,
              dataLabels: {
                  enabled: true,
                  format: '{point.name}',
                  style: {
                    color: '#fff'
                  }
              }
          }
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'Type',
        borderColor: '#000',
        data: [{
          color: 'brown',
          y: this.lands,
          name: 'Lands'
        },
        {
          color: 'green',
          y: this.creatures,
          name: 'Creatures'
        },
        {
          color: 'red',
          y: this.spells,
          name: 'Spells'
        }]
      }]
    });

    const cmcContainer = document.createElement('div');
    cmcContainer.classList.add('chart');
    document.querySelector('.charts').appendChild(cmcContainer);

    window.chart = new Highcharts.Chart({
      chart: {
        renderTo: cmcContainer,
        backgroundColor: 'rgba(0,0,0,0)',
        type: 'column',
        width: 350
      },
      legend: {
        enabled: false
      },
      title: {
        text: 'Mana Symbols',
        style: {
          color: '#fff'
        }
      },
      xAxis: {
        title: {
          text: 'Symbols',
          style: {
            color: '#fff'
          }
        },
        categories: ['0', '1', '2', '3', '4', '5', '6', '7+'],
        labels: {
          style: {
            color: '#fff'
          }
        }
      },
      yAxis: {
        title: {
          text: 'Number of Cards',
          style: {
            color: '#fff'
          }
        },
        labels: {
          style: {
            color: '#fff'
          }
        }
      },
      series: [{
        name: 'Cards',
        color: 'gold',
        borderColor: '#000',
        data: [this.cmc0, this.cmc1, this.cmc2, this.cmc3, this.cmc4, this.cmc5, this.cmc6, this.cmc7Plus]
      }]
    });
  }
}

export default SealedController;
