# Public dataset validation

This validation uses the NCCTG advanced lung cancer dataset distributed with the R `survival` package.

The CI pipeline:

1. loads the public dataset in R,
2. writes a shared CSV,
3. computes reference values with R `survival`,
4. runs the platform's Python analysis on the exact same rows,
5. compares:
   - sample size
   - event count
   - Kaplan-Meier median
   - two-group log-rank p-value
   - univariate Cox hazard ratio for age

This is intended as an independent cross-language numerical validation, not a clinical validation of the application.
