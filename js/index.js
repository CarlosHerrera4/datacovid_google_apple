
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
    "esri/core/scheduling",
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
    scheduling,
    Vue
) {

    const country_codes = [
        "BD",
        "BE",
        "BF",
        "BG",
        "BA",
        "BB",
        "WF",
        "BL",
        "BM",
        "BN",
        "BO",
        "BH",
        "BI",
        "BJ",
        "BT",
        "JM",
        "BV",
        "BW",
        "WS",
        "BQ",
        "BR",
        "BS",
        "JE",
        "BY",
        "BZ",
        "RU",
        "RW",
        "RS",
        "TL",
        "RE",
        "TM",
        "TJ",
        "RO",
        "TK",
        "GW",
        "GU",
        "GT",
        "GS",
        "GR",
        "GQ",
        "GP",
        "JP",
        "GY",
        "GG",
        "GF",
        "GE",
        "GD",
        "GB",
        "GA",
        "SV",
        "GN",
        "GM",
        "GL",
        "GI",
        "GH",
        "OM",
        "TN",
        "JO",
        "HR",
        "HT",
        "HU",
        "HK",
        "HN",
        "HM",
        "VE",
        "PR",
        "PS",
        "PW",
        "PT",
        "SJ",
        "PY",
        "IQ",
        "PA",
        "PF",
        "PG",
        "PE",
        "PK",
        "PH",
        "PN",
        "PL",
        "PM",
        "ZM",
        "EH",
        "EE",
        "EG",
        "ZA",
        "EC",
        "IT",
        "VN",
        "SB",
        "ET",
        "SO",
        "ZW",
        "SA",
        "ES",
        "ER",
        "ME",
        "MD",
        "MG",
        "MF",
        "MA",
        "MC",
        "UZ",
        "MM",
        "ML",
        "MO",
        "MN",
        "MH",
        "MK",
        "MU",
        "MT",
        "MW",
        "MV",
        "MQ",
        "MP",
        "MS",
        "MR",
        "IM",
        "UG",
        "TZ",
        "MY",
        "MX",
        "IL",
        "FR",
        "IO",
        "SH",
        "FI",
        "FJ",
        "FK",
        "FM",
        "FO",
        "NI",
        "NL",
        "NO",
        "NA",
        "VU",
        "NC",
        "NE",
        "NF",
        "NG",
        "NZ",
        "NP",
        "NR",
        "NU",
        "CK",
        "XK",
        "CI",
        "CH",
        "CO",
        "CN",
        "CM",
        "CL",
        "CC",
        "CA",
        "CG",
        "CF",
        "CD",
        "CZ",
        "CY",
        "CX",
        "CR",
        "CW",
        "CV",
        "CU",
        "SZ",
        "SY",
        "SX",
        "KG",
        "KE",
        "SS",
        "SR",
        "KI",
        "KH",
        "KN",
        "KM",
        "ST",
        "SK",
        "KR",
        "SI",
        "KP",
        "KW",
        "SN",
        "SM",
        "SL",
        "SC",
        "KZ",
        "KY",
        "SG",
        "SE",
        "SD",
        "DO",
        "DM",
        "DJ",
        "DK",
        "VG",
        "DE",
        "YE",
        "DZ",
        "US",
        "UY",
        "YT",
        "UM",
        "LB",
        "LC",
        "LA",
        "TV",
        "TW",
        "TT",
        "TR",
        "LK",
        "LI",
        "LV",
        "TO",
        "LT",
        "LU",
        "LR",
        "LS",
        "TH",
        "TF",
        "TG",
        "TD",
        "TC",
        "LY",
        "VA",
        "VC",
        "AE",
        "AD",
        "AG",
        "AF",
        "AI",
        "VI",
        "IS",
        "IR",
        "AM",
        "AL",
        "AO",
        "AQ",
        "AS",
        "AR",
        "AU",
        "AT",
        "AW",
        "IN",
        "AX",
        "AZ",
        "IE",
        "ID",
        "UA",
        "QA",
        "MZ"
    ]

    var chart;
    var layer = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0",
        outFields: ["*"],
        popupEnabled: true,
        visible: true,
        title: "AA",
        opacity: 1,
        renderer: {
            type: "simple",
            symbol: {
                type: "polygon-3d",  // autocasts as new PolygonSymbol3D()
                symbolLayers: [
                    {
                        type: "fill",
                        material: {
                            color: "#9FA5AB",
                        },
                        outline: {
                            color: "#3D4C57",
                            size: "1pt",
                        }
                    }
                ]
            },
        }

    })

    var expression = country_codes.toString().replace(/,/g, ' OR ')

    var layerCities = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Cities/FeatureServer/0",
        outFields: ["*"],
        popupEnabled: true,
        visible: true,
        title: "Cities",
        // opacity: 0,


    })

    var worldCountriesExtruded = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Countries_(Generalized)/FeatureServer/0",
        elevationInfo: {
            mode: "relative-to-ground",
            offset: -80000,
        },
        renderer: {
            type: "simple",
            symbol: {
                type: "polygon-3d",
                symbolLayers: [
                    {
                        type: "extrude",
                        size: 75000,
                        material: { color: "#3D4C57" },
                    }
                ]
            },
        }
    });


    var map = new Map({
        ground: {
            opacity: 0.5,
            surfaceColor: "#3D4C57",
        },
        // basemap: "streets-night-vector",
        layers: [layer, layerCities, worldCountriesExtruded]
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
        // alphaCompositingEnabled: true,
        environment: {
            starsEnabled: true,
            atmosphereEnabled: true
        },
        // center: [15, 65] // longitude, latitude
        center: [-4.38, 27.131] // longitude, latitude

    });

    // view.when(function () {
    //     const handle = scheduling.addFrameTask({
    //         update: function () {
    //             if (!view.interacting) {
    //                 const camera = view.camera.clone();
    //                 camera.position.longitude -= 0.25;
    //                 view.camera = camera;
    //             } else {
    //                 handle.remove();
    //             }
    //         }
    //     });
    //     this.handle = handle

    // })

    // view.on("click", function () {
    //     handle.remove();
    // });

    view.popup.set("dockOptions", {
        breakpoint: false,
        buttonEnabled: false,
        position: "bottom-center"
    });

    var _charts = document.getElementById('generalChart')

    var hitTest = promiseUtils.debounce(function (event) {
        return view.hitTest(event).then(function (hit) {
            var results = hit.results.filter(function (result) {
                return result.graphic.layer === layer;

            });

            var results2 = hit.results.filter(function (result) {
                return result.graphic.layer === layerCities;
            });


            if (!results.length && !results2.length) {
                return null;
            }

            if (results2.length > 0) {
                return {
                    graphic: results2[0].graphic,
                    screenPoint: hit.screenPoint,
                    type: "apple"
                }
            }

            if (results.length > 0) {
                return {
                    graphic: results[0].graphic,
                    screenPoint: hit.screenPoint
                }
            }

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

                var n_data = array.filter(this.subregions, function (item) {
                    return item.name == regionSelected
                })

                n_data[0].dates.unshift('Fecha')
                n_data[0].retail_recreation.unshift('Retail')
                n_data[0].grocery_pharmacy.unshift('Pharmacy')
                n_data[0].parks.unshift('Parks')

                this.option.dataset.source = [
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

    esriRequest("https://localhost:3344/webappbuilder/apps/data_google/apple_data.json", {
        responseType: "json"
    }).then(function (response) {
        this.cities = response.data
    })


    view.whenLayerView(layer).then(lang.hitch(this, function (layerview) {
        var highlight;

        view.on("click", function (evt) {

            // this.handle.remove();

            return hitTest(evt).then(
                function (hit) {
                    if (highlight) {
                        highlight.remove();
                        highlight = null;
                    }
                    if (hit) {
                        // Si es una ciudad
                        if (hit.type && hit.type == "apple") {

                            if (chart != undefined) {
                                chart.data.datasets[0].data = [];
                                chart.data.datasets[1].data = [];
                                chart.data.datasets[2].data = [];

                                chart.update();
                            }

                            var city = array.filter(this.cities, function (item) {
                                return item.region == hit.graphic.attributes.CITY_NAME
                            });

                            var dates = Object.keys(city[0])
                            dates.splice(0, 3)
                            var drivingValues = Object.values(city[0])
                            drivingValues.splice(0, 3)
                            var transitValues = Object.values(city[1])
                            transitValues.splice(0, 3)
                            var walkingValues = Object.values(city[2])
                            walkingValues.splice(0, 3)

                            for (i = 0; i < drivingValues.length; i++) {
                                drivingValues[i] = (parseFloat(drivingValues[i]) - 100).toFixed(0)
                                transitValues[i] = (parseFloat(transitValues[i]) - 100).toFixed(0)
                                walkingValues[i] = (parseFloat(walkingValues[i]) - 100).toFixed(0)
                            }

                            var _config = {
                                type: 'line',
                                data: {
                                    labels: dates,
                                    datasets: [{
                                        label: 'Driving',
                                        fill: false,
                                        backgroundColor: "#FE2E55",
                                        borderColor: "#FE2E55",
                                        data: drivingValues
                                    },
                                    {
                                        label: 'Transit',
                                        backgroundColor: "#AF50DE",
                                        borderColor: "#AF50DE",
                                        data: transitValues,
                                        fill: false,
                                    },
                                    {
                                        label: 'Walking',
                                        backgroundColor: "#FE9403",
                                        borderColor: "#FE9403",
                                        data: walkingValues,
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
                                                labelString: '% Mobility Trends'
                                            }
                                        }]
                                    }
                                }
                            }

                            document.getElementById('generalChart').style.display = "none";
                            document.getElementById('regions_').style.display = "none";
                            document.getElementById('dataRegionsChart').style.display = "block";
                            document.getElementById('name-city').innerText = hit.graphic.attributes.CITY_NAME + "  (city)";
                            chart = new Chart(document.getElementById('chart-city').getContext("2d"), _config);

                        }
                        // Si es un país
                        else {
                            var graphic = hit.graphic;
                            name = hit.graphic.attributes.COUNTRY
                            var screenPoint = hit.screenPoint;

                            document.getElementById("country").innerText = name + "  (country)";

                            highlight = layerview.highlight(graphic)

                            var iso_code = hit.graphic.attributes.AFF_ISO;
                            var url = "https://mundogister.github.io/covid19-google-apple-data/data/" + iso_code + "/data.json"

                            esriRequest(url, {
                                responseType: "json"
                            }).then(function (response) {
                                if (chart != undefined) {
                                    chart.data.datasets[0].data = [];
                                    chart.data.datasets[1].data = [];
                                    chart.data.datasets[2].data = [];

                                    chart.update();
                                }

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
                                                    labelString: '% Mobility Trends'
                                                }
                                            }]
                                        }
                                    }
                                }

                                document.getElementById('generalChart').style.display = "block";
                                document.getElementById('regions_').style.display = "block";
                                document.getElementById('dataRegionsChart').style.display = "none"

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
                                    _info.nameRegion = arraySubRegionsTable[0].name + "  (region)"

                                    arraySubRegionsTable[0].dates.unshift("Fecha")
                                    arraySubRegionsTable[0].retail_recreation.unshift("Retail")
                                    arraySubRegionsTable[0].grocery_pharmacy.unshift('Pharmacy')
                                    arraySubRegionsTable[0].parks.unshift('Parks')

                                    var dom = document.getElementById('regionsChart');
                                    var myChart = echarts.init(dom);
                                    option = {
                                        legend: {
                                            textStyle: {
                                                fontFamiliy: "sans-serif"
                                            }
                                        },
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
                                                    formatter: '{b}: {d}'
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

                                    document.getElementById('selectRegions').selectedIndex = 0;
                                    _info.myChart = myChart;
                                    _info.option = option;



                                    // _info.subregions = arraySubRegionsTable;
                                }
                                else {
                                    if (_info.myChart) {
                                        _info.myChart = null;
                                    }
                                    if (_info.option) {
                                        _info.option = null;
                                    }
                                    if (_info.subregions) {
                                        _info.subregions = null;
                                        _info.subregions = [];
                                    }
                                    if (_info.nameRegion) {
                                        _info.nameRegion = "";
                                    }

                                }
                            })
                        }
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