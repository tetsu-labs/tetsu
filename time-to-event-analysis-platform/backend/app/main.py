from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import Base, engine, get_db, SessionLocal
from app.entities import User, Project, AnalysisJob
from app.auth import hash_password, verify_password, create_access_token, current_user
from app.schemas import RegisterRequest, LoginRequest, TokenResponse, ProjectCreate, ProjectUpdate
from app.models import AnalysisRequest, AnalysisResponse
from app.services.survival import analyze

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Time-to-Event Analysis Platform API", version="13.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "version": "13.0.0"}

@app.post("/auth/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.scalar(select(User).where(User.email == req.email)):
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(email=req.email, password_hash=hash_password(req.password))
    db.add(user); db.commit(); db.refresh(user)
    return TokenResponse(access_token=create_access_token(user.id))

@app.post("/auth/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == req.email))
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenResponse(access_token=create_access_token(user.id))

@app.get("/projects")
def list_projects(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.scalars(select(Project).where(Project.owner_id == user.id).order_by(Project.updated_at.desc())).all()
    return [
        {"id":p.id,"name":p.name,"domain":p.domain,"config":p.config,"data":p.data,
         "created_at":p.created_at,"updated_at":p.updated_at}
        for p in rows
    ]

@app.post("/projects")
def create_project(req: ProjectCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    p = Project(owner_id=user.id, name=req.name, domain=req.domain, config=req.config, data=req.data)
    db.add(p); db.commit(); db.refresh(p)
    return {"id":p.id,"name":p.name,"domain":p.domain}

@app.put("/projects/{project_id}")
def update_project(project_id: int, req: ProjectUpdate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    p = db.get(Project, project_id)
    if not p or p.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    for field in ["name","domain","config","data"]:
        value = getattr(req, field)
        if value is not None:
            setattr(p, field, value)
    p.updated_at = datetime.utcnow()
    db.commit()
    return {"ok":True}

@app.delete("/projects/{project_id}")
def delete_project(project_id: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
    p = db.get(Project, project_id)
    if not p or p.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(p); db.commit()
    return {"ok":True}

@app.post("/api/analyze", response_model=AnalysisResponse)
def analyze_endpoint(req: AnalysisRequest):
    try:
        return analyze(req)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

def run_job(job_id: int):
    db = SessionLocal()
    try:
        job = db.get(AnalysisJob, job_id)
        if not job:
            return
        job.status = "running"; job.started_at = datetime.utcnow(); db.commit()
        try:
            req = AnalysisRequest(**job.request_payload)
            result = analyze(req).model_dump(mode="json")
            job.result_payload = result
            job.status = "succeeded"
        except Exception as exc:
            job.status = "failed"
            job.error_text = str(exc)
        job.finished_at = datetime.utcnow()
        db.commit()
    finally:
        db.close()

@app.post("/jobs")
def create_job(req: AnalysisRequest, background: BackgroundTasks, project_id: int | None = None,
               user: User = Depends(current_user), db: Session = Depends(get_db)):
    if project_id is not None:
        p = db.get(Project, project_id)
        if not p or p.owner_id != user.id:
            raise HTTPException(status_code=404, detail="Project not found")
    job = AnalysisJob(owner_id=user.id, project_id=project_id, request_payload=req.model_dump(mode="json"))
    db.add(job); db.commit(); db.refresh(job)
    background.add_task(run_job, job.id)
    return {"id":job.id,"status":job.status}

@app.get("/jobs")
def list_jobs(user: User = Depends(current_user), db: Session = Depends(get_db)):
    jobs = db.scalars(select(AnalysisJob).where(AnalysisJob.owner_id == user.id).order_by(AnalysisJob.created_at.desc())).all()
    return [{"id":j.id,"project_id":j.project_id,"status":j.status,"created_at":j.created_at,
             "started_at":j.started_at,"finished_at":j.finished_at,"error":j.error_text}
            for j in jobs]

@app.get("/jobs/{job_id}")
def get_job(job_id: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
    j = db.get(AnalysisJob, job_id)
    if not j or j.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"id":j.id,"status":j.status,"result":j.result_payload,"error":j.error_text}
