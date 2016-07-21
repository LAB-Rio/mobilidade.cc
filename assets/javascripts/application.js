window.InfoMap = window.InfoMap || {
  
  $: jQuery,

  cartoDB: cartodb,

  selector: $('#layer_selector li'),

  mapVis: null,
  mapLayers: null,

  initialize: function() {
    this.createCartoDBMap();
    this.watchSelectorClick();
    this.expandMapOnStart();

  },

  expandMapOnStart: function() {
    $('.see-map').on('click', function(){
      $('#header').toggleClass('actions-start');
    });
  },

  watchSelectorClick: function() {
    var self = this;

    self.selector.on('click', function(){
      var item  = $(this);
      var layer = item.data('sublayer');

      if ( item.hasClass('selected') ) {
        self.toggleLegend(item);
        item.removeClass('selected');
        self.removeLayerView(layer)


      } else {
        item.addClass('selected');
        self.toggleLegend(item);
        self.addLayerView(layer);

      }
    });
  },

  createCartoDBMap: function() {
    var self = this;

    self.cartoDB.createVis('map', 'http://labrio.cartodb.com/api/v2/viz/c8c18946-a32b-11e4-aaf3-0e4fddd5de28/viz.json', {
      tiles_loader: true,
      zoom: 13,
      legends: true,

   }).done(function(vis, layers){
      self.mapVis     = vis;
      console.log(self.mapVis);
      self.mapLayers  = layers;
      console.log(self.mapLayers);
      self.$('li[data-sublayer=3]').click();

      self.createCyclingMapLayer();
   });
  },

  addLayerView: function(layer){
    this.mapLayers[1].getSubLayer(layer).show();
    this.mapVis.legends.getLegendByIndex(layer).show();
  },

  removeLayerView: function(layer){
    this.mapLayers[1].getSubLayer(layer).hide();
    this.mapVis.legends.getLegendByIndex(layer).hide();

  },


  createCyclingMapLayer: function(){
    var sublayer = this.mapLayers[1].createSubLayer({
      sql: "SELECT * FROM ciclovias_do_rio_de_janeiro",
      cartocss: "#ciclovias_do_rio_de_janeiro { line-width: 2;  line-opacity: 0.8; } #ciclovias_do_rio_de_janeiro[status=1] { line-color: #229A00; } #ciclovias_do_rio_de_janeiro[status=3] { line-color: #5CA2D1; } #ciclovias_do_rio_de_janeiro[status=2] { line-color: #FFA300; }",
      legends: true,
      
    }).hide();

    this.loadCyclingLegend();


  },

  loadCyclingLegend: function() {
    var cicloLegend = new cdb.geo.ui.Legend.Custom({
      title: "Ciclovias, Ciclofaixas e Vias Compartilhadas",
      data: [
        { name: "Implantada",         value: "#229A00" },
        { name: "Projeto",            value: "#5CA2D1" },
        { name: "Construção",         value: "#FFA300" },
      ]
    });


    var legend = $(cicloLegend.render().el).addClass('cycling');


    $('.cartodb-legend-stack').append(legend);
    $('.cycling').hide();
  },

  toggleLegend: function(el){
    console.log(el);
    if (el.hasClass('legend-cycling')) {
      $('.cycling').toggle();
    }
  },


};








InfoMap.initialize();
