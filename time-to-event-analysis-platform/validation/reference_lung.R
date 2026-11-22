suppressPackageStartupMessages(library(survival))

lung2 <- lung[complete.cases(lung[, c("time","status","sex","age")]), c("time","status","sex","age")]
lung2$event <- as.integer(lung2$status == 2)

fit_all <- survfit(Surv(time, event) ~ 1, data=lung2)
median_all <- as.numeric(summary(fit_all)$table["median"])

lr <- survdiff(Surv(time, event) ~ factor(sex), data=lung2)
logrank_p <- 1 - pchisq(lr$chisq, df=1)

cox <- coxph(Surv(time, event) ~ age, data=lung2, ties="efron")
age_hr <- as.numeric(exp(coef(cox)["age"]))

write.csv(lung2, "validation/lung.csv", row.names=FALSE)
write.csv(
  data.frame(
    n=nrow(lung2),
    events=sum(lung2$event),
    median_all=median_all,
    logrank_p=logrank_p,
    age_hr=age_hr
  ),
  "validation/r_reference_metrics.csv",
  row.names=FALSE
)
