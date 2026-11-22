from typing import Any
from pydantic import BaseModel, Field
class AnalysisRequest(BaseModel):
    records:list[dict[str,Any]]=Field(min_length=2)
    time_col:str
    event_col:str
    group_col:str|None=None
    covariates:list[str]=[]
    seed:int|None=None
class AnalysisResponse(BaseModel):
    n:int
    events:int
    censored:int
    km:list[dict[str,Any]]
    logrank_p:float|None=None
    cox:list[dict[str,Any]]=[]
    metadata:dict[str,Any]={}
