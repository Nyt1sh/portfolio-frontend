import React from 'react'

const GlobalCursor = () => {

    const mx = useMotionValue(-100);
    const my = useMotionValue(-100);
    const sx = useSpring(mx, { stiffness: 220, damping: 26 });
    const sy = useSpring(my, { stiffness: 220, damping: 26 });

    useEffect(() => {
        const handleMove = (e) => {
            mx.set(e.clientX);
            my.set(e.clientY);
        };
        const handleTouch = () => {
            mx.set(-100);
            my.set(-100);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchstart', handleTouch, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchstart', handleTouch);
        };
    }, [mx, my]);


  return (
    <div>
      
    </div>
  )
}

export default GlobalCursor
