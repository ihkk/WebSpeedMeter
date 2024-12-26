import React from "react";
import "./NumberDisplay.css";

interface NumberDisplayProps {
    value: number | string; // 修改为支持 number 和 string
    unit?: string; // 可选单位
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({ value, unit }) => {
    return (
        <div className="number-display">
            <div className="number">{value}</div>
            {unit && <div className="unit">{unit}</div>}
        </div>
    );
};

export default NumberDisplay;