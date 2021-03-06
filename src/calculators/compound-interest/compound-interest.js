import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import IconChevronLeft from "materialish/icon-chevron-left";
import { useConstant } from "core-hooks";
import { formatForDisplay } from "@moolah/lib";
import GetShareableLink from "../get-shareable-link";
import Input from "../../common/input";
import usePageTitle from "../../hooks/use-page-title";
import useConfigForm from "../../hooks/use-config-form";
import useCalculatorState from "../../hooks/use-calculator-state/index";
import { numberOfYears, dollars, percent } from "../../utils/common-validators";
import useCalculationUrl from "../../hooks/use-calculation-url";
import computeCompoundInterest from "./compute-compound-interest";

function computeResult(inputs) {
  const { interestRate } = inputs;

  return computeCompoundInterest({
    ...inputs,
    interestRate: interestRate / 100,
  });
}

export default function CompoundInterest() {
  usePageTitle("Compound Interest");
  const [isShareLinkOpen, setIsShareLinkOpen] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);

  const formConfig = useConstant(() => {
    return {
      principal: {
        type: "number",
        initialValue: 10000,
        validators: [...dollars],
      },
      annualContribution: {
        type: "number",
        initialValue: 0,
        validators: [...dollars],
      },
      numberOfYears: {
        type: "number",
        initialValue: 10,
        validators: [...numberOfYears],
      },
      interestRate: {
        type: "number",
        initialValue: 7,
        validators: [...percent],
      },
    };
  });

  const { state, getProps } = useConfigForm({
    formConfig,
    useSourceOfTruth: () => useCalculatorState(formConfig),
  });

  const result = useMemo(() => computeResult(state), [state]);
  const calculationUrl = useCalculationUrl(state);

  return (
    <>
      <div className="calculatorPage">
        <Link to="/" className="calculatorPage_backLink">
          <IconChevronLeft
            className="calculatorPage_backLinkIcon"
            size="1.125rem"
          />
          View more calculators
        </Link>
        <h1 className="calculatorPage_title">Compound Interest</h1>
        <div className="calculatorPage_description">
          <p>
            Compound interest occurs when you reinvest your interest, so that
            the interest in the next period includes your principal investment
            as well as the previous interest. This is sometimes referred to as
            "earning interest on interest".
          </p>
          <p>
            Compound interest is an important concept in personal finance,
            because it allows us to accumulate wealth much more quickly than we
            could otherwise.
          </p>
          {/* <button type="button" className="calculatorPage_learnMoreBtn">
          Learn more.
        </button> */}
        </div>

        <div className="calculator">
          <form className="calculator_form">
            <div className="calculator_row">
              <div className="calculator_rowItem">
                <div className="inputLabel_container">
                  <label htmlFor="valueInStartYear" className="inputLabel">
                    Principal
                  </label>
                </div>
                <Input
                  {...getProps("principal", {
                    id: "valueInStartYear",
                    className: "calculator_largeInput",
                    type: "number",
                    prefix: "$",
                    style: {
                      fontSize: "1.25rem",
                    },
                  })}
                />
              </div>
              <div className="calculator_rowItem">
                <div className="inputLabel_container">
                  <label htmlFor="annualContribution" className="inputLabel">
                    Annual Contribution
                  </label>
                </div>
                <Input
                  {...getProps("annualContribution", {
                    id: "annualContribution",
                    className: "calculator_largeInput",
                    type: "number",
                    prefix: "$",
                    style: {
                      fontSize: "1.25rem",
                    },
                  })}
                />
              </div>
            </div>

            <div className="calculator_row">
              <div className="calculator_rowItem">
                <div className="inputLabel_container">
                  <label htmlFor="numberOfYears" className="inputLabel">
                    Number of Years
                  </label>
                </div>
                <Input
                  {...getProps("numberOfYears", {
                    id: "numberOfYears",
                    className: "calculator_largeInput",
                    type: "number",
                    style: {
                      fontSize: "1.25rem",
                    },
                  })}
                />
              </div>
              <div className="calculator_rowItem">
                <div className="inputLabel_container">
                  <label htmlFor="interestRate" className="inputLabel">
                    Annual Interest Rate
                  </label>
                </div>
                <Input
                  {...getProps("interestRate", {
                    id: "interestRate",
                    className: "calculator_largeInput",
                    type: "number",
                    suffix: "%",
                    style: {
                      fontSize: "1.25rem",
                    },
                  })}
                />
              </div>
            </div>
          </form>
          <div className="calculator_results">
            <h2 className="calculator_resultsTitle">Result</h2>
            <div className="calculator_resultsLargeNumber">
              {formatForDisplay(result)}
            </div>
            <div className="calculator_resultsDescription">
              <b>{formatForDisplay(state.principal)}</b> will become{" "}
              <b>{formatForDisplay(result)}</b> after {state.numberOfYears}{" "}
              years with {state.interestRate}% annual interest and an annual
              contribution of {formatForDisplay(state.annualContribution)}.
            </div>
            <div className="calculator_shareBtnContainer">
              <button
                type="button"
                className="calculator_shareBtn"
                ref={setReferenceElement}
                onClick={() => setIsShareLinkOpen(true)}
              >
                Share this result
              </button>
            </div>
          </div>
        </div>
      </div>
      <GetShareableLink
        calculationUrl={calculationUrl}
        active={isShareLinkOpen}
        onDismiss={() => setIsShareLinkOpen(false)}
        referenceElement={referenceElement}
        animationDuration={120}
      />
    </>
  );
}
