const POS_SCENARIOS={
 air:[
  {t:'基本現金会計',x:'コーヒー1杯を現金500円で会計。',items:{'コーヒー':1},m:'現金',tender:500},
  {t:'クレジット会計',x:'パスタ1個をクレジットカードで会計。',items:{'パスタ':1},m:'クレジットカード'},
  {t:'AirペイQR',x:'カレー1個をQR決済（Airペイ）で全額会計。',items:{'カレー':1},m:'QR決済（Airペイ）'},
  {t:'伝票10%割引',x:'カレーと紅茶を伝票10%引き、現金2,000円で。',items:{'カレー':1,'紅茶':1},m:'現金',ticketDisc:'10%',tender:2000},
  {t:'商品100円引き',x:'コーヒー豆を100円引き、現金2,000円。',items:{'コーヒー豆 200g':1},m:'現金',itemDiscountYen:100,tender:2000},
  {t:'商品券併用',x:'パスタを商品券500円＋残額現金で。',items:{'パスタ':1},m:'現金',split:{method:'商品券',amount:500}},
  {t:'個別会計',x:'サンドイッチとコーヒー。サンドイッチだけ先に別会計。',special:'individual'},
  {t:'現金返品',x:'直前の現金会計を返品。',special:'returnCash'},
  {t:'カード返品',x:'クレジット会計を返品し、決済側取消も確認。',special:'returnCard'},
  {t:'当日取消',x:'レジ締め前伝票を取消。',special:'sameDayVoid'},
  {t:'翌営業日修正',x:'営業日変更後の取引を金額修正。',special:'nextDayAdjust'},
  {t:'点検・精算',x:'過不足0円、翌営業日のつり銭を指定して精算。',special:'settlement'}
 ],
 smaregi:[
  {t:'販売業務・現金',x:'プリン2個を現金1,000円で販売。',items:{'プリン':2},m:'現金',tender:1000},
  {t:'販売業務・カード',x:'チーズケーキ1個をクレジットカードで販売。',items:{'チーズケーキ':1},m:'クレジットカード'},
  {t:'電子マネー',x:'カフェラテ1杯を電子マネーで販売。',items:{'カフェラテ':1},m:'電子マネー'},
  {t:'QRコード',x:'オレンジジュース1杯をQRコードで販売。',items:{'オレンジジュース':1},m:'QRコード'},
  {t:'商品券＋現金',x:'コーヒー豆を商品券500円＋現金で。',items:{'コーヒー豆 200g':1},m:'現金',split:{method:'商品券',amount:500}},
  {t:'商品割引',x:'サラダを20%引き、カードで。',items:{'サラダ':1},m:'クレジットカード',itemDiscountPct:20},
  {t:'伝票割引',x:'パスタ＋紅茶を10%引き、現金2,000円。',items:{'パスタ':1,'紅茶':1},m:'現金',ticketDisc:'10%',tender:2000},
  {t:'取引履歴確認',x:'直前取引を取引履歴から詳細確認。',special:'historyDetail'},
  {t:'現金返品',x:'現金取引を返品。',special:'returnCash'},
  {t:'取引取消',x:'締め前の誤取引を取消。',special:'sameDayVoid'},
  {t:'金額修正',x:'営業日変更後の取引を金額修正。',special:'nextDayAdjust'},
  {t:'締め処理',x:'現金過不足0円で精算。',special:'settlement'}
 ],
 square:[
  {t:'現金チェックアウト',x:'コーヒー1杯を現金500円で。',items:{'コーヒー':1},m:'現金',tender:500},
  {t:'カード',x:'パスタ1個をカードで支払い。',items:{'パスタ':1},m:'カード'},
  {t:'タッチ決済',x:'カフェラテ1杯をタッチ決済。',items:{'カフェラテ':1},m:'タッチ決済'},
  {t:'QRコード',x:'プリン1個をQRコードで。',items:{'プリン':1},m:'QRコード'},
  {t:'数量変更',x:'アイスを3個、カードで。',items:{'アイス':3},m:'カード'},
  {t:'商品割引',x:'サラダを20%引き、タッチ決済。',items:{'サラダ':1},m:'タッチ決済',itemDiscountPct:20},
  {t:'伝票割引',x:'サンドイッチ＋コーヒーを10%引き、カードで。',items:{'サンドイッチ':1,'コーヒー':1},m:'カード',ticketDisc:'10%'},
  {t:'領収書',x:'コーヒー豆を現金2,000円、領収書発行。',items:{'コーヒー豆 200g':1},m:'現金',tender:2000,receipt:true},
  {t:'取引確認',x:'直前取引を取引画面から確認。',special:'historyDetail'},
  {t:'現金返品',x:'現金取引を返品。',special:'returnCash'},
  {t:'カード返品',x:'カード取引を返品。',special:'returnCardSimple'},
  {t:'締め確認',x:'現金過不足0円を確認して締める。',special:'settlement'}
 ]
};

