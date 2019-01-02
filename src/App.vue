<template>
  <div id="app">
    <div class="title">
        地图组件示例
    </div>

    <ul class="opertion-btn-box">
        <li @click="initMap">创建地图</li>
        <li @click="autoComplete">创建搜索提示</li>
        <li @click="addControl">添加控件</li>
        <li @click="initMarker">创建标记</li>
        <li @click="deleteMarker">删除标记</li>
        <li @click="addLabel">添加文本</li>
        <li @click="deleteLabel">删除文本</li>
        <li @click="addPointCollection">添加海量点</li>
        <li @click="deletePointCollection">删除海量点</li>
        <li @click="centerAndZoom">设置地图中心点和缩放级别</li>
        <li @click="getViewport">以最佳视野展示</li>
        <li @click="addPolygon">创建多边形</li>
        <li @click="drawingPolygon">绘制多边形</li>
        <li @click="deletePolygon">删除多边形</li>
        <li @click="setSearchType('getLngLatByAddress')">根据地址查询经纬度</li>
        <li @click="setSearchType('localSearch')">关键字搜索</li>
    </ul>

    <div class="contanier">
        <div class="search-box" v-if="searchType">
            <span>{{searchTypeText}}：</span>
            <input id="map-suggest" placeholder="请输入关键字" v-model="inputText"/>
            <span class="search-btn" @click="search">搜索</span>
        </div>

        <div id="map">
            
        </div>

        <div id="search-result">

        </div>
    </div>
  </div>
</template>

<script>
import mapAssistant from 'map-assistant'

