import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AMapLoader from '@amap/amap-jsapi-loader';

import { useAuthContext } from 'src/auth/hooks';
import UserIcon from './user-icon';
import { wgs2gcj } from './utils';

// ----------------------------------------------------------------------

function Map({ isTracking }) {
    const mapRef = useRef(null);
    const { user } = useAuthContext();

    useEffect(() => {
        AMapLoader.load({
            key: "your-api-key",
            version: "2.0",
            plugins: ["AMap.Geolocation", "AMap.Scale"],
        }).then((AMap) => {
            const map = new AMap.Map("container", {
                zoom: 20,
                center: [103.984199, 30.763503],
                mapStyle: "amap://styles/normal",
            });
            mapRef.current = map;

            const geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 10000,
                buttonPosition: 'RB',
                zoomToAccuracy: true,
                showMarker: true,
                showCircle: false
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition((status, result) => handlePosition(status, result, map));

            const locationMarker = new AMap.Marker({
                position: map.getCenter(), 
                map: map,
                content: <UserIcon avatarUrl={user?.avatarUrl} />
            });

            function handlePosition(status, result, map) {
                if (status === 'complete') {
                    const [lng, lat] = wgs2gcj(result.position.lat, result.position.lng);
                    const newCenter = new AMap.LngLat(lng, lat);
                    map.setCenter(newCenter);
                    locationMarker.setPosition(newCenter);
                }
            }
        }).catch(e => {
            console.error(e);
        });

        return () => {
            mapRef.current?.destroy();
        };
    }, [user]);

    return <div id="container" style={{ width: '100%', height: '100%' }}></div>;
}

Map.propTypes = {
    isTracking: PropTypes.bool,
};

export default React.memo(Map);