function posScenarioList(){return POS_SCENARIOS[state.posMode]||POS_SCENARIOS.air}
function startPosTraining(){
 state.posTraining={index:0,correct:0,errors:0,results:[],historyStart:state.history.length}; nextPosTrainingCase();
}
function seedTrainingTicket(method){
 let n=method==='現金'?'プリン':'コーヒー',amt=method==='現金'?390:350;
 let seeded={time:new Date().toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'}),no:'#T'+String(Date.now()).slice(-5),amount:amt,tender:method==='現金'?500:amt,items:{[n]:1},method:[method],splits:[],ticketDisc:'なし',itemDiscountYen:0,itemDiscountPct:0,status:'会計'};
 state.history.unshift(seeded);if(state.posTraining)state.posTraining.seedNo=seeded.no;
 localStorage.setItem('posHistory',JSON.stringify(state.history));renderHistory();
}
function nextPosTrainingCase(){
 let g=state.posTraining,cases=posScenarioList();if(!g)return;
 renderPosCaseList();
 if(g.index>=cases.length){
   document.querySelector('#posCaseNo').textContent='完了';
   document.querySelector('#posCaseTitle').textContent='カリキュラム終了';
   document.querySelector('#posCaseText').textContent=`${g.correct}/${cases.length} 正解`;
   document.querySelector('#posTrainingFeedback').className='feedback ok';
   document.querySelector('#posTrainingFeedback').textContent='全シナリオ終了。';
   show('postraining'); updatePosTrainingHUD(); return;
 }
 let c=cases[g.index];g.current=c;g.beforeTopNo=state.history[0]?.no||null;g.seedNo=null;state.lastDetailNo=null;resetOrder();state.receiptIssued=false;state.businessDayClosed=false;
 document.querySelector('#posTrainingTitle').textContent=currentProfile().label+' 実務シナリオ';
 document.querySelector('#posCaseNo').textContent=`${g.index+1} / ${cases.length}`;
 document.querySelector('#posCaseTitle').textContent=c.t;document.querySelector('#posCaseText').textContent=c.x;
 document.querySelector('#posTrainingFeedback').className='feedback';document.querySelector('#posTrainingFeedback').textContent='操作後に判定してください。';
 if(c.special==='returnCash'){seedTrainingTicket('現金');show('history')}
 else if(c.special==='returnCard'||c.special==='returnCardSimple'){seedTrainingTicket(state.posMode==='square'?'カード':'クレジットカード');show('history')}
 else if(c.special==='sameDayVoid'){seedTrainingTicket('現金');show('history')}
 else if(c.special==='nextDayAdjust'){seedTrainingTicket('現金');state.businessDayClosed=true;show('history')}
 else if(c.special==='historyDetail'){seedTrainingTicket('現金');show('history')}
 else if(c.special==='settlement'){
   state.businessOpen=true;state.openingFloat=30000;state.cashAdjust=0;
   document.querySelector('#businessState').textContent='営業中';
   document.querySelectorAll('.denom').forEach(x=>x.value=0);
   let rest=expectedCash(),ds=[10000,5000,1000,500,100,50,10,5,1];
   ds.forEach(d=>{let el=document.querySelector(`.denom[data-denom="${d}"]`);if(el){let q=Math.floor(rest/d);el.value=q;rest-=q*d}});
   updateCashCount();show('operations')
 } else if(c.special==='individual'){show('order')}
 else show('order');
 updatePosTrainingHUD();
}
function judgePosTraining(){
 let g=state.posTraining;if(!g){toast('開始してください');return}
 let c=g.current,r=state.history[0],ok=false,reason='';
 if(c.special==='returnCash'){ok=state.history.some(x=>x.status==='返品'&&x.sourceNo===g.seedNo&&x.method.includes('現金'));reason='現金返品'}
 else if(c.special==='returnCard'){ok=state.history.some(x=>x.status==='返品'&&x.sourceNo===g.seedNo&&x.method.includes('クレジットカード'))&&document.querySelector('#paymentAppConfirmed').checked;reason='カード返品＋決済確認'}
 else if(c.special==='returnCardSimple'){ok=state.history.some(x=>x.status==='返品'&&x.sourceNo===g.seedNo&&x.method.includes('カード'));reason='カード返品'}
 else if(c.special==='sameDayVoid'){ok=state.history.some(x=>x.no===g.seedNo&&x.status==='取消');reason='取消'}
 else if(c.special==='nextDayAdjust'){ok=state.history.some(x=>x.no===g.seedNo&&x.status==='金額修正');reason='金額修正'}
 else if(c.special==='historyDetail'){ok=document.querySelector('#detailModal').classList.contains('show')&&state.lastDetailNo===g.seedNo;reason='取引詳細'}
 else if(c.special==='settlement'){let cc=updateCashCount();ok=!state.businessOpen&&cc.d===0;reason='精算'}
 else if(c.special==='individual'){let nr=state.history[0];ok=!!nr&&nr.no!==g.beforeTopNo&&nr.items?.['サンドイッチ']===1&&!!window.__remainingCartAfterPay?.some(x=>x.n==='コーヒー');reason='個別会計'}
 else if(r && r.no!==g.beforeTopNo){
   ok=gameItemsMatch(r.items,c.items)&&r.method.includes(c.m);
   if(c.tender)ok=ok&&r.tender>=c.tender;
   if(c.ticketDisc)ok=ok&&r.ticketDisc===c.ticketDisc;
   if(c.itemDiscountYen)ok=ok&&(r.itemDiscountYen||0)>=c.itemDiscountYen;
   if(c.itemDiscountPct)ok=ok&&(r.itemDiscountPct||0)===c.itemDiscountPct;
   if(c.split)ok=ok&&r.splits?.some(x=>x.method===c.split.method&&x.amount===c.split.amount);
   if(c.receipt)ok=ok&&state.receiptIssued;
   reason='商品・数量・割引・支払条件';
 }
 if(ok){g.correct++;g.results[g.index]='pass';addSkill(3);document.querySelector('#posTrainingFeedback').className='feedback ok';document.querySelector('#posTrainingFeedback').textContent='正解'}
 else{g.errors++;g.results[g.index]='fail';document.querySelector('#posTrainingFeedback').className='feedback ng';document.querySelector('#posTrainingFeedback').textContent='不正解：'+reason+'を確認'}
 document.querySelector('#detailModal')?.classList.remove('show');g.index++;updatePosTrainingHUD();renderPosCaseList();setTimeout(nextPosTrainingCase,300);
}
function updatePosTrainingHUD(){
 let g=state.posTraining,cases=posScenarioList();if(!g)return;
 document.querySelector('#posTrainCorrect').textContent=g.correct;document.querySelector('#posTrainErrors').textContent=g.errors;
 document.querySelector('#posTrainProgress').textContent=Math.round(g.index/cases.length*100)+'%';
}
function renderPosCaseList(){
 let g=state.posTraining,cases=posScenarioList();
 document.querySelector('#posCaseList').innerHTML=cases.map((c,i)=>`<div class="case-item ${g&&g.index===i?'active':''}"><strong>${i+1}. ${c.t}</strong><div class="case-status">${g?.results?.[i]==='pass'?'<span class="case-pass">正解</span>':g?.results?.[i]==='fail'?'<span class="case-fail">ミス</span>':'未実施'}</div></div>`).join('');
}

const POS_PROFILES={
 air:{
  label:'Airレジ',
  methods:['現金','クレジットカード','電子マネー','QR決済（Airペイ）','商品券'],
  qrNoSplit:true,
  orderTitle:'注文入力',
  paymentTitle:'お支払い',
  nav:['注文リスト','伝票情報','個別会計'],
  header:'<div class="air-ticket-tabs"><button class="active">注文リスト</button><button>伝票情報</button></div>',
  payHeader:'<div class="small">支払い方法と金額を確認して「会計する」</div>',
  checkoutLabel:'支払いへ進む'
 },
 smaregi:{
  label:'スマレジ',
  methods:['現金','クレジットカード','電子マネー','QRコード','商品券'],
  qrNoSplit:false,
  orderTitle:'販売業務',
  paymentTitle:'会計',
  nav:['販売業務','取置き','取引履歴'],
  header:'<div class="smaregi-head"><strong>販売業務</strong><span class="small">商品を選択して販売</span></div>',
  payHeader:'<div class="small">支払方法を選択して取引を確定</div>',
  checkoutLabel:'会計へ'
 },
 square:{
  label:'Square',
  methods:['現金','カード','タッチ決済','QRコード'],
  qrNoSplit:false,
  orderTitle:'チェックアウト',
  paymentTitle:'支払い',
  nav:['商品','お気に入り','取引'],
  header:'<div class="square-checkout">チェックアウト</div><div class="small">商品を追加して支払いへ</div>',
  payHeader:'<div class="small">Square決済を想定したシンプルな支払い選択</div>',
  checkoutLabel:'支払い'
 }
};
function currentProfile(){return POS_PROFILES[state.posMode]||POS_PROFILES.air}
function setPosMode(mode){
 if(!POS_PROFILES[mode])return;
 state.posMode=mode;document.body.dataset.pos=mode;
 let p=currentProfile();
 document.querySelectorAll('[data-pos]').forEach(b=>b.classList.toggle('active',b.dataset.pos===mode));
 state.payMethod=p.methods[0];
 let ob=document.querySelector('#posBannerOrder'),pb=document.querySelector('#posBannerPayment');
 if(ob)ob.textContent=p.label+' モード';if(pb)pb.textContent=p.label+' モード';
 let ot=document.querySelector('#orderTitle'),pt=document.querySelector('#paymentTitle'),tp=document.querySelector('#toPay');
 if(ot)ot.textContent=p.orderTitle;if(pt)pt.textContent=p.paymentTitle;if(tp)tp.textContent=p.checkoutLabel;
 let mh=document.querySelector('#modeSpecificHeader'),mn=document.querySelector('#modeNav'),ph=document.querySelector('#paymentModeHeader');
 if(mh)mh.innerHTML=p.header||'';if(ph)ph.innerHTML=p.payHeader||'';
 if(mn)mn.innerHTML=p.nav.map((n,i)=>`<button class="${i===0?'active':''}" data-mode-nav="${i}">${n}</button>`).join('');
 let d=document.querySelector('#posModeDescription');
 if(d)d.textContent=mode==='air'?'Airレジ：注文リスト/伝票情報/個別会計→支払いへ進む→会計する。':
 mode==='smaregi'?'スマレジ：販売業務→会計→取引履歴を中心にした操作訓練。':
 'Square：チェックアウト→支払い→取引確認を中心にした高速決済訓練。';
 renderPaymentMethodsOnly();updateSkills();
 let ptt=document.querySelector('#posTrainingTitle');if(ptt)ptt.textContent=p.label+' 実務シナリオ';
 if(document.querySelector('#posCaseList'))renderPosCaseList();
 toast(p.label+'に切替')
}
function renderPaymentMethodsOnly(){
 let el=document.querySelector('#payMethods');if(!el)return;
 let p=currentProfile();
 el.innerHTML=p.methods.map(m=>`<button class="paymethod ${m===state.payMethod?'active':''}" data-method="${m}">
 <b>${m}</b><br><span class="small">${m==='現金'?'お預り金を入力':state.posMode==='square'?'決済を実行':state.posMode==='smaregi'?'支払方法を選択':'連携決済を模擬'}</span></button>`).join('')
}
function addSkill(p=1){state.posSkills[state.posMode]=Math.min(100,(state.posSkills[state.posMode]||0)+p);localStorage.setItem('posSkills',JSON.stringify(state.posSkills));updateSkills()}
function updateSkills(){for(const [k,id] of [['air','Air'],['smaregi','Smaregi'],['square','Square']]){let v=state.posSkills[k]||0,t=document.querySelector('#skill'+id),b=document.querySelector('#skill'+id+'Bar');if(t)t.textContent=v;if(b)b.style.width=v+'%'}}

const yen=n=>'¥'+Math.max(0,Math.round(n)).toLocaleString('ja-JP');
const catalog=[
 {id:1,c:'フード',n:'サンドイッチ',p:480,b:'490000000001'},{id:2,c:'フード',n:'カレー',p:780,b:'490000000002'},{id:3,c:'フード',n:'パスタ',p:920,b:'490000000003'},
 {id:4,c:'フード',n:'サラダ',p:420,b:'490000000004'},{id:5,c:'ドリンク',n:'コーヒー',p:350,b:'490000000005'},{id:6,c:'ドリンク',n:'カフェラテ',p:450,b:'490000000006'},
 {id:7,c:'ドリンク',n:'紅茶',p:380,b:'490000000007'},{id:8,c:'ドリンク',n:'オレンジジュース',p:400,b:'490000000008'},{id:9,c:'デザート',n:'チーズケーキ',p:520,b:'490000000009'},
 {id:10,c:'デザート',n:'プリン',p:390,b:'490000000010'},{id:11,c:'デザート',n:'アイス',p:330,b:'490000000011'},{id:12,c:'物販',n:'コーヒー豆 200g',p:1350,b:'490000000012'}
];
const methods=['現金','クレジットカード','電子マネー','QR決済（Airペイ）','商品券'];
let state={
 cat:'フード', cart:[], ticketDiscount:{type:'none',value:0}, payMethod:'現金', input:'0', splits:[],
 history:JSON.parse(localStorage.getItem('posHistory')||'[]'), actions:+localStorage.getItem('posActions')||0,
 mistakes:+localStorage.getItem('posMistakes')||0, clears:+localStorage.getItem('posClears')||0,
 training:false, missionIndex:0, targetDiscount:null, businessOpen:false, openingFloat:30000, cashAdjust:0, individualIds:[], individualMode:false, staffGame:null, timedMode:null, dining:'店内', bag:'なし', taxRate:10, changeSelection:0, receiptIssued:false, receiptReprinted:false, errorDrill:null, precheck:false, paycheck:false, carryMode:'指定', nextFloat:30000, realFlow:null, businessDayClosed:false, posMode:'air', posSkills:JSON.parse(localStorage.getItem('posSkills')||'{"air":0,"smaregi":0,"square":0}'), posTraining:null
};
const missions=[
 {title:'現金・通常会計',text:'サンドイッチ1個とコーヒー1杯。1,000円を預かって会計してください。',
  check:r=>r.items['サンドイッチ']==1&&r.items['コーヒー']==1&&r.total==830&&r.method.includes('現金')&&r.tender>=1000},
 {title:'数量変更',text:'カフェラテを2杯、チーズケーキを1個。現金2,000円で会計してください。',
  check:r=>r.items['カフェラテ']==2&&r.items['チーズケーキ']==1&&r.total==1420&&r.tender>=2000},
 {title:'伝票10%割引',text:'カレー1個と紅茶1杯に、伝票全体10%割引を適用し、クレジットで会計してください。',
  check:r=>r.items['カレー']==1&&r.items['紅茶']==1&&r.ticketDisc==='10%'&&r.method.includes('クレジットカード')},
 {title:'複数支払い',text:'パスタ1個を、商品券500円＋残額を現金で会計してください。',
  check:r=>r.items['パスタ']==1&&r.splits.some(x=>x.method==='商品券'&&x.amount===500)&&r.method.includes('現金')},
 {title:'商品単位割引',text:'コーヒー豆200gを1個。商品単位で100円引きし、QR決済で会計してください。',
  check:r=>r.items['コーヒー豆 200g']==1&&r.itemDiscountYen>=100&&r.method.includes('QR決済（Airペイ）')},
 {title:'バーコード登録',text:'バーコード 490000000005 を読み取り、コーヒー1杯を現金500円で会計してください。',
  check:r=>r.items['コーヒー']==1&&r.method.includes('現金')&&r.tender>=500}
];

function beep(){ if(document.querySelector('#soundOn')?.checked){try{let a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.frequency.value=520;g.gain.value=.025;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.035)}catch(e){}}}
function act(){state.actions++;localStorage.setItem('posActions',state.actions);beep();updateScore()}
function toast(s){let t=document.querySelector('#toast');t.textContent=s;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1200)}

