import React, { useEffect } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

function Map() {
    useEffect(() => {
        window._AMapSecurityConfig = {
            serviceHost: 'http://43.136.232.116/_AMapService',
        };

        AMapLoader.load({
            key: "e65a2fad806f1efcbe741afff844c30b",
            version: "2.0",
            plugins: ["AMap.Geolocation"],
        }).then(AMap => {
            initMap(AMap);
        }).catch(e => {
            console.log(e);
        });
    }, []);

    const initMap = (AMap) => {
        const map = new AMap.Map('container', {
            zoom: 16,
            mapStyle: "amap://styles/normal",
        });

        AMap.plugin(["AMap.Geolocation"], function () {
           

            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                timeout: 10000,          // 超过10秒后停止定位，默认：5s
                position: 'RB',          // 定位按钮的停靠位置
                zoomToAccuracy: true,    // 定位成功后是否自动调整地图视野到定位点
            });
            map.addControl(geolocation);
            
            geolocation.getCurrentPosition((status, result) => {
                if (status === 'complete') {
                    // 定位成功，设置地图中心为用户位置
                    map.setCenter(result.position);
                } else {
                    console.error('定位失败', result.message);
                }
            });
        });
    };

    return <div id="container" style={{ width: '100%', height: '100%' }}></div>;
}

export default React.memo(Map);