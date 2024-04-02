import { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

export default function MobileSwiper({ children, onSwipe }) {
    const wrapperRef = useRef(null);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);

    const handleTouchStart = useCallback((e) => {
        // 确保触摸点在目标元素内
        if (!wrapperRef.current.contains(e.target)) {
            return;
        }

        e.preventDefault(); // 阻止默认行为

        // 记录触摸开始的位置
        setStartX(e.touches[0].clientX);
        setStartY(e.touches[0].clientY);
    }, []);

    const handleTouchEnd = useCallback((e) => {
        if (!wrapperRef.current.contains(e.target)) {
            return;
        }

        e.preventDefault(); // 阻止默认行为

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        // 执行滑动回调
        onSwipe({ deltaX, deltaY });
    }, [startX, startY, onSwipe]);

    useEffect(() => {
        const currentRef = wrapperRef.current; // 缓存当前引用
        currentRef.addEventListener('touchstart', handleTouchStart, { passive: false });
        currentRef.addEventListener('touchend', handleTouchEnd, { passive: false });

        return () => {
            currentRef.removeEventListener('touchstart', handleTouchStart);
            currentRef.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleTouchStart, handleTouchEnd]);

    return <div ref={wrapperRef}>{children}</div>;
}

MobileSwiper.propTypes = {
    children: PropTypes.isRequired,
    onSwipe: PropTypes.func.isRequired,
};