let pendingConfirm=null;
function askConfirm(title,text,onOk){
 pendingConfirm=onOk;document.querySelector('#confirmTitle').textContent=title;
 document.querySelector('#confirmText').textContent=text;document.querySelector('#confirmModal').classList.add('show');
}
function closeConfirm(){document.querySelector('#confirmModal').classList.remove('show');pendingConfirm=null}
function openSheet(){document.querySelector('#sheetBackdrop').classList.add('show');document.querySelector('#orderMenuSheet').classList.add('show')}
function closeSheet(){document.querySelector('#sheetBackdrop').classList.remove('show');document.querySelector('#orderMenuSheet').classList.remove('show')}

let onboardingStep=0;
function renderOnboarding(){
  document.querySelectorAll('.onboard-step').forEach(x=>x.classList.toggle('active',+x.dataset.obs===onboardingStep));
  document.querySelectorAll('[data-obp]').forEach(x=>x.classList.toggle('active',+x.dataset.obp<=onboardingStep));
  document.querySelector('#onboardPrev').style.visibility=onboardingStep===0?'hidden':'visible';
  document.querySelector('#onboardNext').textContent=onboardingStep===3?'開始する':'次へ';
}
function showOnboarding(){
  onboardingStep=0;renderOnboarding();document.querySelector('#onboardOverlay').classList.add('show');
}
function finishOnboarding(){
  localStorage.setItem('posOnboardingDone','1');document.querySelector('#onboardOverlay').classList.remove('show');
}
function initOnboarding(){
  if(localStorage.getItem('posOnboardingDone')!=='1')showOnboarding();
}

function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.querySelector('#'+id).classList.add('active');
 document.querySelectorAll('.navbtn').forEach(x=>x.classList.toggle('active',x.dataset.screen===id));}
function cats(){return [...new Set(catalog.map(x=>x.c))]}
function renderCatalog(){
 let tabs=document.querySelector('#categoryTabs');tabs.innerHTML=cats().map(c=>`<button class="tab ${c===state.cat?'active':''}" data-cat="${c}">${c}</button>`).join('');
 document.querySelector('#products').innerHTML=catalog.filter(x=>x.c===state.cat).map(x=>`<button class="product" data-id="${x.id}"><b>${x.n}</b><span class="price">${yen(x.p)}</span></button>`).join('');
}
function add(id){act();let p=catalog.find(x=>x.id==id),r=state.cart.find(x=>x.id==id);if(r)r.q++;else state.cart.push({...p,q:1,discType:'none',disc:0});renderCart()}
function itemBase(r){return r.p*r.q}
function itemDiscount(r){let b=itemBase(r);if(r.discType==='pct')return Math.round(b*r.disc/100);if(r.discType==='yen')return Math.min(b,r.disc);return 0}
function subtotal(){return state.cart.reduce((s,r)=>s+itemBase(r),0)}
function afterItem(){return state.cart.reduce((s,r)=>s+itemBase(r)-itemDiscount(r),0)}
function ticketDiscAmt(){let b=afterItem(),d=state.ticketDiscount;if(d.type==='pct')return Math.round(b*d.value/100);if(d.type==='yen')return Math.min(b,d.value);return 0}
function total(){return Math.max(0,afterItem()-ticketDiscAmt())}
function renderCart(){
 let el=document.querySelector('#orderList');
 if(!state.cart.length)el.innerHTML='<div style="padding:50px 0;text-align:center;color:#8794a0">商品を選択して注文を開始</div>';
 else el.innerHTML=state.cart.map(r=>`<div class="order-row">
   <div><strong>${r.n}</strong><div class="small">${yen(r.p)} × ${r.q}${itemDiscount(r)?' / 割引 '+yen(itemDiscount(r)):''}</div>
   <div class="qtyline"><button data-op="minus" data-id="${r.id}">−</button><b>${r.q}</b><button data-op="plus" data-id="${r.id}">＋</button><button class="linkbtn" data-op="disc" data-id="${r.id}">割引</button></div></div>
   <div><strong>${yen(itemBase(r)-itemDiscount(r))}</strong><div class="row-actions"><button class="linkbtn danger" data-op="del" data-id="${r.id}">削除</button></div></div>
 </div>`).join('');
 document.querySelector('#subtotal').textContent=yen(subtotal());
 document.querySelector('#discountTotal').textContent='-'+yen(subtotal()-total());
 document.querySelector('#grandTotal').textContent=yen(total());
 document.querySelector('#toPay').disabled=!state.cart.length;
}
function openDiscount(itemId=null){state.targetDiscount=itemId;document.querySelector('#discountTitle').textContent=itemId?'商品割引':'伝票割引';document.querySelector('#discountModal').classList.add('show')}
function applyDisc(type,val){act();if(state.targetDiscount){let r=state.cart.find(x=>x.id==state.targetDiscount);r.discType=type;r.disc=val}else state.ticketDiscount={type,value:val};document.querySelector('#discountModal').classList.remove('show');renderCart()}
function remaining(){return Math.max(0,total()-state.splits.reduce((s,x)=>s+x.amount,0))}
function renderPayment(){
 document.querySelector('#payItems').innerHTML=state.cart.map(r=>`<div class="sumrow"><span>${r.n} × ${r.q}</span><span>${yen(itemBase(r)-itemDiscount(r))}</span></div>`).join('');
 document.querySelector('#payTotal').textContent=yen(total());
 document.querySelector('#paidSoFar').textContent=yen(state.splits.reduce((s,x)=>s+x.amount,0));
 document.querySelector('#remaining').textContent=yen(remaining());
 document.querySelector('#payMethods').innerHTML=currentProfile().methods.map(m=>`<button class="paymethod ${m===state.payMethod?'active':''}" data-method="${m}"><b>${m}</b><br><span class="small">${m==='現金'?'お預り金を入力':m==='クレジットカード'?'全額をカード決済':m==='電子マネー'?'全額を電子マネー決済':m==='QR決済（Airペイ）'?'全額QR決済・併用不可':'支払額を入力'}</span></button>`).join('');
 calcChange();
}
function inputNum(n){act();if(state.input==='0')state.input='';state.input=(state.input+n).slice(0,8);document.querySelector('#cashInput').value=Number(state.input||0).toLocaleString();calcChange()}
function setCash(v){act();state.input=String(v);document.querySelector('#cashInput').value=Number(v).toLocaleString();calcChange()}
function calcChange(){let v=+state.input||0, need=remaining();document.querySelector('#change').textContent=yen(state.payMethod==='現金'?Math.max(0,v-need):0)}
function addSplit(){
 if(currentProfile().qrNoSplit && state.payMethod==='QR決済（Airペイ）'){toast('AirレジのQR決済は併用できません');state.mistakes++;saveScore();return}
 let amt=+state.input||0,rem=remaining();if(amt<=0){toast('支払額を入力してください');return}
 if(state.payMethod!=='現金'&&amt>rem)amt=rem;
 if(state.payMethod==='現金'&&amt>rem)amt=rem; // split stores applied amount, tender preserved only on final
 state.splits.push({method:state.payMethod,amount:amt});state.input='0';renderPayment();act();toast('支払いを追加しました')
}
function makeReceipt(tender){
 const now=new Date(),disc=state.ticketDiscount.type==='pct'?state.ticketDiscount.value+'%':state.ticketDiscount.type==='yen'?yen(state.ticketDiscount.value):'なし';
 return {time:now.toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'}),no:'#'+String(Date.now()).slice(-6),amount:total(),tender,
  status:'会計', itemDiscountPct:Math.max(0,...state.cart.filter(x=>x.discType==='pct').map(x=>x.disc),0), items:Object.fromEntries(state.cart.map(x=>[x.n,x.q])),method:[...state.splits.map(x=>x.method),state.payMethod],
  splits:[...state.splits],ticketDisc:disc,itemDiscountYen:state.cart.reduce((s,x)=>s+(x.discType==='yen'?x.disc:0),0)}
}
function checkout(){
 act();let rem=remaining(),v=+state.input||0;
 if(rem>0){
   if(v<=0){ if(state.payMethod!=='現金')v=rem; else {toast('お預り金額を入力してください');state.mistakes++;saveScore();return}}
   if(state.payMethod==='現金'&&v<rem){toast('お預り金額が不足しています');state.mistakes++;saveScore();return}
   if(state.payMethod!=='現金'&&v<rem){toast('支払額が不足しています');state.mistakes++;saveScore();return}
 }
 let r=makeReceipt(v);
 state.history.unshift(r);state.history=state.history.slice(0,50);localStorage.setItem('posHistory',JSON.stringify(state.history));
 document.querySelector('#completeInfo').innerHTML=`<strong>${currentProfile().label}</strong><br>合計 <b>${yen(r.amount)}</b> / ${r.method.join(' + ')}`;
 document.querySelector('#receipt').innerHTML=`POS TRAINER<br>----------------<br>${state.cart.map(x=>`${x.n} x${x.q} ${yen(itemBase(x)-itemDiscount(x))}`).join('<br>')}<br>----------------<br>合計 ${yen(r.amount)}<br>お預り ${yen(v)}<br>おつり ${yen(Math.max(0,v-rem))}<br>${r.time} ${r.no}`;
 if(state.training){
   if(missions[state.missionIndex].check(r)){state.clears++;localStorage.setItem('posClears',state.clears);document.querySelector('#feedback').className='feedback ok';document.querySelector('#feedback').textContent='正解。指定された会計操作を完了しました。';}
   else{state.mistakes++;localStorage.setItem('posMistakes',state.mistakes);document.querySelector('#feedback').className='feedback ng';document.querySelector('#feedback').textContent='条件と異なる操作です。伝票内容・割引・支払方法を確認してください。'}
   updateScore();
 }
 renderHistory();
 if(state.individualMode && window.__remainingCart && window.__remainingCart.length){
   window.__remainingCartAfterPay=window.__remainingCart;
   state.individualMode=false;
 }
 show('complete')
}

