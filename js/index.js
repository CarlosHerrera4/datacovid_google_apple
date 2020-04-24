
require([
    "dojo/_base/lang",
    "dojo/_base/array",

    "esri/request",

    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",

    "esri/widgets/Expand",

    "esri/core/promiseUtils",
    "vue",
    "dijit/TitlePane"
], function (
    lang,
    array,

    esriRequest,

    Map,
    MapView,
    SceneView,
    FeatureLayer,

    Expand,

    promiseUtils,
    Vue
) {
    var chart;
    var layer = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0",
        outFields: ["*"],
        popupEnabled: true,
        visible: true,
        title: "AA",
        opacity: 0

    })

    var layerCities = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Cities/FeatureServer/0",
        outFields: ["*"],
        popupEnabled: true,
        visible: true,
        title: "Cities",
        opacity: 0

    })


    var map = new Map({
        basemap: "streets-night-vector",
        layers: [layer, layerCities]
    });

    // var view = new MapView({
    //     container: "viewDiv",
    //     map: map,
    //     zoom: 4,
    //     center: [15, 65] // longitude, latitude
    // });
    var view = new SceneView({
        container: "viewDiv",
        map: map,
        zoom: 3,
        // center: [15, 65] // longitude, latitude
        center: [-4.38, 27.131] // longitude, latitude

    });

    view.popup.set("dockOptions", {
        breakpoint: false,
        buttonEnabled: false,
        position: "bottom-center"
    });
    view.popup.watch("visible", createChart);

    function createChart(config, index) {

    }

    var _charts = document.getElementById('generalChart')
    // var titleDiv = document.getElementById("titleDiv");
    // view.ui.add(titleDiv, "top-left");
    // var historicData = new Expand({
    //     //container: charts,
    //     content: _charts,
    //     expanded: false
    // });
    // view.ui.add(historicData, "bottom-left");
    // view.ui.add([charts], "top-right")

    var hitTest = promiseUtils.debounce(function (event) {
        return view.hitTest(event).then(function (hit) {
            var results = hit.results.filter(function (result) {
                return result.graphic.layer === layer;

            });

            if (!results.length) {
                return null;
            }

            return {
                graphic: results[0].graphic,
                screenPoint: hit.screenPoint
            };
        });
    });

    var name;

    Chart.defaults.global.defaultFontFamily = "'Poppins', monospace";
    Chart.defaults.global.defaultFontFamily = "'Avenir Next W00', 'Helvetica Neue',  sans-serif";

    const _info = new Vue({
        el: '#charts',
        data: {
            nameRegion: "",
            subregions: [],
            myChart: null,
            options: null
        },
        methods: {
            changeRegion: function changeItem(event) {
            
                var index = event.currentTarget.selectedIndex;
                var regionSelected = event.currentTarget.options[index].innerText;
                // this.selected = "rowId: " + rowId + ", target.value: " + event.target.value;

                var n_data = array.filter(this.subregions, function(item) {
                    return item.name == regionSelected
                })

                n_data[0].dates.unshift('Fecha')
                n_data  [0].retail_recreation.unshift('Retail')
                n_data[0].grocery_pharmacy.unshift('Pharmacy')
                n_data[0].parks.unshift('Parks')

                this.option.dataset.source =[
                    n_data[0].dates,
                    n_data[0].retail_recreation,
                    n_data[0].grocery_pharmacy,
                    n_data[0].parks
                ]
                this.nameRegion = n_data[0].name;
                this.myChart.setOption(this.option)
                
            },
            // goToSubRegions(subregion) {
            // that.map.setExtent(destiny.geometry.getExtent())
            // var query = {
            //     spatialRelationship: "intersects",
            //     where: "ADMIN_NAME = '" + subregion.name + "'",
            //     returnQueryGeometry: true
            // }
            // layerCities.queryExtent(query).then(lang.hitch(this, function (evt) {
            //     if (evt && evt.center) {
            //         view.goTo(evt.center)
            //     }
            // }))
            // }

            onChangeRegion(subregion) {
                debugger
            }
        },
        computed: {
            // selected: {
            //     get () {
            //         debugger
            //     }
            // }
            // hrStyles() {
            //     console.log("color:" + this.color)
            //     return {
            //         border: "1px solid",
            //         borderColor: "#" + this.color
            //     }
            // }
        }

    });


    view.whenLayerView(layer).then(lang.hitch(this, function (layerview) {
        var highlight;

        view.on("click", function (evt) {

            return hitTest(evt).then(
                function (hit) {
                    if (highlight) {
                        highlight.remove();
                        highlight = null;
                    }
                    if (hit) {
                        var graphic = hit.graphic;
                        name = hit.graphic.attributes.COUNTRY
                        var screenPoint = hit.screenPoint;

                        document.getElementById("country").innerText = name;

                        highlight = layerview.highlight(graphic)

                        var iso_code = hit.graphic.attributes.AFF_ISO;
                        var url = "https://mundogister.github.io/covid19-google-apple-data/data/" + iso_code + "/data.json"
                        //var url = "./data/data_google_mobility_ESP.json"

                        esriRequest(url, {
                            responseType: "json"
                        }).then(function (response) {
                            if (chart != undefined) {
                                chart.data.datasets[0].data = [];
                                chart.data.datasets[1].data = [];
                                chart.data.datasets[2].data = [];

                                chart.update();
                            }

                            // var arrayData = array.filter(this.results, function(item) {
                            //     return item.country_region_code == iso_code
                            // })

                            arrayDates = []
                            arrayRetailAndRecreation = [];
                            arrayGroceryAndPharmacy = [];
                            arrayParks = []

                            subRegions = []

                            for (i = 0; i < response.data.length; i++) {
                                if (response.data[i].sub_region_1 == "") {
                                    arrayDates.push(response.data[i].date);
                                    arrayRetailAndRecreation.push(parseFloat(response.data[i].retail_and_recreation_percent_change_from_baseline));
                                    arrayGroceryAndPharmacy.push(parseFloat(response.data[i].grocery_and_pharmacy_percent_change_from_baseline));
                                    arrayParks.push(parseFloat(response.data[i].parks_percent_change_from_baseline))
                                }
                                else {
                                    subRegions.push(response.data[i])
                                }
                            }

                            var config = {
                                type: 'line',
                                data: {
                                    labels: arrayDates,
                                    datasets: [{
                                        label: 'Retail & Recreation',
                                        fill: false,
                                        backgroundColor: "blue",
                                        borderColor: "blue",
                                        data: arrayRetailAndRecreation
                                    },
                                    {
                                        label: 'Grocery & Pharmacy',
                                        backgroundColor: "green",
                                        borderColor: "green",
                                        data: arrayGroceryAndPharmacy,
                                        fill: false,
                                    },
                                    {
                                        label: 'Parks',
                                        backgroundColor: "red",
                                        borderColor: "red",
                                        data: arrayParks,
                                        fill: false,
                                    }
                                    ]
                                },
                                options: {
                                    responsive: true,
                                    title: {
                                        display: false,
                                        text: "AAAA"
                                    },
                                    tooltips: {
                                        mode: 'index',
                                        intersect: false,
                                    },
                                    hover: {
                                        mode: 'nearest',
                                        intersect: true
                                    },
                                    scales: {
                                        xAxes: [{
                                            display: true,
                                            gridLines: {
                                                display: false,
                                                drawBorder: false
                                            },
                                            scaleLabel: {
                                                display: false,
                                                labelString: 'Mes'
                                            }
                                        }],
                                        yAxes: [{
                                            display: true,
                                            gridLines: {
                                                display: false,
                                                drawBorder: false
                                            },
                                            scaleLabel: {
                                                display: true,
                                                labelString: 'Casos'
                                            }
                                        }]
                                    }
                                }
                            }


                            chart = new Chart(document.getElementById('chart-country').getContext("2d"), config);


                            if (subRegions.length > 0) {


                                // Array with subregions names
                                arraySubRegionsTable = [];
                                arraySubRegionsNames = [];
                                for (i = 0; i < subRegions.length; i++) {
                                    if (!arraySubRegionsNames.includes(subRegions[i].sub_region_1)) {
                                        arraySubRegionsNames.push(subRegions[i].sub_region_1)
                                    }
                                }

                                for (i = 0; i < arraySubRegionsNames.length; i++) {
                                    var subregionname = arraySubRegionsNames[i]
                                    var subregionArray = subRegions.filter(function (result) {
                                        return result.sub_region_1 == subregionname
                                    });

                                    _arrayDates = []
                                    _arrayRetailAndRecreation = [];
                                    _arrayGroceryAndPharmacy = [];
                                    _arrayParks = [];
                                    for (j = 0; j < subregionArray.length; j++) {
                                        _arrayDates.push(subregionArray[j].date);
                                        _arrayRetailAndRecreation.push(subregionArray[j].retail_and_recreation_percent_change_from_baseline)
                                        _arrayGroceryAndPharmacy.push(subregionArray[j].grocery_and_pharmacy_percent_change_from_baseline)
                                        _arrayParks.push(subregionArray[j].parks_percent_change_from_baseline)
                                    }
                                    var infoSubRegion = {
                                        name: subregionname,
                                        dates: _arrayDates,
                                        retail_recreation: _arrayRetailAndRecreation,
                                        grocery_pharmacy: _arrayGroceryAndPharmacy,
                                        parks: _arrayParks
                                    }
                                    arraySubRegionsTable.push(infoSubRegion)


                                }

                                _info.subregions = arraySubRegionsTable;
                                _info.nameRegion = arraySubRegionsTable[0].name

                                arraySubRegionsTable[0].dates.unshift("Fecha")
                                arraySubRegionsTable[0].retail_recreation.unshift("Retail")
                                arraySubRegionsTable[0].grocery_pharmacy.unshift('Pharmacy')
                                arraySubRegionsTable[0].parks.unshift('Parks')

                                var dom = document.getElementById('regionsChart');
                                var myChart = echarts.init(dom);
                                option = {
                                    legend: {},
                                    tooltip: {
                                        trigger: 'axis',
                                        showContent: false
                                    },
                                    dataset: {
                                        source: [
                                            arraySubRegionsTable[0].dates,
                                            arraySubRegionsTable[0].retail_recreation,
                                            arraySubRegionsTable[0].grocery_pharmacy,
                                            arraySubRegionsTable[0].parks
                                        ]
                                    },
                                    xAxis: { type: 'category' },
                                    yAxis: { gridIndex: 0 },
                                    grid: { top: '55%' },
                                    series: [
                                        { type: 'line', smooth: true, seriesLayoutBy: 'row' },
                                        { type: 'line', smooth: true, seriesLayoutBy: 'row' },
                                        { type: 'line', smooth: true, seriesLayoutBy: 'row' },
                                        { type: 'line', smooth: true, seriesLayoutBy: 'row' },
                                        {
                                            type: 'pie',
                                            id: 'pie',
                                            radius: '30%',
                                            center: ['50%', '25%'],
                                            label: {
                                                formatter: 'Hola'
                                            },
                                            encode: {
                                                itemName: 'Fecha',
                                                value: '2020-03-01',
                                                tooltip: '2020'
                                            }
                                        }
                                    ]
                                };

                                myChart.on('updateAxisPointer', function (event) {
                                    var xAxisInfo = event.axesInfo[0];
                                    if (xAxisInfo) {
                                        var dimension = xAxisInfo.value + 1;
                                        myChart.setOption({
                                            series: {
                                                id: 'pie',
                                                label: {
                                                    formatter: '{b}: {@[' + dimension + ']}%'
                                                },
                                                encode: {
                                                    value: dimension,
                                                    tooltip: dimension
                                                }
                                            }
                                        });
                                    }
                                });

                                myChart.setOption(option);

                                _info.myChart = myChart;
                                _info.option     = option;



                                // _info.subregions = arraySubRegionsTable;
                            }
                        })

                    }
                    else {
                        if (chart != undefined) {
                            chart.data.datasets[0].data = [];
                            chart.data.datasets[1].data = [];
                            chart.data.datasets[2].data = [];

                            chart.update();
                        }
                    }
                }
            )
        })

        view.on("pointer-move", function (evt) {

        })
    }))

    Vue.component('listsubregions', {
        template: [
            "<div style='display: flex; flex-direction: column;'>",
            "<div v-on:click='showChart'>{{ subregion.name }}</div>",
            "</div>"
        ].join(""),
        props: {
            subregion: Object
        },
        methods: {
            showChart: function () {

            }
        }
    })


});