export default {
    name: 'App',
    data() {
        return {
            searchTypeText: '',
            searchType: '',
            inputText: '',
            map: '',
            marker: {},
            label: {},
            pointCollection: {},
            polygon: {},
            pathArr: [],
            triangleCoords: [{
                lng: 116.423816,
                lat: 39.935297
            }, {
                lng: 116.449687,
                lat: 39.926445
            }, {
                lng: 116.425541,
                lat: 39.895895
            }, {
                lng: 116.388746,
                lat: 39.895895
            }, {
                lng: 116.373798,
                lat: 39.918919
            }],
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        // 创建地图
        initMap() {
            if (!this.map) {
                var map = mapAssistant.initMap({
                    lng: 116.4035,
                    lat: 39.915, 
                    zoom: 8, 
                    mapId: 'map'
                })
                this.map = map
            }
        },
        // 创建搜索提示
        autoComplete() {
            this.searchType = 'autoComplete'
            this.searchTypeText = '搜索提示'

            this.initMap()
            mapAssistant.autoComplete(this.map, {
                city: '北京市',
                inputId: 'map-suggest',
                addressText: this.inputText,
                callback: (obj) => {
                    this.inputText = obj.searchValue
                    console.log('地图搜索：', obj)
                },
            })
        },
        // 添加控件
        addControl() {
            this.initMap()
            mapAssistant.addControl(this.map, {
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: true
            })
        },
        // 创建标记
        initMarker() {
            this.initMap()
            var marker = mapAssistant.initMarker(this.map, {
                lng: 116.4035,
                lat: 39.915
            })
            this.marker = marker
        },
        // 删除标记
        deleteMarker() {
            this.initMap()
            mapAssistant.deletePolygon(this.map, {
                polygon: this.marker
            })
        },
        // 添加文本
        addLabel() {
            this.initMap()
            var label = mapAssistant.addLabel(this.map, {
                lng: 116.4035,
                lat: 39.915,
                labelText: '显示的文本内容'
            })
            this.label = label
        },
        // 删除文本
        deleteLabel() {
            this.initMap()
            mapAssistant.deletePolygon(this.map, {
                polygon: this.label
            })
        },
        // 添加海量点
        addPointCollection() {
            this.initMap()
            var pointCollection = mapAssistant.addPointCollection(this.map, {
                triangleCoords: this.triangleCoords,
                color: 'red'
            })
            this.pointCollection = pointCollection
        },
        // 删除海量点
        deletePointCollection () {
            this.initMap()
            mapAssistant.deletePolygon(this.map, {
                polygon: this.pointCollection
            })
        },
        // 设置地图中心点和缩放级别
        centerAndZoom() {
            this.initMap()
            mapAssistant.centerAndZoom(this.map, {
                lng: 116.423816,
                lat: 39.935297, 
                zoom: 12
            })
        },
        // 以最佳视野展示
        getViewport() {
            this.initMap()
            mapAssistant.getViewport(this.map, {
                triangleCoords: this.triangleCoords
            })
        },
        // 绘制多边形
        drawingPolygon() {
            this.initMap()
            this.deletePolygon()
            var polygon =  mapAssistant.drawingPolygon(this.map, {
                triangleCoords: this.triangleCoords,
                editable: true
            })
            this.polygon = polygon
            this.getPath()
        },
        // 添加多边形
        addPolygon() {
            this.initMap()
            mapAssistant.addPolygon(this.map, {
                callback: (polygon) => {
                    this.deletePolygon()
                    this.polygon = polygon
                    this.getPath()
                }
            })
        },
        // 删除地图多边形
        deletePolygon() {
            this.initMap()
            mapAssistant.deletePolygon(this.map, {
                polygon: this.polygon
            })
        },
        // 获取地图多边形的点数组
        getPath() {
            this.initMap()
            var pathArr = mapAssistant.getPath(this.map, {
                polygon: this.polygon
            })
            this.pathArr = pathArr
            console.log('地图多边形的点数组：', pathArr)
        },
        setSearchType(type) {
            this.searchType = type
            this.searchTypeText = type == 'getLngLatByAddress' ? '根据地址查询经纬度' : '关键字搜索'

        },
        search() {
            this.searchType == 'getLngLatByAddress' ? this.getLngLatByAddress() : this.localSearch()
        },
        // 根据地址查询经纬度
        getLngLatByAddress() {
            this.initMap()
            mapAssistant.getLngLatByAddress(this.map, {
                address: this.inputText || '天安门',
                callback: (obj) => {
                    console.log(this.inputText + '经纬度：', obj)
                }
            })
        },
        // 关键字搜索
        localSearch() {
            this.initMap()
            mapAssistant.localSearch(this.map, {
                city: '北京市',
                address: this.inputText || '天安门',
                searchResultId: 'search-result',
                callback: (obj) => {
                    console.log('地图搜索' + this.inputText + '第一个结果：', obj)
                }
            })
        }
    }
}
</script>

<style lang="less">

*{
    margin: 0;
    padding: 0;
}

html, body {
    height: 100%;
}

input {
    outline:none;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;

    .title {
        width: 100%;
        height: 100px;
        line-height: 100px;
        color: #ffffff;
        background: #000000;
        font-size: 40px;
        text-align: left;
        padding-left: 20px;
        box-sizing: border-box;
        position: fixed;
        top: 0;
        z-index: 9;
    }

    .opertion-btn-box {
        width: 220px;
        height: 100%;
        text-align: left;
        color: #ffffff;
        background: #494949;
        list-style: none;
        overflow-y: scroll;
        float: left;
        padding-top: 120px;
        box-sizing: border-box;

        li {
            cursor: pointer;
            padding: 0 20px 20px 20px;
        }
    }

    .contanier {
        padding-top: 100px;
        float: left;

        .search-box {
            margin: 15px 20px -5px 20px;
            text-align: left;

            #map-suggest {
                width: 200px;
                height: 30px;
                padding: 0 4px;
                font-size: 14px;
            }

            .search-btn {
                padding: 6px 10px 4px 10px;
                border: 1px solid #c8c8c8;
                background: #eaeaea;
                border-radius: 6px;
                margin-left: 10px;
            }
        }

        

        #map {
            width: 580px;
            height: 610px;
            margin: 20px 0 0 20px;
            float: left;
        }

        #search-result {
            width: 580px;
            height: 610px;
            overflow-y: auto;
            margin: 20px 0 0 20px;
            float: left;
        }
    }
}

</style>
