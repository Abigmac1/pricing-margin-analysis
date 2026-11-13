# Definitions and review process

## Data grain
One row is one fictional invoice line. The dataset has 60 lines, 10 fictional customers, two channels, and three families. It is deterministic and deliberately contains exceptions. It is not representative of any market.

| Field | Definition |
|---|---|
| line_id | Unique invoice-line identifier |
| customer | Fictional customer identifier |
| channel | OEM or Distribution |
| family | Fictional industrial product grouping |
| quantity | Positive units sold |
| list_price | USD per unit |
| net_price | Invoiced USD per unit before excluded adjustments |
| unit_cost | Variable product cost in USD per unit |
| approved_discount | Maximum authorized discount as a decimal, applied per line |

## Calculations

- Revenue = quantity x net price.
- Product cost = quantity x unit cost.
- Gross profit = revenue - product cost.
- Weighted gross margin = total gross profit � total revenue. Never average line margin percentages.
- Actual discount = 1 - net price � list price.
- Approved floor = list price x (1 - approved discount).
- Exception exposure = quantity x max(0, approved floor - net price).
- Proposed unit price = max(current net price, approved floor).
- Scenario price = current net price + realization x (proposed price - current net price).
- Scenario units = baseline quantity x retention for below-floor lines; all other lines unchanged.
- Scenario gross profit = sum(scenario units x (scenario price - unit cost)).

Exception exposure is a hypothetical same-volume price gap. It does not establish recoverable revenue, an accounting loss, or an entitlement to retroactive collection. Scenario price changes represent future comparable sales, not rewriting historical invoices.

## Review and action

1. **Data owner:** reconcile units, invoice prices, and costs to source systems.
2. **Pricing:** validate policy versions, approved exceptions, and contract terms.
3. **Sales/account owner:** assess competitive position, customer commitments, and retention risk.
4. **Finance:** check rebates, freight, cost validity, and gross profit effects.
5. **Commercial leader:** approve account-specific action, owner, and review date.
6. **Follow-up:** compare realized net prices, retained volume, gross profit dollars, and exception recurrence with the baseline.

## Validation
The script checks known exception and non-exception fixtures, zero-revenue margin behavior, negative quantity rejection, and unique line identifiers. Calculations retain unrounded precision; presentation is rounded. CSV exports use six decimals.

## Limitations
There is no estimated elasticity or causal inference. Uniform retention assumptions simplify account-specific behavior. Product costs vary with retained units; fixed costs do not appear. Results apply only to this fictional dataset.

