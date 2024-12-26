import React, { useState, useEffect } from "react";
import "./Compass.css";

interface CompassProps {
    heading: number; // 当前目标角度（0-360）
}

const Compass: React.FC<CompassProps> = ({ heading }) => {
    const [currentHeading, setCurrentHeading] = useState(0);

    useEffect(() => {
        const calculateShortestRotation = (current: number, target: number) => {
            const difference = target - current;
            if (Math.abs(difference) > 180) {
                return difference > 0 ? difference - 360 : difference + 360;
            }
            return difference;
        };

        const shortestRotation = calculateShortestRotation(currentHeading, heading);
        setCurrentHeading((prev) => prev + shortestRotation);
    }, [heading, currentHeading]);

    return (
        <div className="compass">
            <div className="compass-circle">
                {/* 方位标记 */}
                <div className="compass-label north">N</div>
                <div className="compass-label east">E</div>
                <div className="compass-label south">S</div>
                <div className="compass-label west">W</div>
                <div className="compass-label ne">NE</div>
                <div className="compass-label nw">NW</div>
                <div className="compass-label se">SE</div>
                <div className="compass-label sw">SW</div>

                {/* 指针 */}
                <div
                    className="compass-pointer"
                    style={{ transform: `rotate(${currentHeading}deg)` }}
                >
                    <div className="compass-pointer-red" />
                    <div className="compass-pointer-white" />
                </div>
            </div>
        </div>
    );
};

export default Compass;