function cashSales(){
 return state.history.filter(r=>(r.status||'会計')==='会計' && r.method.includes('現金')).reduce((s,r)=>s+r.amount,0)
   - state.history.filter(r=>r.status==='返品' && r.method.includes('現金')).reduce((s,r)=>s+r.amount,0);
}
function expectedCash(){return (state.openingFloat||0)+cashSales()+(state.cashAdjust||0)}
function updateCashCount(){
 let actual=[...document.querySelectorAll('.denom')].reduce((s,x)=>s+(+x.value||0)*(+x.dataset.denom),0);
 document.querySelector('#actualCash').textContent=yen(actual);
 document.querySelector('#expectedCash').textContent=yen(expectedCash());
 let d=actual-expectedCash();document.querySelector('#cashDiff').textContent=(d<0?'-':'')+yen(Math.abs(d));
 return {actual,d};
}
function openBusiness(){
 let v=+document.querySelector('#openingFloat').value||0;if(v<=0){toast('つり銭準備金を入力してください');return}
 state.businessOpen=true;state.openingFloat=v;state.cashAdjust=0;document.querySelector('#businessState').textContent='営業中';
 document.querySelector('#modeBadge').textContent='営業中';act();toast('開店処理を完了')
}
function closeBusiness(){
 let x=updateCashCount();
 if(x.d!==0){toast('現金過不足があります');state.mistakes++;saveScore();return}
 updateCarryUI();
 state.businessOpen=false;state.businessDayClosed=true;document.querySelector('#businessState').textContent='精算済み';
 document.querySelector('#modeBadge').textContent='自由練習';act();toast('精算しました');
}
function scanBarcode(){
 let code=document.querySelector('#barcodeInput').value.trim(),p=catalog.find(x=>x.b===code);
 if(!p){state.mistakes++;saveScore();toast('商品が見つかりません');return}
 add(p.id);document.querySelector('#barcodeInput').value='';toast(p.n+' を登録')
}
function openIndividual(){
 if(!state.cart.length){toast('商品がありません');return}
 state.individualIds=[];document.querySelector('#individualList').innerHTML=state.cart.map(r=>`<label class="split-row"><span>${r.n} × ${r.q}</span><span><input type="checkbox" class="individualCheck" data-id="${r.id}"> ${yen(itemBase(r)-itemDiscount(r))}</span></label>`).join('');
 document.querySelector('#individualTotal').textContent=yen(0);document.querySelector('#individualModal').classList.add('show')
}
function calcIndividual(){
 let ids=[...document.querySelectorAll('.individualCheck:checked')].map(x=>+x.dataset.id);state.individualIds=ids;
 let v=state.cart.filter(x=>ids.includes(x.id)).reduce((s,x)=>s+itemBase(x)-itemDiscount(x),0);
 document.querySelector('#individualTotal').textContent=yen(v);return v
}
function confirmIndividual(){
 let v=calcIndividual();if(v<=0){toast('商品を選択してください');return}
 let selected=state.cart.filter(x=>state.individualIds.includes(x.id));
 let remainCart=state.cart.filter(x=>!state.individualIds.includes(x.id));
 state.cart=selected;state.ticketDiscount={type:'none',value:0};state.splits=[];state.individualMode=true;
 document.querySelector('#individualModal').classList.remove('show');show('payment');state.input='0';renderPayment();
 window.__remainingCart=remainCart;act()
}
function returnTicket(i){
 let r=state.history[i];if(!r||r.status==='返品'||r.status==='取消'){toast('この伝票は処理済みです');return}
 let cash=r.method.includes('現金'),confirmed=document.querySelector('#paymentAppConfirmed')?.checked;
 if(!cash && !confirmed){state.mistakes++;saveScore();toast('先に決済アプリ側の返金確認をしてください');return}
 let ret={...r,time:new Date().toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'}),no:'#R'+String(Date.now()).slice(-5),sourceNo:r.no,status:'返品',amount:r.amount};
 state.history.unshift(ret);r.status='返品済';localStorage.setItem('posHistory',JSON.stringify(state.history));renderHistory();act();toast('返品伝票を作成しました')
}
function voidTicket(i){
 let r=state.history[i];if(!r||r.status==='返品'||r.status==='取消'){toast('処理できません');return}
 if(state.businessDayClosed){toast('営業日変更後は伝票削除・訂正できません');state.mistakes++;saveScore();return}
 r.status='取消';localStorage.setItem('posHistory',JSON.stringify(state.history));renderHistory();act();toast('レジ締め前伝票を取消しました')
}
const randomScenarios=[
 ['領収書を求められた','会計後に領収書を求められました。宛名・但し書きの店舗ルールを確認し、必要なら再発行操作を行う想定です。'],
 ['商品を1つだけ別会計','3商品中1商品だけ別会計にしたい客です。「個別会計」から対象商品を選びます。'],
 ['クレジット返品','カード決済済みの商品を返品したい客です。POS返品だけでなく決済アプリ側の取消・返金可否も確認します。'],
 ['現金が1,000円足りない','締め作業で理論残高より実在高が1,000円不足。再カウント、入力・出金記録、釣銭ミスを確認します。'],
 ['商品券＋現金','商品券500円を使い、残額を現金で払う客です。複数支払いを使います。'],
 ['バーコードが読めない','バーコード読取失敗。番号手入力または商品一覧から検索・選択する想定です。'],
 ['会計直後に打ち間違い','同一営業日内の誤会計です。レジ締め前伝票の取消・訂正を判断する想定です。'],
 ['10%値引き','対象伝票全体を10%引きする指示です。商品単位値引きと取り違えないようにします。']
];
function drawScenario(){
 let s=randomScenarios[Math.floor(Math.random()*randomScenarios.length)];
 document.querySelector('#randomScenarioTitle').textContent=s[0];document.querySelector('#randomScenarioText').textContent=s[1];act()
}




const realFlowCases=[
 {title:'現金ぴったり会計',text:'コーヒー1杯を現金350円で会計し、完了後に「注文入力・会計」へ戻る。',
  type:'sale',items:{'コーヒー':1},method:'現金',tender:350},
 {title:'QR全額決済',text:'カレー1個をQR決済（Airペイ）で全額会計。現金併用はしない。',
  type:'sale',items:{'カレー':1},method:'QR決済（Airペイ）'},
 {title:'Square系全額入力',text:'パスタ1個をクレジットカードで全額会計する。',
  type:'sale',items:{'パスタ':1},method:'クレジットカード'},
 {title:'当日訂正',text:'当日会計済み伝票を「レジ締め前伝票」相当の操作で取消し、訂正可能な状態にする。',
  type:'sameDayCorrection'},
 {title:'翌営業日修正',text:'営業日変更後の伝票は削除せず、取引履歴の金額修正として扱う。',
  type:'nextDayCorrection'},
 {title:'点検・精算',text:'レジ金額を確認し、翌営業日のつり銭準備金を指定して精算する。',
  type:'settlement'}
];

function startRealFlow(){
 state.realFlow={index:0,correct:0,errors:0,logs:[]}; nextRealFlow();
}
function nextRealFlow(){
 let g=state.realFlow;if(!g)return;
 if(g.index>=realFlowCases.length){
   document.querySelector('#realCaseTitle').textContent='完了';
   document.querySelector('#realCaseText').textContent=`${g.correct} / ${realFlowCases.length} 正解`;
   document.querySelector('#realFlowLog').innerHTML=g.logs.map(x=>`<div class="logrow">${x}</div>`).join('');
   show('realflow');return;
 }
 let c=realFlowCases[g.index];g.current=c;resetOrder();state.businessDayClosed=false;
 document.querySelector('#realCaseTitle').textContent=c.title;document.querySelector('#realCaseText').textContent=c.text;
 if(c.type==='sameDayCorrection'){gameSeedTicket('現金');show('history')}
 else if(c.type==='nextDayCorrection'){gameSeedTicket('現金');state.businessDayClosed=true;show('history')}
 else if(c.type==='settlement'){
   state.businessOpen=true;state.openingFloat=30000;state.cashAdjust=0;document.querySelector('#businessState').textContent='営業中';
   document.querySelectorAll('.denom').forEach(x=>x.value=0);
   let rest=expectedCash(),ds=[10000,5000,1000,500,100,50,10,5,1];
   ds.forEach(d=>{let el=document.querySelector(`.denom[data-denom="${d}"]`);if(el){let q=Math.floor(rest/d);el.value=q;rest-=q*d}});
   updateCashCount();show('operations')
 } else show('order');
}
function realJudge(){
 let g=state.realFlow;if(!g){toast('開始してください');return}
 let c=g.current,ok=false,why='';
 if(c.type==='sale'){
   let r=state.history[0];ok=!!r&&gameItemsMatch(r.items,c.items)&&r.method.includes(c.method);
   if(c.tender)ok=ok&&r.tender>=c.tender;
   if(c.method==='QR決済（Airペイ）')ok=ok&&!(r.splits||[]).some(x=>x.method==='現金');
   why='商品・支払方法・決済フロー';
 }else if(c.type==='sameDayCorrection'){
   let r=state.history.find(x=>x.status==='取消');ok=!!r;why='当日取消';
 }else if(c.type==='nextDayCorrection'){
   let r=state.history.find(x=>x.status==='金額修正');ok=!!r;why='翌営業日の金額修正';
 }else if(c.type==='settlement'){
   let cc=updateCashCount();ok=!state.businessOpen&&cc.d===0&&state.carryMode;why='点検・精算';
 }
 if(ok){g.correct++;g.logs.unshift('✓ '+c.title)}
 else{g.errors++;g.logs.unshift('✗ '+c.title+'：'+why+'を確認')}
 g.index++;document.querySelector('#realFlowLog').innerHTML=g.logs.map(x=>`<div class="logrow">${x}</div>`).join('');
 nextRealFlow();
}
function updateCarryUI(){
 let actual=updateCashCount().actual, carry=0;
 if(state.carryMode==='指定')carry=Math.min(actual,+document.querySelector('#nextFloat').value||0);
 if(state.carryMode==='全額繰越')carry=actual;
 if(state.carryMode==='なし')carry=0;
 document.querySelector('#carryInputWrap').style.display=state.carryMode==='指定'?'flex':'none';
 document.querySelector('#depositAmount').textContent=yen(Math.max(0,actual-carry));
 document.querySelectorAll('[data-carry]').forEach(b=>b.classList.toggle('active',b.dataset.carry===state.carryMode));
}
function modifyNextDayAmount(i){
 let r=state.history[i];if(!r)return;
 if(!state.businessDayClosed){toast('翌営業日以降の訓練時のみ使用');return}
 r.status='金額修正';r.amount=Math.max(0,r.amount-100);
 localStorage.setItem('posHistory',JSON.stringify(state.history));renderHistory();act();toast('取引履歴で金額を修正しました')
}

const errorCases=[
 {title:'数量ミス防止',text:'カフェラテを2杯。クレジットで会計。数量を必ず確認してください。',
  expect:{items:{'カフェラテ':2},method:'クレジットカード',precheck:true,paycheck:true}},
 {title:'二重登録防止',text:'コーヒー1杯だけ。現金500円。2回押さないよう注意。',
  expect:{items:{'コーヒー':1},method:'現金',minTender:500,precheck:true}},
 {title:'伝票値引き忘れ',text:'カレー＋紅茶。伝票全体10%引き。QR決済。',
  expect:{items:{'カレー':1,'紅茶':1},method:'QR決済（Airペイ）',ticketDisc:'10%',precheck:true}},
 {title:'商品値引き位置ミス',text:'サラダだけ20%引き。伝票全体ではなく商品単位。クレジット。',
  expect:{items:{'サラダ':1},method:'クレジットカード',itemDiscountPct:20,precheck:true}},
 {title:'支払方法変更',text:'最初は現金と言われたが、会計直前にクレジットへ変更。クレジットで完了してください。',
  expect:{items:{'プリン':1},method:'クレジットカード',paycheck:true}},
 {title:'預り金不足',text:'サンドイッチ1個。現金1,000円を預かる。500円と誤入力しない。',
  expect:{items:{'サンドイッチ':1},method:'現金',minTender:1000,paycheck:true}},
 {title:'領収書忘れ',text:'コーヒー豆1個を現金2,000円。領収書も必要です。',
  expect:{items:{'コーヒー豆 200g':1},method:'現金',minTender:2000,receipt:true}},
 {title:'キャッシュレス返品',text:'クレジット会計を返品。決済アプリ側の取消確認も必要。',
  expect:{special:'returnCard'}},
 {title:'現金返品',text:'現金会計を返品。返金額と返品伝票を確認。',
  expect:{special:'returnCash'}},
 {title:'閉店過不足',text:'閉店処理。金種を数え、過不足0円で精算。',
  expect:{special:'closing'}}
];

function errorSeedTicket(method){
 let n=method==='現金'?'プリン':'コーヒー', amt=method==='現金'?390:350;
 let r={time:new Date().toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'}),no:'#E'+String(Date.now()).slice(-5),
 amount:amt,tender:method==='現金'?500:amt,items:{[n]:1},method:[method],splits:[],ticketDisc:'なし',
 itemDiscountYen:0,itemDiscountPct:0,status:'会計'};
 state.history.unshift(r);localStorage.setItem('posHistory',JSON.stringify(state.history));renderHistory();
}
function startErrorDrill(){
 let cases=[...errorCases].sort(()=>Math.random()-.5);
 state.errorDrill={cases,index:0,correct:0,mistakes:0,streak:0,breakdown:{}};
 errorNext();
}
function errorNext(){
 let g=state.errorDrill;if(!g)return;
 if(g.index>=g.cases.length){document.querySelector('#errorCaseNo').textContent='完了';document.querySelector('#errorCaseTitle').textContent='ドリル終了';document.querySelector('#errorCaseText').textContent='ミス内訳を確認してください。';show('errordrill');return}
 let c=g.cases[g.index];g.current=c;resetOrder();
 state.precheck=false;state.paycheck=false;state.receiptIssued=false;
 let pc=document.querySelector('#precheck');if(pc)pc.checked=false;
 let py=document.querySelector('#paycheck');if(py)py.checked=false;
 document.querySelector('#errorCaseNo').textContent=`${g.index+1} / ${g.cases.length}`;
 document.querySelector('#errorCaseTitle').textContent=c.title;
 document.querySelector('#errorCaseText').textContent=c.text;
 document.querySelector('#auditResults').innerHTML='<div class="small">操作後に「監査する」を押してください。</div>';
 if(c.expect.special==='returnCard'){errorSeedTicket('クレジットカード');show('history')}
 else if(c.expect.special==='returnCash'){errorSeedTicket('現金');show('history')}
 else if(c.expect.special==='closing'){
   state.businessOpen=true;state.openingFloat=30000;state.cashAdjust=0;document.querySelector('#businessState').textContent='営業中';
   document.querySelectorAll('.denom').forEach(x=>x.value=0);
   let rest=expectedCash(),ds=[10000,5000,1000,500,100,50,10,5,1];
   ds.forEach(d=>{let el=document.querySelector(`.denom[data-denom="${d}"]`);if(el){let q=Math.floor(rest/d);el.value=q;rest-=q*d}});
   updateCashCount();show('operations')
 } else show('order');
 updateErrorHUD();
}
function markIssue(arr,label,ok){
 arr.push(`<div class="issue ${ok?'ok':'ng'}"><strong>${ok?'✓':'✗'} ${label}</strong></div>`);
 return ok;
}
function addBreakdown(key){let g=state.errorDrill;g.breakdown[key]=(g.breakdown[key]||0)+1}
function auditErrorCase(){
 let g=state.errorDrill;if(!g){toast('ドリルを開始してください');return}
 let e=g.current.expect,issues=[],ok=true,r=state.history[0];
 if(e.special==='returnCard'){
   let x=state.history.some(v=>v.status==='返品'&&v.method.includes('クレジットカード'));
   let y=document.querySelector('#paymentAppConfirmed').checked;
   ok=markIssue(issues,'返品伝票',x)&&ok;ok=markIssue(issues,'決済アプリ側の取消確認',y)&&ok;
   if(!x)addBreakdown('返品処理');if(!y)addBreakdown('決済側取消');
 }else if(e.special==='returnCash'){
   let x=state.history.some(v=>v.status==='返品'&&v.method.includes('現金'));
   ok=markIssue(issues,'現金返品伝票',x)&&ok;if(!x)addBreakdown('返品処理');
 }else if(e.special==='closing'){
   let cc=updateCashCount(),x=!state.businessOpen,y=cc.d===0;
   ok=markIssue(issues,'閉店処理',x)&&ok;ok=markIssue(issues,'現金過不足0円',y)&&ok;
   if(!x)addBreakdown('閉店忘れ');if(!y)addBreakdown('現金過不足');
 }else{
   let has=!!r;ok=markIssue(issues,'会計完了',has)&&ok;
   if(has){
     let im=gameItemsMatch(r.items,e.items);ok=markIssue(issues,'商品・数量',im)&&ok;if(!im)addBreakdown('商品/数量');
     if(e.method){let x=r.method.includes(e.method);ok=markIssue(issues,'支払方法',x)&&ok;if(!x)addBreakdown('支払方法')}
     if(e.minTender){let x=r.tender>=e.minTender;ok=markIssue(issues,'預り金',x)&&ok;if(!x)addBreakdown('預り金')}
     if(e.ticketDisc){let x=r.ticketDisc===e.ticketDisc;ok=markIssue(issues,'伝票割引',x)&&ok;if(!x)addBreakdown('伝票割引')}
     if(e.itemDiscountPct){let x=(r.itemDiscountPct||0)===e.itemDiscountPct;ok=markIssue(issues,'商品単位割引',x)&&ok;if(!x)addBreakdown('商品割引')}
   }
   if(e.precheck){let x=!!state.precheck;ok=markIssue(issues,'会計前の商品確認',x)&&ok;if(!x)addBreakdown('確認不足')}
   if(e.paycheck){let x=!!state.paycheck;ok=markIssue(issues,'支払前確認',x)&&ok;if(!x)addBreakdown('支払確認不足')}
   if(e.receipt){let x=!!state.receiptIssued;ok=markIssue(issues,'領収書発行',x)&&ok;if(!x)addBreakdown('領収書忘れ')}
 }
 if(ok){g.correct++;g.streak++;toast('監査OK')}
 else{g.mistakes++;g.streak=0;toast('ミスを検出')}
 document.querySelector('#auditResults').innerHTML=issues.join('');
 g.index++;updateErrorHUD();setTimeout(errorNext,250);
}
function updateErrorHUD(){
 let g=state.errorDrill;if(!g)return;
 document.querySelector('#errorCorrect').textContent=g.correct;document.querySelector('#errorMistakes').textContent=g.mistakes;document.querySelector('#errorStreak').textContent=g.streak;
 let entries=Object.entries(g.breakdown).sort((a,b)=>b[1]-a[1]);
 document.querySelector('#errorBreakdown').innerHTML=entries.length?entries.map(([k,v])=>`<div class="sumrow"><span>${k}</span><strong>${v}</strong></div>`).join(''):'<div class="small">まだミスはありません。</div>';
}

const timedCustomers=[
 {name:'会社員',avatar:'👨‍💼',items:{'コーヒー':1,'サンドイッチ':1},method:'現金',tender:1000,dining:'持ち帰り',bag:'あり',taxRate:8,receipt:false},
 {name:'学生',avatar:'🧑‍🎓',items:{'カフェラテ':1,'チーズケーキ':1},method:'クレジットカード',dining:'店内',bag:'なし',taxRate:10,receipt:true},
 {name:'主婦',avatar:'👩',items:{'サラダ':1,'オレンジジュース':1},method:'QR決済（Airペイ）',dining:'持ち帰り',bag:'あり',taxRate:8,receipt:false},
 {name:'年配客',avatar:'👴',items:{'プリン':2},method:'現金',tender:1000,dining:'店内',bag:'なし',taxRate:10,receipt:true},
 {name:'会社員',avatar:'🧑‍💼',items:{'パスタ':1},method:'電子マネー',dining:'店内',bag:'なし',taxRate:10,receipt:false},
 {name:'観光客',avatar:'🧳',items:{'コーヒー豆 200g':1},method:'現金',tender:2000,dining:'持ち帰り',bag:'あり',taxRate:8,receipt:true},
 {name:'親子',avatar:'👪',items:{'アイス':2,'紅茶':1},method:'QR決済（Airペイ）',dining:'店内',bag:'なし',taxRate:10,receipt:false},
 {name:'学生',avatar:'🧑‍🎓',items:{'カレー':1},method:'現金',tender:1000,dining:'店内',bag:'なし',taxRate:10,receipt:false}
];
function randomTimedCustomer(){
 let c=JSON.parse(JSON.stringify(timedCustomers[Math.floor(Math.random()*timedCustomers.length)]));
 c.id=Date.now()+Math.random(); return c;
}
function formatMMSS(sec){let m=Math.floor(sec/60),s=sec%60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}
function itemTotalMap(items){return Object.entries(items).reduce((s,[n,q])=>s+(catalog.find(x=>x.n===n)?.p||0)*q,0)}
function expectedChangeFor(c){
 if(c.method!=='現金')return 0;
 return Math.max(0,(c.tender||0)-itemTotalMap(c.items));
}
function startTimedMode(){
 if(state.timedMode?.timer)clearInterval(state.timedMode.timer);
 state.timedMode={seconds:300,done:0,errors:0,score:100,queue:[randomTimedCustomer(),randomTimedCustomer(),randomTimedCustomer()],current:null,timer:null};
 state.changeSelection=0;state.receiptIssued=false;state.receiptReprinted=false;
 nextTimedCustomer();
 state.timedMode.timer=setInterval(()=>{
   let g=state.timedMode;if(!g)return;g.seconds--;renderTimedHUD();
   if(g.seconds<=0){clearInterval(g.timer);finishTimedMode()}
   if(g.queue.length<4 && Math.random()<.35)g.queue.push(randomTimedCustomer());
   renderTimedQueue();
 },1000);
}
function nextTimedCustomer(){
 let g=state.timedMode;if(!g)return;
 if(!g.queue.length)g.queue.push(randomTimedCustomer());
 g.current=g.queue.shift();
 resetOrder();state.dining='店内';state.bag='なし';state.taxRate=10;state.changeSelection=0;state.receiptIssued=false;state.receiptReprinted=false;
 let c=g.current;
 document.querySelector('#timedAvatar').textContent=c.avatar;
 document.querySelector('#timedCustomerName').textContent=c.name;
 document.querySelector('#timedRequest').textContent=`${Object.entries(c.items).map(([n,q])=>`${n}×${q}`).join('、')} / ${c.method}${c.method==='現金'?' '+yen(c.tender):''}`;
 document.querySelector('#timedConditions').textContent=`${c.dining}・袋${c.bag}・税率${c.taxRate}%${c.receipt?'・領収書あり':''}`;
 syncTimedOptions();renderTimedQueue();renderTimedHUD();show('order');
}
function syncTimedOptions(){
 document.querySelectorAll('[data-dining]').forEach(b=>b.classList.toggle('active',b.dataset.dining===state.dining));
 document.querySelectorAll('[data-bag]').forEach(b=>b.classList.toggle('active',b.dataset.bag===state.bag));
 document.querySelectorAll('[data-tax]').forEach(b=>b.classList.toggle('active',+b.dataset.tax===state.taxRate));
 document.querySelector('#requiredChange').textContent=yen(state.timedMode?.current?expectedChangeFor(state.timedMode.current):0);
 document.querySelector('#selectedChange').textContent=yen(state.changeSelection);
}
function renderTimedQueue(){
 let g=state.timedMode;if(!g)return;
 document.querySelector('#timedQueueCount').textContent=g.queue.length;
 document.querySelector('#timedQueue').innerHTML=g.queue.slice(0,5).map((c,i)=>`<div class="queue-item"><span>${i+1}. ${c.name}</span><span class="small">${Object.keys(c.items).join(' / ')}</span></div>`).join('')||'<div class="small">待ちなし</div>';
}
function renderTimedHUD(){
 let g=state.timedMode;if(!g)return;
 let el=document.querySelector('#timedClock');el.textContent=formatMMSS(g.seconds);el.classList.toggle('warn',g.seconds<=60);
 document.querySelector('#timedDone').textContent=g.done;document.querySelector('#timedScore').textContent=g.score;document.querySelector('#timedErrors').textContent=g.errors;
 document.querySelector('#timedProgress').style.width=((300-g.seconds)/300*100)+'%';
}
function selectTimedOption(type,val){
 if(type==='dining')state.dining=val;if(type==='bag')state.bag=val;if(type==='tax')state.taxRate=+val;syncTimedOptions();act()
}
function addChangeCoin(v){state.changeSelection+=v;syncTimedOptions();act()}
function clearChangeSelection(){state.changeSelection=0;syncTimedOptions()}
function timedCurrentReceipt(){
 return state.history[0]||null;
}
function timedJudge(){
 let g=state.timedMode;if(!g||!g.current){toast('時間制モードを開始してください');return}
 let c=g.current,r=timedCurrentReceipt(),ok=true,miss=[];
 if(!r || !gameItemsMatch(r.items,c.items)){ok=false;miss.push('商品/数量')}
 if(r && !r.method.includes(c.method)){ok=false;miss.push('支払方法')}
 if(c.method==='現金' && r && r.tender<c.tender){ok=false;miss.push('預り金')}
 if(state.dining!==c.dining){ok=false;miss.push('店内/持ち帰り')}
 if(state.bag!==c.bag){ok=false;miss.push('レジ袋')}
 if(state.taxRate!==c.taxRate){ok=false;miss.push('税率')}
 let need=expectedChangeFor(c);
 if(c.method==='現金' && state.changeSelection!==need){ok=false;miss.push('釣銭金種')}
 if(c.receipt && !state.receiptIssued){ok=false;miss.push('領収書')}
 if(ok){g.done++;g.score=Math.min(100,g.score+1);toast('処理OK')}
 else{g.errors++;g.score=Math.max(0,g.score-8);toast('ミス: '+miss.join('・'))}
 nextTimedCustomer();
}
function skipTimed(){
 let g=state.timedMode;if(!g)return;g.errors++;g.score=Math.max(0,g.score-12);nextTimedCustomer()
}
function finishTimedMode(){
 let g=state.timedMode;if(!g)return;
 document.querySelector('#timedResult').style.display='block';
 document.querySelector('#timedResult').textContent=`終了：${g.done}件処理 / ミス${g.errors}件 / スコア${g.score}点`;
 show('timedmode')
}

const staffCases=[
 {name:'会社員',avatar:'👨‍💼',request:'コーヒー1杯を現金500円で。',expect:{items:{'コーヒー':1},method:'現金',minTender:500}},
 {name:'学生',avatar:'🧑‍🎓',request:'カフェラテ2杯をクレジットで。',expect:{items:{'カフェラテ':2},method:'クレジットカード'}},
 {name:'常連客',avatar:'🙂',request:'カレーと紅茶を伝票10%引き、QR決済で。',expect:{items:{'カレー':1,'紅茶':1},method:'QR決済（Airペイ）',ticketDisc:'10%'}},
 {name:'買い物客',avatar:'🛍️',request:'パスタを商品券500円＋残額現金で。',expect:{items:{'パスタ':1},method:'現金',split:{method:'商品券',amount:500}}},
 {name:'年配客',avatar:'👴',request:'コーヒー豆を100円引き、現金で。',expect:{items:{'コーヒー豆 200g':1},method:'現金',itemDiscountYen:100}},
 {name:'急いでいる客',avatar:'🏃',request:'バーコード 490000000009 の商品を電子マネーで。',expect:{items:{'チーズケーキ':1},method:'電子マネー'}},
 {name:'家族連れ',avatar:'👪',request:'オレンジジュース2杯とアイス1個をQR決済で。',expect:{items:{'オレンジジュース':2,'アイス':1},method:'QR決済（Airペイ）'}},
 {name:'クーポン客',avatar:'🎟️',request:'サラダを商品単位20%引き、クレジットで。',expect:{items:{'サラダ':1},method:'クレジットカード',itemDiscountPct:20}},
 {name:'返品客',avatar:'↩️',request:'直前の現金会計を返品してください。',expect:{special:'returnCash'}},
 {name:'カード返品客',avatar:'💳',request:'クレジット購入分を返品。決済アプリ側も確認してください。',expect:{special:'returnCard'}},
 {name:'店長',avatar:'🧑‍💼',request:'閉店です。現金過不足0円で精算してください。',expect:{special:'closing'}}
];

function gameSeedTicket(method){
 let n=method==='現金'?'プリン':'コーヒー', amount=method==='現金'?390:350;
 let r={time:new Date().toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'}),no:'#S'+String(Date.now()).slice(-5),
 amount,tender:method==='現金'?500:amount,items:{[n]:1},method:[method],splits:[],ticketDisc:'なし',itemDiscountYen:0,itemDiscountPct:0,status:'会計'};
 state.history.unshift(r);localStorage.setItem('posHistory',JSON.stringify(state.history));renderHistory();
}
function gamePrepare(c){
 resetOrder();
 if(c.expect.special==='returnCash'){gameSeedTicket('現金');show('history')}
 else if(c.expect.special==='returnCard'){gameSeedTicket('クレジットカード');show('history')}
 else if(c.expect.special==='closing'){
   state.businessOpen=true;state.openingFloat=30000;state.cashAdjust=0;document.querySelector('#businessState').textContent='営業中';
   document.querySelectorAll('.denom').forEach(x=>x.value=0);
   let rest=expectedCash(), ds=[10000,5000,1000,500,100,50,10,5,1];
   ds.forEach(d=>{let el=document.querySelector(`.denom[data-denom="${d}"]`);if(el){let q=Math.floor(rest/d);el.value=q;rest-=q*d}});
   updateCashCount();show('operations')
 } else show('order');
}
function gameItemsMatch(got,want){return Object.entries(want||{}).every(([n,q])=>(got||{})[n]===q)}
function startStaffGame(){
 let cases=[...staffCases].sort(()=>Math.random()-.5).slice(0,10);
 state.staffGame={cases,index:0,correct:0,errors:0,score:100,startActions:state.actions,caseStartActions:state.actions,log:[]};
 document.querySelector('#gameFinal').style.display='none';gameNext();
}
function gameNext(){
 let g=state.staffGame;if(!g)return;if(g.index>=g.cases.length){gameFinish();return}
 let c=g.cases[g.index];g.caseStartActions=state.actions;
 document.querySelector('#customerAvatar').textContent=c.avatar;document.querySelector('#customerSeq').textContent=`${g.index+1}人目 / ${g.cases.length}`;
 document.querySelector('#customerName').textContent=c.name;document.querySelector('#customerRequest').textContent=c.request;gameHUD();gamePrepare(c);
}
function judgeStaffGame(){
 let g=state.staffGame;if(!g){toast('研修を開始してください');return}
 let c=g.cases[g.index], e=c.expect, r=state.history[0], ok=false, why='';
 if(e.special==='returnCash'){ok=state.history.some(x=>x.status==='返品'&&x.method.includes('現金'));why='現金返品'}
 else if(e.special==='returnCard'){ok=state.history.some(x=>x.status==='返品'&&x.method.includes('クレジットカード'))&&document.querySelector('#paymentAppConfirmed').checked;why='カード返品＋決済確認'}
 else if(e.special==='closing'){let cc=updateCashCount();ok=!state.businessOpen&&cc.d===0;why='閉店＋過不足0円'}
 else if(r){
   ok=gameItemsMatch(r.items,e.items)&&(!e.method||r.method.includes(e.method));
   if(e.minTender)ok=ok&&r.tender>=e.minTender;if(e.ticketDisc)ok=ok&&r.ticketDisc===e.ticketDisc;
   if(e.split)ok=ok&&r.splits?.some(x=>x.method===e.split.method&&x.amount===e.split.amount);
   if(e.itemDiscountYen)ok=ok&&(r.itemDiscountYen||0)>=e.itemDiscountYen;
   if(e.itemDiscountPct)ok=ok&&(r.itemDiscountPct||0)===e.itemDiscountPct;
   why='商品・数量・割引・支払条件';
 }
 let ops=state.actions-g.caseStartActions;
 if(ok){g.correct++;g.log.unshift(`✓ ${c.request}（${ops}操作）`)}
 else{g.errors++;g.score=Math.max(0,g.score-10);g.log.unshift(`✗ ${c.request}：${why}を確認`)}
 if(ops>18){g.score=Math.max(0,g.score-2);g.log.unshift(`△ 操作数 ${ops}：やや多い`)}
 g.index++;document.querySelector('#gameLog').innerHTML=g.log.map(x=>`<div class="logrow">${x}</div>`).join('');gameHUD();
 if(g.index>=g.cases.length)gameFinish();else gameNext();
}
function gameHUD(){
 let g=state.staffGame;if(!g)return;let done=Math.max(1,g.correct+g.errors);
 document.querySelector('#gameProgressText').textContent=`${Math.min(g.index,g.cases.length)} / ${g.cases.length}`;
 document.querySelector('#gameProgressBar').style.width=`${Math.min(100,g.index/g.cases.length*100)}%`;
 document.querySelector('#gameScore').textContent=g.score;document.querySelector('#gameCorrect').textContent=g.correct;
 document.querySelector('#gameErrors').textContent=g.errors;document.querySelector('#gameAvgActions').textContent=Math.round((state.actions-g.startActions)/done);
}
function gameFinish(){
 let g=state.staffGame, acc=Math.round(g.correct/Math.max(1,g.correct+g.errors)*100), avg=Math.round((state.actions-g.startActions)/Math.max(1,g.correct+g.errors));
 let final=Math.max(0,Math.min(100,Math.round(g.score*.6+acc*.4-(avg>20?5:0))));
 let grade=final>=90?'A':final>=75?'B':final>=60?'C':'D';
 document.querySelector('#gameScore').textContent=final;document.querySelector('#gameGrade').textContent=grade;
 document.querySelector('#gameFinalText').textContent=`${final}点 / 正解 ${g.correct}件 / ミス ${g.errors}件`;
 document.querySelector('#gameFinal').style.display='block';document.querySelector('#customerSeq').textContent='研修終了';
 document.querySelector('#customerRequest').textContent='最終評価を確認してください。';show('staffgame');
}

function resetOrder(){
 state.cart=[];state.ticketDiscount={type:'none',value:0};state.splits=[];state.input='0';state.payMethod=currentProfile().methods[0];
 state.precheck=false;state.paycheck=false;state.targetDiscount=null;
 let pc=document.querySelector('#precheck'),py=document.querySelector('#paycheck');if(pc)pc.checked=false;if(py)py.checked=false;
 document.querySelector('#discountModal')?.classList.remove('show');document.querySelector('#individualModal')?.classList.remove('show');
 document.querySelector('#confirmModal')?.classList.remove('show');document.querySelector('#detailModal')?.classList.remove('show');closeSheet?.();
 renderCart()
}

function showTransactionDetail(i){
 let r=state.history[i];if(!r)return;state.lastDetailNo=r.no;
 document.querySelector('#detailContent').innerHTML=`
   <div class="tx-detail">
    <div class="row"><span>伝票</span><strong>${r.no}</strong></div>
    <div class="row"><span>時刻</span><strong>${r.time}</strong></div>
    <div class="row"><span>状態</span><strong>${r.status||'会計'}</strong></div>
    <div class="row"><span>合計</span><strong>${yen(r.amount)}</strong></div>
    <div class="row"><span>支払</span><strong>${r.method.join(' + ')}</strong></div>
   </div>
   <hr style="border:0;border-top:1px solid var(--line)">
   ${Object.entries(r.items||{}).map(([n,q])=>`<div class="sumrow"><span>${n} × ${q}</span><span></span></div>`).join('')}
 `;
 document.querySelector('#detailModal').classList.add('show')
}
function renderHistory(){
 let body=document.querySelector('#historyBody');
 body.innerHTML=state.history.length?state.history.map((r,i)=>`<tr>
   <td>${r.time}</td><td>${r.no}</td><td>${yen(r.amount)}</td><td>${r.method.join(' + ')}</td>
   <td>${r.status||'会計'}</td>
   <td>
     <button class="linkbtn" data-return="${i}">返品</button>
     <button class="linkbtn danger" data-void="${i}">レジ締め前取消</button>
     <button class="linkbtn" data-detail="${i}">詳細</button><button class="linkbtn" data-adjust="${i}">金額修正</button>
   </td>
 </tr>`).join(''):'<tr><td colspan="6">伝票はありません</td></tr>'
}
function renderMission(){let m=missions[state.missionIndex];document.querySelector('#missionTitle').textContent=m.title;document.querySelector('#missionText').textContent=m.text;
 document.querySelector('#missionSteps').innerHTML='<ol><li>注文を入力</li><li>必要なら数量・割引を設定</li><li>支払いへ進む</li><li>指定された支払方法で会計</li></ol>';updateScore()}
function updateScore(){document.querySelector('#clearCount').textContent=state.clears;document.querySelector('#mistakeCount').textContent=state.mistakes;document.querySelector('#actionCount').textContent=state.actions;
 let den=state.clears+state.mistakes;document.querySelector('#accuracy').textContent=(den?Math.round(state.clears/den*100):100)+'%'}
function saveScore(){localStorage.setItem('posMistakes',state.mistakes);updateScore()}
document.addEventListener('click',e=>{
 let b=e.target.closest('button');if(!b)return;
 if(b.dataset.pos){setPosMode(b.dataset.pos);return}
 if(b.dataset.modeNav!==undefined){
   document.querySelectorAll('[data-mode-nav]').forEach(x=>x.classList.remove('active'));b.classList.add('active');
   let idx=+b.dataset.modeNav;
   if(state.posMode==='air'&&idx===2){openIndividual();return}
   if((state.posMode==='smaregi'||state.posMode==='square')&&idx===2){show('history');return}
   toast(currentProfile().nav[idx]);return
 }
 if(b.dataset.screen){show(b.dataset.screen);return}
 if(b.dataset.jump){show(b.dataset.jump);return}
 if(b.dataset.cat){state.cat=b.dataset.cat;renderCatalog();act();return}
 if(b.dataset.id&&b.classList.contains('product')){add(+b.dataset.id);return}
 if(b.dataset.op){let r=state.cart.find(x=>x.id==b.dataset.id);act();if(b.dataset.op==='plus')r.q++;if(b.dataset.op==='minus'){r.q--;if(r.q<=0)state.cart=state.cart.filter(x=>x!==r)}if(b.dataset.op==='del')state.cart=state.cart.filter(x=>x!==r);if(b.dataset.op==='disc')return openDiscount(+b.dataset.id);renderCart();return}
 if(b.dataset.carry){state.carryMode=b.dataset.carry;updateCarryUI();act();return}
 if(b.dataset.dining){selectTimedOption('dining',b.dataset.dining);return}
 if(b.dataset.bag){selectTimedOption('bag',b.dataset.bag);return}
 if(b.dataset.tax){selectTimedOption('tax',b.dataset.tax);return}
 if(b.dataset.changeCoin){addChangeCoin(+b.dataset.changeCoin);return}
 if(b.dataset.method){
   let next=b.dataset.method;
   if(currentProfile().qrNoSplit && next==='QR決済（Airペイ）' && state.splits.length){
      toast('QR決済（Airペイ）は他の支払い方法と併用できません');state.mistakes++;saveScore();return;
   }
   state.payMethod=next;
   state.input=state.payMethod==='現金'?'0':String(remaining());
   renderPayment();act();return
 }
 if(b.dataset.cash){let v=b.dataset.cash==='exact'||b.dataset.cash==='remaining'?remaining():+b.dataset.cash;setCash(v);return}
 if(b.dataset.disc){applyDisc('pct',+b.dataset.disc);return}
 if(b.dataset.discYen){applyDisc('yen',+b.dataset.discYen);return}
 if(b.dataset.key){inputNum(b.dataset.key);return}
 if(b.dataset.return!==undefined){returnTicket(+b.dataset.return);return}
 if(b.dataset.void!==undefined){let i=+b.dataset.void;askConfirm('伝票を取消','このレジ締め前伝票を取消します。',()=>{voidTicket(i);closeConfirm()});return}
 if(b.dataset.detail!==undefined){showTransactionDetail(+b.dataset.detail);return}
 if(b.dataset.adjust!==undefined){modifyNextDayAmount(+b.dataset.adjust);return}
});


document.querySelector('#changeCoins').innerHTML=[500,100,50,10,5,1].map(v=>`<button data-change-coin="${v}">${yen(v)}</button>`).join('');
document.querySelector('#startTimedMode').onclick=startTimedMode;
document.querySelector('#timedGoOrder').onclick=()=>show('order');
document.querySelector('#timedGoPay').onclick=()=>{if(state.cart.length){show('payment');renderPayment()}else toast('先に商品を入力してください')};
document.querySelector('#timedServe').onclick=timedJudge;
document.querySelector('#timedSkip').onclick=skipTimed;
document.querySelector('#clearChangeCoins').onclick=clearChangeSelection;
document.querySelector('#issueReceipt').onclick=()=>{state.receiptIssued=true;act();toast('領収書を発行しました')};
document.querySelector('#reprintReceipt').onclick=()=>{state.receiptReprinted=true;act();toast('レシートを再発行しました')};

document.querySelector('#startStaffGame').onclick=startStaffGame;
document.querySelector('#restartStaffGame').onclick=startStaffGame;
document.querySelector('#gameJudge').onclick=judgeStaffGame;
document.querySelector('#gameGoOrder').onclick=()=>show('order');
document.querySelector('#gameGoHistory').onclick=()=>show('history');
document.querySelector('#gameGoOps').onclick=()=>show('operations');
document.querySelector('#scanBarcode').onclick=scanBarcode;
document.querySelector('#barcodeInput').addEventListener('keydown',e=>{if(e.key==='Enter')scanBarcode()});
document.querySelector('#individualPay').onclick=openIndividual;
document.querySelector('#individualList').addEventListener('change',calcIndividual);
document.querySelector('#confirmIndividual').onclick=confirmIndividual;
document.querySelector('#closeIndividual').onclick=()=>document.querySelector('#individualModal').classList.remove('show');
document.querySelector('#openRegister').onclick=openBusiness;
document.querySelector('#closeRegister').onclick=closeBusiness;
document.querySelector('#cashInBtn').onclick=()=>{state.cashAdjust+=1000;updateCashCount();act();toast('入金を記録')};
document.querySelector('#cashOutBtn').onclick=()=>{state.cashAdjust-=1000;updateCashCount();act();toast('出金を記録')};
document.querySelectorAll('.denom').forEach(x=>x.addEventListener('input',updateCashCount));
document.querySelector('#randomScenario').onclick=drawScenario;

document.querySelector('#precheck').addEventListener('change',e=>state.precheck=e.target.checked);
document.querySelector('#paycheck').addEventListener('change',e=>state.paycheck=e.target.checked);

document.querySelector('#startPosTraining').onclick=startPosTraining;
document.querySelector('#judgePosTraining').onclick=judgePosTraining;
document.querySelector('#posTrainGoOrder').onclick=()=>show('order');
document.querySelector('#posTrainGoHistory').onclick=()=>show('history');
document.querySelector('#posTrainGoOps').onclick=()=>show('operations');

document.querySelector('#startRealFlow').onclick=startRealFlow;
document.querySelector('#realGoOrder').onclick=()=>show('order');
document.querySelector('#realGoHistory').onclick=()=>show('history');
document.querySelector('#realGoOps').onclick=()=>show('operations');
document.querySelector('#realJudge').onclick=realJudge;
document.querySelector('#nextFloat').addEventListener('input',updateCarryUI);

document.querySelector('#startErrorDrill').onclick=startErrorDrill;
document.querySelector('#errorGoOrder').onclick=()=>show('order');
document.querySelector('#errorGoHistory').onclick=()=>show('history');
document.querySelector('#errorJudge').onclick=auditErrorCase;

document.querySelector('#openOrderMenu').onclick=openSheet;
document.querySelector('#closeOrderMenu').onclick=closeSheet;
document.querySelector('#sheetBackdrop').onclick=closeSheet;
document.querySelector('#sheetTicketDiscount').onclick=()=>{closeSheet();openDiscount()};
document.querySelector('#sheetIndividual').onclick=()=>{closeSheet();openIndividual()};
document.querySelector('#sheetClear').onclick=()=>{closeSheet();document.querySelector('#clearOrder').click()};
document.querySelector('#sheetTraining').onclick=()=>{closeSheet();show('training')};
document.querySelector('#confirmCancel').onclick=closeConfirm;
document.querySelector('#confirmOk').onclick=()=>{if(pendingConfirm)pendingConfirm()};
document.querySelector('#closeDetail').onclick=()=>document.querySelector('#detailModal').classList.remove('show');
document.querySelector('#backOrder2').onclick=()=>{show('order');act()};

document.querySelector('#ticketDiscount').onclick=()=>openDiscount();
document.querySelector('#closeDiscount').onclick=()=>document.querySelector('#discountModal').classList.remove('show');
document.querySelector('#clearOrder').onclick=()=>askConfirm('注文を削除','入力中の商品をすべて削除します。',()=>{act();resetOrder();closeConfirm()});
document.querySelector('#toPay').onclick=()=>{show('payment');state.input=String(remaining());renderPayment();act()};
document.querySelector('#backOrder').onclick=()=>{show('order');act()};
document.querySelector('#clearCash').onclick=()=>setCash(0);
document.querySelector('#addSplit').onclick=addSplit;
document.querySelector('#checkout').onclick=()=>{
 if(!state.precheck||!state.paycheck){
   askConfirm('確認して会計','商品・数量・支払方法の確認チェックが未完了です。このまま会計しますか？',()=>{closeConfirm();checkout()});
 }else checkout();
};
document.querySelector('#completeReceipt').onclick=()=>{state.receiptIssued=true;act();toast('領収書を発行しました')};
document.querySelector('#newOrder').onclick=()=>{
 if(window.__remainingCartAfterPay&&window.__remainingCartAfterPay.length){
   state.cart=window.__remainingCartAfterPay;window.__remainingCartAfterPay=null;window.__remainingCart=null;
   state.ticketDiscount={type:'none',value:0};state.splits=[];state.input='0';state.payMethod='現金';renderCart();show('order');toast('残りの商品を注文画面に戻しました');
 }else{resetOrder();show('order')}
};
document.querySelector('#startMission').onclick=()=>{state.training=true;document.querySelector('#modeBadge').textContent='訓練中';resetOrder();show('order');document.querySelector('#feedback').className='feedback';document.querySelector('#feedback').textContent='訓練中です。指定条件どおりに会計してください。'};
document.querySelector('#nextMission').onclick=()=>{state.missionIndex=(state.missionIndex+1)%missions.length;renderMission()};

document.querySelector('#onboardNext').onclick=()=>{
  if(onboardingStep<3){onboardingStep++;renderOnboarding()}else finishOnboarding();
};
document.querySelector('#onboardPrev').onclick=()=>{if(onboardingStep>0){onboardingStep--;renderOnboarding()}};
document.querySelector('#skipOnboarding').onclick=finishOnboarding;
document.querySelector('#replayOnboarding').onclick=showOnboarding;

document.querySelector('#resetData').onclick=()=>{localStorage.clear();state.history=[];state.actions=state.mistakes=state.clears=0;renderHistory();updateScore();toast('初期化しました')};
document.querySelector('#keypad').innerHTML=['7','8','9','4','5','6','1','2','3','0','00','000'].map(k=>`<button data-key="${k}">${k}</button>`).join('');
document.querySelectorAll('.navbtn').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.screen!=='order'&&b.dataset.screen!=='payment'){} }));
setInterval(()=>document.querySelector('#clock').textContent=new Date().toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'}),1000);
renderCatalog();renderCart();renderHistory();renderMission();updateScore();updateCashCount();updateCarryUI();setPosMode(state.posMode);updateSkills();renderPosCaseList();initOnboarding();