import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AMapLoader from '@amap/amap-jsapi-loader';

import { wgs2gcj, gcj2wgs } from './utils';
import { useAuthContext } from '@/auth/hooks';

function Map({ isTracking }) {
    const mapRef = useRef(null);
    const { user } = useAuthContext()

    const iconHTML = `
    <div style="
    width: 30px; 
    height: 30px; 
    border-radius: 50%; 
    background-color: white; 
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #00A76F;  /* 蓝色边框 */
    overflow: hidden;  /* 确保图片超出部分不会显示 */"
    >
    <img src="${user?.avatarUrl}" alt="User Icon" style="
        width: 30px; 
        height: 30px;
        border-radius: 50%;  
        object-fit: cover;
        pointer-events: none;"
    />
   </div>`;

    useEffect(() => {
        AMapLoader.load({
            key: "e65a2fad806f1efcbe741afff844c30b",
            version: "2.0",
            plugins: ["AMap.Geolocation", "AMap.Scale"],
        }).then((AMap) => {
            const map = new AMap.Map("container", {
                zoom: 20,
                center: [103.984199, 30.763503],
                mapStyle: "amap://styles/normal",
            });
            mapRef.current = map;

            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 10000,
                buttonPosition: 'RB',
                zoomToAccuracy: true,
                showMarker: true,
                showCircle: false
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition(function (status, result) {
                if (status === 'complete') {
                    // 使用从GPS设备获取到的坐标进行转换
                    convertFrom([result.position.lng, result.position.lat], 'gps');
                }
            });

            const locationMarker = new AMap.Marker({
                position: map.getCenter(), // 初始位置设为地图中心
                map: map,
                content: iconHTML
            });

            function convertFrom(lnglat) {
                // 使用wgs2gcj进行坐标转换
                const { lat, lng } = wgs2gcj(lnglat[1], lnglat[0]);

                // 转换后的坐标设置为地图中心
                const newCenter = new AMap.LngLat(lng, lat);
                map("container", { zoom: 21 })
                map.setCenter(newCenter);
                locationMarker.setPosition(newCenter);
            }

        }).catch(e => {
            console.log(e);
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.destroy();
                mapRef.current = null;
            }
        };
    }, []);

    return <div id="container" style={{ width: '100%', height: '100%' }}></div>;
}

Map.propTypes = {
    isTracking: PropTypes.bool,
};

export default React.memo(Map);
