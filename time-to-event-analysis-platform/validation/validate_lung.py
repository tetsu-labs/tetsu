from pathlib import Path
import math
import pandas as pd

from app.models import AnalysisRequest
from app.services.survival import analyze

ROOT = Path(__file__).resolve().parents[1]
df = pd.read_csv(ROOT / "validation" / "lung.csv")
ref = pd.read_csv(ROOT / "validation" / "r_reference_metrics.csv").iloc[0]

records = df.to_dict(orient="records")

overall = analyze(AnalysisRequest(
    records=records,
    time_col="time",
    event_col="event",
    group_col=None,
    covariates=[],
    seed=12345,
))

grouped = analyze(AnalysisRequest(
    records=records,
    time_col="time",
    event_col="event",
    group_col="sex",
    covariates=["age"],
    seed=12345,
))

assert overall["n"] == int(ref["n"])
assert overall["events"] == int(ref["events"])
assert overall["km"][0]["median"] == float(ref["median_all"])

assert grouped["logrank_p"] is not None
assert math.isclose(grouped["logrank_p"], float(ref["logrank_p"]), rel_tol=1e-6, abs_tol=1e-8)

age = next(x for x in grouped["cox"] if x["variable"] == "age")
assert math.isclose(age["hazard_ratio"], float(ref["age_hr"]), rel_tol=1e-4, abs_tol=1e-6)

print("NCCTG lung public-dataset validation PASS")
print({
    "n": overall["n"],
    "events": overall["events"],
    "median_all": overall["km"][0]["median"],
    "logrank_p": grouped["logrank_p"],
    "age_hr": age["hazard_ratio"],
})
