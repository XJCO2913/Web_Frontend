// 坐标集
var lineArr = [
    [116.81333,23.48132],
    [116.81333,23.48132],
    [116.81333,23.48132],
    [116.81352,23.48133],
    [116.81353,23.48124],
    ...
];

// 坐标总数，起终点坐标
var count = lineArr.length;
var first = lineArr[0];
var last = lineArr[count - 1];

// 构造地图对象
var map = new AMap.Map('map');

// 跑步路线折线
var polyline = new AMap.Polyline({
    map: map,
    path: lineArr,
    lineJoin: 'round',
    strokeColor: "#52EE06",
    strokeOpacity: 1,
    strokeWeight: 3,
    strokeStyle: "solid"
});
// 地图自适应
map.setFitView(); 

// 起点
new AMap.Marker({
    map: map,
    position: first,
    zIndex: 11,
    offset: new AMap.Pixel(-8, -8),
    content: '<div class="marker-circle green"></div>'
});

// 终点
new AMap.Marker({
    map: map,
    position: last,
    zIndex: 11,
    offset: new AMap.Pixel(-8, -8),
    content: '<div class="marker-circle red"></div>'
});

// 距离
var distance = new AMap.Marker({
    map: map,
    position: last,
    zIndex: 10,
    offset: new AMap.Pixel(-64, -12),
    // 采用 Polyline 类的 getLength() 方法直接获取折线长度
    content: '<div class="running-distance"><span class="running-number">' + (polyline.getLength()/1000).toFixed(1) + '</span>公里</div>'
});

// 变化的折线
var runPolyline = new AMap.Polyline({
    map: map,
    lineJoin: 'round',
    strokeColor: "#52EE06",
    strokeOpacity: 1,
    strokeWeight: 3,
    strokeStyle: "solid",
});

// 移动的点标记
var current = new AMap.Marker({
    map: map,
    zIndex: 12,
    visible: false,
    offset: new AMap.Pixel(-8, -8),
    content: '<div class="marker-circle black"></div>'
});

// 点击地图事件
map.on('click', function() {
    // 将上面上面折线改为黑色透明作为底层
    polyline.setOptions({
        strokeColor: '#000000',
        strokeOpacity: 0.2
    });
    // 显示画线点标记
    current.show();
    i = 0;
    drawline();
});

// 画线动画
function drawline() {
    if ( i < count ) {
        current.setPosition(lineArr[i]);
        runPolyline.setPath(lineArr.slice(0, i+1));
        distance.setContent('<div class="running-distance"><span class="running-number">' + (runPolyline.getLength()/1000).toFixed(1) + '</span>公里</div>');
        i++;
    } else {
        current.hide();
        return;
    }
    setTimeout(drawline, 40)
}

// 画线动画
function drawline(step) {
    if (i < count / step) {
        var start = i * step;
        var end = (i + 1) * step >= count ? count - 1 : (i + 1) * step;
        current.setPosition(lineArr[end]);
        runPolyline.setPath(lineArr.slice(0, end+1));
        distance.setContent('<div class="running-distance"><span class="running-number">' + (runPolyline.getLength()/1000).toFixed(1) + '</span>公里</div>');
        i++;
    } else {
        current.hide();
        return;
    }
    setTimeout(function(){
        drawline(step);
    }, 40)
}

var running = false;
var i = 0;
// 点击地图事件
map.on('click', function() {
    // 将上面上面折线改为黑色透明作为底层
    polyline.setOptions({
        strokeColor: '#000000',
        strokeOpacity: 0.2
    });
    // 显示画线点标记
    current.show();
    running = running == false ? true : false;
    // 动画运行总时间约五秒
    var step = parseInt(count/50);
    step = step == 0 ? 1 : step;
    drawline(step);
});

// 画线动画
function drawline(step) {
    if ( i < count / step ) {
        if( running == true ){
            var start = i * step;
            var end = (i + 1) * step >= count ? count - 1 : (i + 1) * step;
            current.setPosition(lineArr[end]);
            runPolyline.setPath(lineArr.slice(0, end+1));
            distance.setContent('<div class="running-distance"><span class="running-number">' + (runPolyline.getLength()/1000).toFixed(1) + '</span>公里</div>');
            i++;
        } else {
            return;
        }
    } else{
        current.hide();
        i = 0;
        running = false;
        return;
    }
    setTimeout(function(){
        drawline(step);
    }, 40)
}

import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

function Map({ isTracking }) { // 正确地通过解构来获取isTracking
    const mapRef = useRef(null);

    useEffect(() => {
        let watchId;
        let polyline;

        AMapLoader.load({
            key: "e65a2fad806f1efcbe741afff844c30b",
            version: "2.0",
            plugins: ["AMap.Geolocation", "AMap.Scale"],
        }).then(AMap => {
            const map = new AMap.Map('container', {
                zoom: 16,
                mapStyle: "amap://styles/normal",
            });
            mapRef.current = map; // 保存地图实例以供后续使用

            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 10000,
                position: 'RB',
                zoomToAccuracy: true,
            });

            map.addControl(geolocation);
            geolocation.getCurrentPosition((status, result) => {
                if (status === 'complete') {
                    map.setCenter(result.position);
                } else {
                    console.error('定位失败', result.message);
                }
            });

            // 如果isTracking为true，开始跟踪
            if (isTracking) {
                const path = []; // 用于存储用户的运动轨迹
                
                watchId = navigator.geolocation.watchPosition(position => {
                    const { latitude, longitude } = position.coords;
                    path.push([longitude, latitude]);
                    
                    if (mapRef.current) {
                        mapRef.current.setCenter([longitude, latitude]);

                        if (!polyline) {
                            polyline = new AMap.Polyline({
                                path: path,
                                strokeColor: "#00A76F",
                                strokeOpacity: 1,
                                strokeWeight: 3,
                                strokeStyle: "solid",
                            });
                            mapRef.current.add(polyline);
                        } else {
                            polyline.setPath(path);
                        }
                    }
                }, (error) => console.error(error), {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000,
                });
            }
        }).catch(e => {
            console.log(e);
        });

        // 清理函数
        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
            // 如果需要，也可以在这里清理polyline
        };
    }, [isTracking]); // 依赖于isTracking，当isTracking变化时重新执行

    return <div id="container" style={{ width: '100%', height: '100%' }}></div>;
}

export default React.memo(Map);


Map.propTypes = {
   
    isTracking: PropTypes.bool,

};