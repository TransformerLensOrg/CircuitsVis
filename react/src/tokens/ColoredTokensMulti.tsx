
import { Rank, tensor, Tensor1D, Tensor2D, Tensor3D } from "@tensorflow/tfjs";
import { AnyColor } from "colord";
import React, { useState, useEffect } from "react";
import { TokenCustomTooltip } from "./utils/TokenCustomTooltip";
import { ColoredTokens } from "./ColoredTokens";
import { ColoredTokensCustomTooltips } from "./ColoredTokensCustomTooltips";
import { useHoverLock } from "../attention/components/useHoverLock";
import { range } from "../utils/misc"

const PRECISION = 6;

export function ValueSelector({
    values,
    labels,
    selectedValue,
    setSelectedValue
}: {
    values: Tensor2D;
    labels: string[];
    selectedValue: number;
    setSelectedValue: (value: number) => void;
}) {
    const numValues = values.shape[1];

    const {
        focused: focusedValue,
        onClick: onClickValue,
        onMouseEnter: onMouseEnterValue,
        onMouseLeave: onMouseLeaveValue
    } = useHoverLock();

    // Janky setup because focusedValue and selectedValue are not the same thing.
    // Keeps them in sync, but only when focusedValue is not null.
    // This means that when the user moves their cursor off the selector, it remains with that value selected, rather than being null.
    useEffect(() => {
        if (focusedValue !== null) {
            setSelectedValue(focusedValue);
        }
    }, [focusedValue]);

    const valueSelectors = [];
    for (let i = 0; i < numValues; i++) {
        const isSelected = i === selectedValue;
        const label = labels[i];
        valueSelectors.push(
            <div
                key={i}
                style={{
                    display: "inline-block",
                    padding: "0 5px",
                    backgroundColor: isSelected ? "black" : "white",
                    color: isSelected ? "white" : "black",
                    cursor: "pointer"
                }}
                onClick={() => onClickValue(i)}
                onMouseEnter={() => onMouseEnterValue(i)}
                onMouseLeave={onMouseLeaveValue}
            >
                {label}
            </div>
        );
    }

    return <div>{valueSelectors}</div>;
}

// 
export function NumberInput({
    value,
    setValue,
    label,
}: {
    value: number;
    setValue: (value: number) => void;
    label: string;
}) {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (event: { target: { value: string; }; }) => {
        setInputValue((event.target.value));
    };

    const handleButtonClick = () => {
        setValue(parseFloat(inputValue));
    };

    return (
        <div>
            <label htmlFor={label}>{label}:</label>
            <input
                type="text"
                id="number"
                value={inputValue}
                onChange={handleInputChange}
            />
            <button type="button" onClick={handleButtonClick}>
                Set
            </button>
        </div>
    );
}

export function Tooltip({
    title,
    labels,
    values,
    tokenIndex,
    currentValueIndex,
}: {
    title: string;
    labels: string[];
    values: Tensor2D;
    tokenIndex: number;
    currentValueIndex: number;
}) {
    const numValues = values.shape[1];

    const valueRows = [];
    for (let i = 0; i < numValues; i++) {
        valueRows.push(
            <tr key={i}>
                <td
                    style={{ fontWeight: "bold" }}>
                    {labels[i]}
                </td>
                <td
                    style={{
                        textAlign: "right",
                        fontWeight: currentValueIndex == i ? "bold" : "normal"
                    }}>
                    {values.bufferSync().get(tokenIndex, i).toFixed(PRECISION)}
                </td>
            </tr>
        );
    }

    return <>
        <div style={{ fontWeight: "bold", fontSize: 16, backgroundColor: "white" }}>{title}</div>
        <table>
            <tbody>
                {valueRows}
            </tbody>
        </table>
    </>
}

/**
 * Extension of ColoredTokens to allow K vectors of values across tokens. Each vector has a positive and negative color associated. For the selected vector, display tokens with a background representing how negative (close to
 * `negativeColor`) or positive (close to `positiveColor`) the token is. Zero is
 * always displayed as white.
 *
 * Hover over a token, to view all K of its values.
 */
export function ColoredTokensMulti({
    tokens,
    values,
    labels,
    positiveBounds,
    negativeBounds
}: ColoredTokensMultiProps) {
    const valuesTensor = tensor<Rank.R2>(values);

    const numTokens = valuesTensor.shape[0]
    const numValues = valuesTensor.shape[1]

    // Define default positive and negative bounds if not provided
    // These are the max/min elements of the value tensor, capped at +-1e-7 (not zero, to avoid a bug in our color calculation code)
    const positiveBoundsTensor: Tensor1D = positiveBounds ? tensor<Rank.R1>(positiveBounds) : valuesTensor.max(0).maximum(1e-7);
    const negativeBoundsTensor: Tensor1D = negativeBounds ? tensor<Rank.R1>(negativeBounds) : valuesTensor.min(0).minimum(-1e-7);

    // Define default labels if not provided
    const valueLabels = labels ? labels : Array.from(Array(numValues).keys()).map((_, i) => `${i}`);

    const [displayedValueIndex, setDisplayedValueIndex] = useState<number>(0);

    const [overridePositiveBound, setOverridePositiveBound] = useState<number>(NaN);
    const [overrideNegativeBound, setOverrideNegativeBound] = useState<number>(NaN);

    const displayedValues = valuesTensor.slice([0, displayedValueIndex], [-1, 1]).squeeze<Tensor1D>([1]);
    const currentPositiveBound = overridePositiveBound ? overridePositiveBound : positiveBoundsTensor.arraySync()[displayedValueIndex];
    const currentNegativeBound = overrideNegativeBound ? overrideNegativeBound : negativeBoundsTensor.arraySync()[displayedValueIndex];

    // Padding to ensure that the tooltip is visible - pretty janky, sorry!
    return <div style={{ paddingBottom: 20 * numValues }}>
        <ValueSelector values={valuesTensor} labels={valueLabels} selectedValue={displayedValueIndex} setSelectedValue={setDisplayedValueIndex} />
        <div style={{ fontWeight: "bold" }}>Positive Bound: {currentPositiveBound.toFixed(PRECISION)}</div>
        <div style={{ fontWeight: "bold" }}>Negative Bound: {currentNegativeBound.toFixed(PRECISION)}</div>
        <NumberInput value={overridePositiveBound} setValue={setOverridePositiveBound} label={"Positive Bound"} />
        <NumberInput value={overrideNegativeBound} setValue={setOverrideNegativeBound} label={"Negative Bound"} />
        <ColoredTokensCustomTooltips
            tokens={tokens}
            values={displayedValues.arraySync()}
            maxValue={currentPositiveBound}
            minValue={currentNegativeBound}
            tooltips={displayedValues.arraySync().map((val, i) => <Tooltip
                title={tokens[i]}
                labels={valueLabels}
                values={valuesTensor}
                tokenIndex={i}
                currentValueIndex={displayedValueIndex}
            />)}
        />
    </div>;
};


export interface ColoredTokensMultiProps {
    /**
     * The prompt for the model, split into S tokens (as strings)
     */
    tokens: string[];
    /**
     * The tensor of values across the tokens. Shape [S, K]
     */
    values: number[][];
    /**
     * The labels for the K vectors
     */
    labels?: string[];
    /**
     * 
     */
    positiveBounds?: number[];
    /**
     */
    negativeBounds?: number[]
}