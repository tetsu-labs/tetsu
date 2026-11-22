import numpy as np
import pandas as pd
from lifelines import KaplanMeierFitter,CoxPHFitter
from lifelines.statistics import logrank_test
from app.models import AnalysisRequest

def analyze(req:AnalysisRequest):
    if req.seed is not None: np.random.seed(req.seed)
    df=pd.DataFrame(req.records).copy()
    for c in [req.time_col,req.event_col]:
        if c not in df.columns: raise ValueError(f"Missing required column: {c}")
    df[req.time_col]=pd.to_numeric(df[req.time_col],errors='coerce')
    df[req.event_col]=pd.to_numeric(df[req.event_col],errors='coerce')
    df=df.dropna(subset=[req.time_col,req.event_col])
    df=df[df[req.time_col]>=0]
    df[req.event_col]=(df[req.event_col]!=0).astype(int)
    groups=[]
    if req.group_col and req.group_col in df.columns:
        it=df.groupby(req.group_col,dropna=False)
    else:
        it=[('All',df)]
    for name,g in it:
        km=KaplanMeierFitter().fit(g[req.time_col],event_observed=g[req.event_col])
        sf=km.survival_function_
        ci=km.confidence_interval_
        timeline=[]
        for t in sf.index:
            timeline.append({'time':float(t),'survival':float(sf.loc[t].iloc[0]),'lower_95':float(ci.loc[t].iloc[0]),'upper_95':float(ci.loc[t].iloc[1])})
        med=km.median_survival_time_
        groups.append({'group':str(name),'median':None if not np.isfinite(med) else float(med),'timeline':timeline})
    lp=None
    if req.group_col and req.group_col in df.columns:
        vals=list(df[req.group_col].dropna().unique())
        if len(vals)==2:
            a=df[df[req.group_col]==vals[0]]; b=df[df[req.group_col]==vals[1]]
            lp=float(logrank_test(a[req.time_col],b[req.time_col],event_observed_A=a[req.event_col],event_observed_B=b[req.event_col]).p_value)
    cox=[]
    cov=[c for c in req.covariates if c in df.columns]
    if cov:
        cdf=df[[req.time_col,req.event_col]+cov].copy()
        for c in cov: cdf[c]=pd.to_numeric(cdf[c],errors='coerce')
        cdf=cdf.dropna()
        if len(cdf)>=max(10,len(cov)*5):
            model=CoxPHFitter().fit(cdf,duration_col=req.time_col,event_col=req.event_col)
            for c in cov:
                r=model.summary.loc[c]
                cox.append({'variable':c,'hazard_ratio':float(r['exp(coef)']),'ci_lower_95':float(r['exp(coef) lower 95%']),'ci_upper_95':float(r['exp(coef) upper 95%']),'p_value':float(r['p'])})
    events=int(df[req.event_col].sum())
    return {'n':len(df),'events':events,'censored':len(df)-events,'km':groups,'logrank_p':lp,'cox':cox,'metadata':{'engine':'lifelines','seed':req.seed,'time_col':req.time_col,'event_col':req.event_col,'group_col':req.group_col,'covariates':cov}}
