from fastapi.testclient import TestClient
from app.main import app
client=TestClient(app)
def test_health(): assert client.get('/health').json()['status']=='ok'
def test_analysis():
    records=[{'time':5,'event':1,'group':'A','weight':40},{'time':8,'event':0,'group':'A','weight':42},{'time':4,'event':1,'group':'B','weight':50},{'time':9,'event':0,'group':'B','weight':51}]
    r=client.post('/api/analyze',json={'records':records,'time_col':'time','event_col':'event','group_col':'group','covariates':[],'seed':12345})
    assert r.status_code==200
    assert r.json()['n']==4
