import React from "react";
import "./NumberDisplay.css";

interface NumberDisplayProps {
    value: number | string;
    unit?: string; // optional
    fixedLength?: number;
}

/**
 * Pads a number or string to the specified length with leading zeroes.
 * @param value The input value (number or string).
 * @param length The desired length of the output string.
 * @returns The padded string.
 */
function padWithZeroes(value: string | number, length: number): string {
    const stringValue = value.toString();
    return stringValue.padStart(length, "0");
}


const NumberDisplay: React.FC<NumberDisplayProps> = ({ value, unit, fixedLength }) => {
    // if fixedLength is provided, pad the value with leading zeroes
    const formattedValue = fixedLength ? padWithZeroes(value, fixedLength) : value;

    return (
        <div className="number-display">
            <div className="number">{formattedValue}</div>
            {unit && <div className="unit">{unit}</div>}
        </div>
    );
};


export default NumberDisplay;