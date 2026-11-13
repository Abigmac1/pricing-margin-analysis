# Industrial Pricing & Margin Analysis

**A synthetic commercial decision case study | Robert McDonald**

How should a commercial team prioritize discount exceptions while protecting gross profit and customer relationships?

This project demonstrates a practical workflow: establish an approved price floor, identify exceptions, quantify the exposure, and test price realization against volume retention. It connects transaction analysis to a review process involving sales, pricing, and finance.

> All customers, transactions, prices, costs, and policies are fictional. This is an AI-assisted portfolio demonstration prepared for Robert McDonald, not a reconstruction of employer data or evidence of realized business results.

## Start here

- **[Read the findings and scenarios](reports/findings.md)** - the commercial interpretation.
- **[Inspect the transaction review](reports/line_review.csv)** - calculations traceable to each line.
- **[Explore the sample data](data/transactions.csv)** - 60 fictional transactions across three product families.
- **[Read the analysis code](analyze.mjs)** - reproducible calculations and validation.
- **[Review definitions and decision rules](docs/methodology.md)**.

## Business decisions supported

1. Prioritize exceptions by dollars at stake, rather than discount percentage alone.
2. Distinguish a policy exception from a confirmed pricing error.
3. Evaluate gross profit dollars alongside margin percentage.
4. Test the impact of affected customer volume loss before acting.
5. Assign sales to confirm commercial context, pricing to validate approvals, and finance to reconcile economics.

## Reproduce the analysis

Requires Node.js 22 or newer; no external packages.

```sh
git clone https://github.com/Abigmac1/pricing-margin-analysis.git
cd pricing-margin-analysis
node analyze.mjs
```

The command validates core calculations and recreates both files in `reports/`.

## Scope

The model uses invoice revenue and product cost. It excludes rebates, freight, returns, taxes, fixed operating costs, currency changes, and product mix shifts. Approved discounts are fictional transaction-level policy inputs. A production model would require effective-dated agreements, approval history, and a reconciled net-price waterfall.

## Portfolio context

This example illustrates a pricing governance approach relevant to industrial OEM and distribution businesses. Robert's professional background spans BI, pricing, commercial operations, enterprise systems, and industrial automation. The repository's sample calculations should be discussed separately from verified career achievements.

[Return to Robert's profile](https://github.com/Abigmac1)

