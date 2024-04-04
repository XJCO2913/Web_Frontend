import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

function Map({ isTracking }) {
    const mapRef = useRef(null);
    const AMapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) {
            AMapLoader.load({
                key: "e65a2fad806f1efcbe741afff844c30b",
                version: "2.0",
                plugins: ["AMap.Geolocation", "AMap.Scale"],
            }).then(AMap => {
                AMapRef.current = AMap
                initMap(AMap);
            }).catch(e => {
                console.log(e);
            });
        }
    }, []);

    useEffect(() => {
        if (mapRef.current && AMapRef.current && isTracking) {
            const path = [];
            let polyline = null;

            const drawPath = () => {
                if (polyline) {
                    mapRef.current.remove(polyline);
                }
                polyline = new AMapRef.current.Polyline({
                    path: path,
                    strokeColor: "#FF33FF",
                    strokeWeight: 5,
                    strokeOpacity: 1,
                });
                mapRef.current.add(polyline);
            };

            const updatePosition = () => {
                navigator.geolocation.getCurrentPosition(position => {
                    const { latitude, longitude } = position.coords;
                    console.log("经度:", longitude, "纬度:", latitude);
                    path.push([longitude, latitude]);
                    drawPath();
                }, (error) => {
                    console.error('Fail to get location', error);
                }, {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000,
                });
            };

            // 每两秒调用一次updatePosition
            const intervalId = setInterval(updatePosition, 2000);

            // 组件卸载时清理
            return () => {
                mapRef.current.remove(polyline);
                clearInterval(intervalId)
            };

        }
    }, [isTracking]);

    const initMap = (AMap) => {
        const map = new AMap.Map('container', {
            zoom: 16,
            mapStyle: "amap://styles/normal",
        });

        AMap.plugin(["AMap.Geolocation", "AMap.Scale"], function () {
            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 10000,
                position: 'RB',
                zoomToAccuracy: true,
            });
            var scale = new AMap.Scale();

            map.addControl(geolocation);
            map.addControl(scale);

            geolocation.getCurrentPosition((status, result) => {
                if (status === 'complete') {
                    map.setCenter(result.position);
                } else {
                    console.error('定位失败', result.message);
                }
            });
        });
        mapRef.current = map;
    };

    return <div id="container" style={{ width: '100%', height: '100%' }}></div>;
}

Map.propTypes = {

    isTracking: PropTypes.bool,

};

export default React.memo(Map);