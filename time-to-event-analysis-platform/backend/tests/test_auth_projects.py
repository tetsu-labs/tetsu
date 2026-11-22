import os
os.environ["DATABASE_URL"] = "sqlite:///./test_app.db"

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def auth_headers():
    email = "tester@example.com"
    password = "password123"
    r = client.post("/auth/register", json={"email":email,"password":password})
    if r.status_code == 409:
        r = client.post("/auth/login", json={"email":email,"password":password})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_project_crud_and_job():
    h = auth_headers()
    r = client.post("/projects", headers=h, json={"name":"Demo","domain":"server","config":{},"data":[]})
    assert r.status_code == 200
    pid = r.json()["id"]

    r = client.get("/projects", headers=h)
    assert r.status_code == 200
    assert any(p["id"] == pid for p in r.json())

    payload = {
        "records":[
            {"time":5,"event":1,"group":"A"},
            {"time":8,"event":0,"group":"A"},
            {"time":4,"event":1,"group":"B"},
            {"time":9,"event":1,"group":"B"}
        ],
        "time_col":"time","event_col":"event","group_col":"group","covariates":[]
    }
    r = client.post(f"/jobs?project_id={pid}", headers=h, json=payload)
    assert r.status_code == 200
    jid = r.json()["id"]

    r = client.get(f"/jobs/{jid}", headers=h)
    assert r.status_code == 200
