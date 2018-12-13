<template>
  <div id="app">
    <div class="opertion-btn-box">
        <div class="desc">*请先创建地图，再进行其他操作*</div>
        地图搜索：<input id="map-suggest" placeholder="请输入关键字" v-model="inputText"/>
        <div class="line">
            <span @click="initMap">创建地图</span>
            <span @click="autoComplete">创建搜索提示</span>
            <span @click="addControl">添加控件</span>
            <span @click="initMarker">创建标记</span>
            <span @click="deleteMarker">删除标记</span>
            <span @click="addLabel">添加文本</span>
            <span @click="deleteLabel">删除文本</span>
            <span @click="addPointCollection">添加海量点</span>
            <span @click="deletePointCollection">删除海量点</span>
        </div>
        <div class="line">
            <span @click="centerAndZoom">设置地图中心点和缩放级别</span>
            <span @click="getViewport">以最佳视野展示</span>
            <span @click="addPolygon">创建多边形</span>
            <span @click="drawingPolygon">绘制多边形</span>
            <span @click="deletePolygon">删除多边形</span>
            <span @click="getLngLatByAddress">根据地址查询经纬度</span>
            <span @click="localSearch">关键字搜索</span>
        </div>
    </div>
    <div id="map">
        
    </div>

    <div id="search-result">

    </div>
  </div>
</template>

<script>
import mapAssistant from 'map-assistant'

export default {
    name: 'App',
    data() {
        return {
            inputText: '',
            map: {},
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
            var map = mapAssistant.initMap({
                lng: 116.4035,
                lat: 39.915, 
                zoom: 8, 
                mapId: 'map'
            })
            this.map = map
        },
        // 创建搜索提示
        autoComplete() {
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
            mapAssistant.addControl(this.map, {
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: true
            })
        },
        // 创建标记
        initMarker() {
            var marker = mapAssistant.initMarker(this.map, {
                lng: 116.4035,
                lat: 39.915
            })
            this.marker = marker
        },
        // 删除标记
        deleteMarker() {
            mapAssistant.deletePolygon(this.map, {
                polygon: this.marker
            })
        },
        // 添加文本
        addLabel() {
            var label = mapAssistant.addLabel(this.map, {
                lng: 116.4035,
                lat: 39.915,
                labelText: '显示的文本内容'
            })
            this.label = label
        },
        // 删除文本
        deleteLabel() {
            mapAssistant.deletePolygon(this.map, {
                polygon: this.label
            })
        },
        // 添加海量点
        addPointCollection() {
            var pointCollection = mapAssistant.addPointCollection(this.map, {
                triangleCoords: this.triangleCoords,
                color: 'red'
            })
            this.pointCollection = pointCollection
        },
        // 删除海量点
        deletePointCollection () {
            mapAssistant.deletePolygon(this.map, {
                polygon: this.pointCollection
            })
        },
        // 设置地图中心点和缩放级别
        centerAndZoom() {
            mapAssistant.centerAndZoom(this.map, {
                lng: 116.423816,
                lat: 39.935297, 
                zoom: 12
            })
        },
        // 以最佳视野展示
        getViewport() {
            mapAssistant.getViewport(this.map, {
                triangleCoords: this.triangleCoords
            })
        },
        // 绘制多边形
        drawingPolygon() {
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
            mapAssistant.addPolygon(this.map, {
                callback: (polygon) => {
                    this.deletePolygon()
                    this.polygon = polygon
                    this.getPath()
                }
            })
        },
        // 删除百度地图多边形
        deletePolygon() {
            mapAssistant.deletePolygon(this.map, {
                polygon: this.polygon
            })
        },
        // 获取百度地图多边形的点数组
        getPath() {
            var pathArr = mapAssistant.getPath(this.map, {
                polygon: this.polygon
            })
            this.pathArr = pathArr
            console.log('地图多边形的点数组：', pathArr)
        },
        // 根据地址查询经纬度
        getLngLatByAddress() {
            mapAssistant.getLngLatByAddress(this.map, {
                address: '天安门',
                callback: (obj) => {
                    console.log('地图天安门经纬度：', obj)
                }
            })
        },
        // 关键字搜索
        localSearch() {
            mapAssistant.localSearch(this.map, {
                address: '天安门',
                searchResultId: 'search-result',
                callback: (obj) => {
                    console.log('地图搜索天安门第一个结果：', obj)
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

input {
    outline:none;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 20px;

    .opertion-btn-box {
        text-align: left;
        padding-left: 20px;

        .desc {
            color: #ff2d4b;
        }

        #map-suggest {
            width: 200px;
            height: 20px;
            padding: 0 4px;
            margin-top: 10px;
        }

        .line {
            margin-top: 15px;
        }

        span {
            padding: 5px 10px;
            border: 1px solid #a5a5a5;
            border-radius: 10px;
            cursor: pointer;
            background: #eaeaea;
            color: #333333;
            margin-right: 10px;
            display: inline-block;
        }
    }

    #map {
        width: 500px;
        height: 400px;
        float: left;
        margin: 20px 0 0 20px;
    }

    #search-result {
      width: 300px;
      height: 400px;
      overflow-y: auto;
      margin-top: 20px;
    }
}

</style>
