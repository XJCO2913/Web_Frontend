import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AMapLoader from '@amap/amap-jsapi-loader';

import { useAuthContext } from '@/auth/hooks';

const AMapPathDrawer = ({ paths, style }) => {
  const mapContainer = useRef(null);
  const { user } = useAuthContext();

  const getIconHTML = (avatarUrl) => `
        <div style="
        width: 35px; 
        height: 35px; 
        border-radius: 50%; 
        background-color: white; 
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid red;
        overflow: hidden;">
            <img src="${avatarUrl}" alt="User Icon" style="
                width: 35px; 
                height: 35px;
                border-radius: 50%;  
                object-fit: cover;
                pointer-events: none;"/>
        </div>`;

  useEffect(() => {
    AMapLoader.load({
      key: "e65a2fad806f1efcbe741afff844c30b",  // 使用你的API密钥
      version: "2.0",            // 使用高德地图JS API的2.0版本
      plugins: []                // 根据需要添加插件
    }).then(AMap => {
      const map = new AMap.Map(mapContainer.current, {
        viewMode: "3D",          // 使用3D视图模式
        zoom: 16,                // 初始缩放级别
        center: paths[0]?.coords[0],         // 使用路径的第一个坐标作为地图中心点
      });

      // 为每条路径创建一个 polyline
      paths.forEach((path, index) => {
        const polyline = new AMap.Polyline({
          path: path.coords,
          strokeColor: path.color,
          strokeOpacity: 1,
          strokeWeight: 3,
          strokeStyle: 'solid',
        });
        polyline.setMap(map);

        // 在添加第二条路径时添加 Marker
        if (index === 1) {
          const geoMarker = new AMap.Marker({
            position: path.coords[0], // 可以选择路径的起点作为 Marker 的位置
            map: map,
            content: getIconHTML(user?.avatarUrl)
          });
        }
      });

    }).catch(e => {
      console.error('Failed to load AMap library:', e);
    });
  }, [paths]);  // 如果路径改变，则重新运行效果

  return <div ref={mapContainer} style={{ width: '100%', height: '400px', ...style }} />;
};

AMapPathDrawer.propTypes = {
  paths: PropTypes.array,
  style: PropTypes.object
};

export default AMapPathDrawer;
