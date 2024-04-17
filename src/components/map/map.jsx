import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AMapLoader from '@amap/amap-jsapi-loader';

const AMapPathDrawer = ({ path, style }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    AMapLoader.load({
      key: "e65a2fad806f1efcbe741afff844c30b",  // 使用你的API密钥
      version: "2.0",            // 使用高德地图JS API的2.0版本
      plugins: []                // 根据需要添加插件
    }).then(AMap => {
      const map = new AMap.Map(mapContainer.current, {
        viewMode: "3D",          // 使用3D视图模式
        zoom: 13,                // 初始缩放级别
        center: path[0],         // 使用路径的第一个坐标作为地图中心点
      });

      const polyline = new AMap.Polyline({
        path: path.map(point => new AMap.LngLat(...point)), // 将点数组转换为高德地图LngLat对象
        strokeColor: '#00A76F',  // 线条颜色
        strokeOpacity: 1,
        strokeWeight: 3,
        strokeStyle: 'solid',
      });

      polyline.setMap(map);
    }).catch(e => {
      console.error('Failed to load AMap library:', e);
    });
  }, [path]);  // 如果路径改变，则重新运行效果

  return <div ref={mapContainer} style={{ width: '100%', height: '400px', ...style }} />;
};

AMapPathDrawer.propTypes = {
  path: PropTypes.array.isRequired,
  style: PropTypes.object
};

export default AMapPathDrawer;
