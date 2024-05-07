import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AMapLoader from '@amap/amap-jsapi-loader';

const AMapPathDrawer = ({ paths, style }) => {
  const mapContainer = useRef(null);

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
      plugins: ['Marker']        // 添加Marker插件
    }).then(AMap => {
      const map = new AMap.Map(mapContainer.current, {
        viewMode: "3D",          // 使用3D视图模式
        zoom: 16,                // 初始缩放级别
        center: paths.length ? paths[0].coords[0] : [0, 0], // 默认中心点
      });

      paths.forEach((path) => {
        const polyline = new AMap.Polyline({
          path: path.coords,
          strokeColor: path.color,
          strokeOpacity: 1,
          strokeWeight: 3,
          strokeStyle: 'solid',
        });
        polyline.setMap(map);

        // 检查是否存在用户头像，如果存在则创建带头像的标记
        if (path.user && path.user.avatarUrl) {
          const marker = new AMap.Marker({
            position: path.coords[0], // 标记在路径起点
            map: map,
            content: getIconHTML(path.user.avatarUrl)
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
  paths: PropTypes.arrayOf(PropTypes.shape({
    coords: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    color: PropTypes.string.isRequired,
    user: PropTypes.shape({
      avatarUrl: PropTypes.string
    })
  })),
  style: PropTypes.object
};

export default AMapPathDrawer;
