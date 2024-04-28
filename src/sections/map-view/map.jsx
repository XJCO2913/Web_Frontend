import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AMapLoader from '@amap/amap-jsapi-loader';

import { wgs2gcj } from './utils';
import { useAuthContext } from '@/auth/hooks';

function Map({ isTracking }) {
    const mapRef = useRef(null);
    const positionHistoryRef = useRef([]);
    const markerRef = useRef(null);
    const polylineRef = useRef(null);
    const geoLocationRef = useRef(null);
    const { user } = useAuthContext();

    const getIconHTML = (avatarUrl) => `
        <div style="
        width: 30px; 
        height: 30px; 
        border-radius: 50%; 
        background-color: white; 
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid #00A76F;
        overflow: hidden;">
            <img src="${avatarUrl}" alt="User Icon" style="
                width: 30px; 
                height: 30px;
                border-radius: 50%;  
                object-fit: cover;
                pointer-events: none;"/>
        </div>`;

    useEffect(() => {
        AMapLoader.load({
            key: "e65a2fad806f1efcbe741afff844c30b",
            version: "2.0",
            plugins: ["AMap.Geolocation", "AMap.Scale", "AMap.Polyline"],
        }).then((AMap) => {
            const map = new AMap.Map("container", {
                zoom: 20,
                center: [103.984199, 30.763503],
                mapStyle: "amap://styles/normal",
            });
            mapRef.current = map;

            const geoMarker = new AMap.Marker({
                position: map.getCenter(),
                map: map,
                content: getIconHTML(user?.avatarUrl)
            });
            markerRef.current = geoMarker;

            const geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 10000,
                buttonPosition: 'RB',
                zoomToAccuracy: true,
                showMarker: false,
                showCircle: false
            });
            map.addControl(geolocation);
            geoLocationRef.current = geolocation;

            const polyline = new AMap.Polyline({
                path: [],
                strokeColor: '#00A76F',
                strokeOpacity: 1,
                strokeWeight: 3,
                map: map,
            });
            polylineRef.current = polyline;

            geolocation.getCurrentPosition((status, result) => {
                if (status === 'complete') {
                    const { lat, lng } = wgs2gcj(result.position.getLat(), result.position.getLng());
                    const newCenter = new AMap.LngLat(lng, lat);
                    map.setCenter(newCenter);
                    geoMarker.setPosition(newCenter);
                }
            });

            const updatePosition = (data) => {
                console.log(data.location_type)
                const { position } = data;
                const convertedPosition = wgs2gcj(position.lat, position.lng);
                const newPos = new AMap.LngLat(convertedPosition.lng, convertedPosition.lat);
                positionHistoryRef.current.push(newPos);
                polylineRef.current.setPath(positionHistoryRef.current);
                markerRef.current.setPosition(newPos);
            };

            if (isTracking && geoLocationRef.current) {
                navigator.geolocation.watchPosition((pos)=>{
                    console.log("watch position")
                    console.log(positionHistoryRef.current)
                    const crd = pos.coords
                    const convertedPosition = wgs2gcj(crd.latitude, crd.longitude)
                    const newPos = new AMap.LngLat(convertedPosition.lng, convertedPosition.lat)

                    positionHistoryRef.current.push(newPos)
                    polylineRef.current.setPath(positionHistoryRef.current)
                    markerRef.current.setPosition(newPos)
                }, (err)=>{
                    console.log("watchPosition error: ", err.toString())
                });
                //geoLocationRef.current.on('complete', updatePosition);
            } else if (geoLocationRef.current) {
                geoLocationRef.current.clearWatch();
                // 可选择在停止跟踪时清除轨迹
                polylineRef.current.setPath([]);
                positionHistoryRef.current = [];
            }

        }).catch(console.error);

        return () => {
            mapRef.current?.destroy();
        };
    }, [user?.avatarUrl, isTracking]);

    // useEffect(() => {
    //     const updatePosition = (data) => {
    //         console.log(data.location_type)
    //         const { position } = data;
    //         const convertedPosition = wgs2gcj(position.lat, position.lng);
    //         const newPos = new AMap.LngLat(convertedPosition.lng, convertedPosition.lat);
    //         positionHistoryRef.current.push(newPos);
    //         polylineRef.current.setPath(positionHistoryRef.current);
    //         markerRef.current.setPosition(newPos);
    //     };

    //     if (isTracking && geoLocationRef.current) {
    //         geoLocationRef.current.watchPosition();
    //         geoLocationRef.current.on('complete', updatePosition);
    //     } else if (geoLocationRef.current) {
    //         geoLocationRef.current.clearWatch();
    //         // 可选择在停止跟踪时清除轨迹
    //         polylineRef.current.setPath([]);
    //         positionHistoryRef.current = [];
    //     }
    // }, [isTracking]);

    return <div id="container" style={{ width: '100%', height: '100%' }}></div>;
}

Map.propTypes = {
    isTracking: PropTypes.bool,
};

export default React.memo(Map);