import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import type { AnalysisResponse, Domain } from "./types";

const presets: Record<Domain,{label:string;hint:string}> = {
  generic:{label:"汎用",hint:"任意の time/event/group/covariate を解析"},
  hamster:{label:"ハムスター寿命",hint:"死亡までの日数・餌・体重・近交係数"},
  saas:{label:"SaaS解約",hint:"契約継続日数・解約・料金プラン・利用量"},
  machine:{label:"機械故障",hint:"稼働時間・故障・機種・負荷"},
  server:{label:"サーバー障害",hint:"稼働時間・障害・構成・CPU/メモリ"},
  clinical:{label:"臨床生存",hint:"追跡期間・死亡/再発・治療群・共変量"}
};

const apiBase = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export function App(){
  const [token,setToken]=useState(localStorage.getItem("token") ?? "");
  const [email,setEmail]=useState("demo@example.com");
  const [password,setPassword]=useState("password123");
  const [domain,setDomain]=useState<Domain>("generic");
  const [rows,setRows]=useState<Record<string,unknown>[]>([]);
  const [headers,setHeaders]=useState<string[]>([]);
  const [timeCol,setTimeCol]=useState("");
  const [eventCol,setEventCol]=useState("");
  const [groupCol,setGroupCol]=useState("");
  const [covariates,setCovariates]=useState<string[]>([]);
  const [seed,setSeed]=useState(12345);
  const [result,setResult]=useState<AnalysisResponse|null>(null);
  const [error,setError]=useState("");
  const [projects,setProjects]=useState<any[]>([]);
  const [projectName,setProjectName]=useState("New project");
  const [selectedProject,setSelectedProject]=useState<number|null>(null);
  const [jobs,setJobs]=useState<any[]>([]);

  const authHeaders: Record<string,string> = token ? {Authorization:`Bearer ${token}`} : {};

  async function auth(mode:"register"|"login"){
    setError("");
    try{
      const r=await fetch(`${apiBase}/auth/${mode}`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
      });
      const b=await r.json();
      if(!r.ok) throw new Error(b.detail ?? "auth failed");
      localStorage.setItem("token",b.access_token);
      setToken(b.access_token);
    }catch(e){ setError(e instanceof Error?e.message:String(e)); }
  }

  async function loadProjects(){
    if(!token) return;
    const r=await fetch(`${apiBase}/projects`,{headers:authHeaders});
    if(r.ok) setProjects(await r.json());
  }

  async function loadJobs(){
    if(!token) return;
    const r=await fetch(`${apiBase}/jobs`,{headers:authHeaders});
    if(r.ok) setJobs(await r.json());
  }

  useEffect(()=>{ loadProjects(); loadJobs(); },[token]);

  function loadCsv(file:File){
    Papa.parse<Record<string,unknown>>(file,{
      header:true,dynamicTyping:true,skipEmptyLines:true,
      complete:r=>{
        const hs=r.meta.fields ?? [];
        setRows(r.data); setHeaders(hs);
        setTimeCol(hs.find(h=>/time|life|duration|days/i.test(h)) ?? hs[0] ?? "");
        setEventCol(hs.find(h=>/event|dead|death|status|churn|failure/i.test(h)) ?? hs[1] ?? "");
        setGroupCol(hs.find(h=>/group|cohort|arm|plan|type/i.test(h)) ?? "");
        setResult(null);
      }
    });
  }

  const payload = {
    records:rows,time_col:timeCol,event_col:eventCol,
    group_col:groupCol || null,covariates,seed
  };

  async function run(){
    setError(""); setResult(null);
    try{
      const res=await fetch(`${apiBase}/api/analyze`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      const b=await res.json();
      if(!res.ok) throw new Error(b.detail ?? "analysis failed");
      setResult(b);
    }catch(e){ setError(e instanceof Error?e.message:String(e)); }
  }

  async function saveProject(){
    if(!token) return setError("Login required");
    const body={name:projectName,domain,config:{timeCol,eventCol,groupCol,covariates,seed},data:rows};
    const r=await fetch(`${apiBase}/projects`,{
      method:"POST",headers:{...authHeaders,"Content-Type":"application/json"},
      body:JSON.stringify(body)
    });
    if(r.ok){ const b=await r.json(); setSelectedProject(b.id); await loadProjects(); }
  }

  async function createJob(){
    if(!token) return setError("Login required");
    const q=selectedProject?`?project_id=${selectedProject}`:"";
    const r=await fetch(`${apiBase}/jobs${q}`,{
      method:"POST",headers:{...authHeaders,"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    });
    if(r.ok) await loadJobs();
  }

  const summary=useMemo(()=>!result?[]:[
    ["N",result.n],["Events",result.events],["Censored",result.censored],
    ["Log-rank p",result.logrank_p==null?"-":result.logrank_p.toFixed(4)]
  ],[result]);

  return <div className="app">
    <header>
      <h1>Time-to-Event Analysis Platform v13</h1>
      <p>React + FastAPI + PostgreSQL + lifelines + Docker</p>
    </header>

    <main>
      <section className="card">
        <h2>Account</h2>
        {!token ? <div className="grid">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email"/>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="password"/>
          <button onClick={()=>auth("register")}>Register</button>
          <button onClick={()=>auth("login")}>Login</button>
        </div> :
        <div className="controls">
          <span>Authenticated</span>
          <button onClick={()=>{localStorage.removeItem("token");setToken("");}}>Logout</button>
        </div>}
      </section>

      <section className="card">
        <h2>Project</h2>
        <div className="grid">
          <input value={projectName} onChange={e=>setProjectName(e.target.value)}/>
          <button onClick={saveProject}>Save project</button>
          <select value={selectedProject ?? ""} onChange={e=>setSelectedProject(e.target.value?Number(e.target.value):null)}>
            <option value="">No project</option>
            {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={createJob}>Queue analysis job</button>
        </div>
      </section>

      <section className="card">
        <h2>Domain</h2>
        <select value={domain} onChange={e=>setDomain(e.target.value as Domain)}>
          {Object.entries(presets).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </select>
        <p className="muted">{presets[domain].hint}</p>
      </section>

      <section className="card">
        <h2>CSV</h2>
        <input type="file" accept=".csv,text/csv" onChange={e=>e.target.files?.[0]&&loadCsv(e.target.files[0])}/>
        <p className="muted">{rows.length?`${rows.length} rows loaded`:"No data"}</p>
      </section>

      <section className="card">
        <h2>Mapping</h2>
        <div className="grid">
          <label>Time<select value={timeCol} onChange={e=>setTimeCol(e.target.value)}>{headers.map(h=><option key={h}>{h}</option>)}</select></label>
          <label>Event<select value={eventCol} onChange={e=>setEventCol(e.target.value)}>{headers.map(h=><option key={h}>{h}</option>)}</select></label>
          <label>Group<select value={groupCol} onChange={e=>setGroupCol(e.target.value)}><option value="">None</option>{headers.map(h=><option key={h}>{h}</option>)}</select></label>
          <label>Seed<input type="number" value={seed} onChange={e=>setSeed(Number(e.target.value))}/></label>
        </div>

        <h3>Covariates</h3>
        <div className="chips">
          {headers.filter(h=>![timeCol,eventCol,groupCol].includes(h)).map(h=>
            <label className="chip" key={h}>
              <input type="checkbox" checked={covariates.includes(h)}
                onChange={e=>setCovariates(v=>e.target.checked?[...v,h]:v.filter(x=>x!==h))}/>
              {h}
            </label>
          )}
        </div>
        <button disabled={rows.length<2||!timeCol||!eventCol} onClick={run}>Analyze now</button>
        {error&&<p className="error">{error}</p>}
      </section>

      {result&&<section className="card">
        <h2>Results</h2>
        <div className="stats">
          {summary.map(([k,v])=><div className="stat" key={String(k)}><span>{k}</span><b>{String(v)}</b></div>)}
        </div>
        <h3>Kaplan–Meier</h3>
        <table><thead><tr><th>Group</th><th>Median</th><th>Points</th></tr></thead>
          <tbody>{result.km.map(g=><tr key={g.group}><td>{g.group}</td><td>{g.median??"-"}</td><td>{g.timeline.length}</td></tr>)}</tbody>
        </table>
        <h3>Cox PH</h3>
        <table><thead><tr><th>Variable</th><th>HR</th><th>95% CI</th><th>p</th></tr></thead>
          <tbody>{result.cox.length?result.cox.map(r=><tr key={r.variable}><td>{r.variable}</td><td>{r.hazard_ratio.toFixed(3)}</td><td>{r.ci_lower_95.toFixed(3)} – {r.ci_upper_95.toFixed(3)}</td><td>{r.p_value.toFixed(4)}</td></tr>):<tr><td colSpan={4}>No Cox model</td></tr>}</tbody>
        </table>
      </section>}

      <section className="card">
        <h2>Analysis jobs</h2>
        <button onClick={loadJobs}>Refresh jobs</button>
        <table><thead><tr><th>ID</th><th>Project</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>{jobs.map(j=><tr key={j.id}><td>{j.id}</td><td>{j.project_id??"-"}</td><td>{j.status}</td><td>{String(j.created_at)}</td></tr>)}</tbody>
        </table>
      </section>
    </main>
  </div>
}
