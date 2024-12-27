import React from "react";
import "./DoubleDisplay.css";

interface DoubleDisplayProps {
    top: string;
    bottom: string;
}

const DoubleDisplay: React.FC<DoubleDisplayProps> = ({ top, bottom }) => {
    return (
        <div className="double-display">
            <div className="top">{top}</div>
            <div className="bottom">{bottom}</div>
        </div>
    );
};

export default DoubleDisplay;