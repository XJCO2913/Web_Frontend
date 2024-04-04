import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

function Map({ isTracking }) {
    const mapRef = useRef(null);
    const AMapRef = useRef(null);
    const lastPositionRef = useRef(null);
    const polylineRef = useRef(null);
    const userLocationCircleRef = useRef(null);

    // 地图初始化
    useEffect(() => {
        if (!mapRef.current) {
            AMapLoader.load({
                key: "e65a2fad806f1efcbe741afff844c30b",
                version: "2.0",
                plugins: ["AMap.Geolocation", "AMap.Scale"],
            }).then(AMap => {
                AMapRef.current = AMap;
                initMap(AMap);
            }).catch(e => {
                console.log(e);
            });
        }
    }, []);

    // 实时获取用户位置
    useEffect(() => {
        const updatePosition = () => {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                lastPositionRef.current = [longitude, latitude];
                console.log("User position:", longitude, latitude);
                if (userLocationCircleRef.current) {
                    userLocationCircleRef.current.setCenter(new AMapRef.current.LngLat(longitude, latitude));
                }
                if (isTracking) {
                    drawPath();
                }
            }, (error) => {
                console.error('Fail to get location', error);
            }, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000,
            });
        };

        const intervalId = setInterval(updatePosition, 2000); // 每2秒更新一次位置

        return () => clearInterval(intervalId);
    }, [isTracking]);

    const initMap = (AMap) => {
        const map = new AMap.Map('container', {
            zoom: 16,
            mapStyle: "amap://styles/normal",
        });

        AMap.plugin(["AMap.Geolocation", "AMap.Scale"], () => {
            const geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 10000,
                zoomToAccuracy: true,
            });
            map.addControl(geolocation);

            geolocation.getCurrentPosition((status, result) => {
                if (status === 'complete') {
                    map.setCenter(result.position);
                    lastPositionRef.current = [result.position.lng, result.position.lat];
                } else {
                    console.error('Fail to locate', result.message);
                }
            });
        });
        userLocationCircleRef.current = new AMap.Circle({
            map: map,
            center: map.getCenter(), 
            radius: 100, 
            strokeColor: 'red',
            strokeOpacity: 0.9,
            strokeWeight: 6,
            fillColor: 'red',
            fillOpacity: 0.35,
        });
        mapRef.current = map;
    };

    const drawPath = () => {
        if (!mapRef.current || !AMapRef.current || !lastPositionRef.current) return;

        const path = polylineRef.current ? polylineRef.current.getPath() : [];
        path.push(lastPositionRef.current);

        if (polylineRef.current) {
            polylineRef.current.setPath(path);
        } else {
            polylineRef.current = new AMapRef.current.Polyline({
                path: path,
                strokeColor: "#00A76F",
                strokeWeight: 5,
                strokeOpacity: 1,
            });
            mapRef.current.add(polylineRef.current);
        }
    };

    return <div id="container" style={{ width: '100%', height: '100%' }}></div>;
}

Map.propTypes = {
    isTracking: PropTypes.bool,
};

export default React.memo(Map);
