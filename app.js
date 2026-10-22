'use strict';
// All six cards are generated from this data, not repeated in HTML.
const periods = {
  week: { label:'2026.10.16 — 2026.10.22', revenue:128640, orders:1864, visitors:24908, conversion:7.48, changes:[12.8,8.2,16.4,0.6], trend:[14200,18600,15200,22100,17800,19100,21640], labels:['10/16','10/17','10/18','10/19','10/20','10/21','10/22'], shares:[42,28,18,12] },
  month: { label:'2026.09.23 — 2026.10.22', revenue:514560, orders:7456, visitors:101584, conversion:7.34, changes:[18.6,11.3,14.5,0.2], trend:[42100,48600,44200,56100,51800,63200,60160,72800,75600], labels:['09/23','09/26','09/30','10/04','10/08','10/11','10/15','10/18','10/22'], shares:[38,30,20,12] }
};
const cards = [
  { id:'revenue', title:'总销售额', kind:'metric', icon:'wallet', unit:'¥', change:0, spark:[18,24,17,30,24,38,34,43,42,53] },
  { id:'orders', title:'成交订单', kind:'metric', icon:'bag', unit:'', change:1, spark:[10,18,15,24,21,32,27,40,37,46] },
  { id:'visitors', title:'访客人数', kind:'metric', icon:'users', unit:'', change:2, spark:[12,22,16,28,23,31,29,40,34,44] },
  { id:'conversion', title:'支付转化率', kind:'metric', icon:'arrow', unit:'', change:3, spark:[24,20,25,22,30,26,33,29,37,40] },
  { id:'trend', title:'销售额趋势', kind:'trend' },
  { id:'channels', title:'访客来源', kind:'channels' }
];
const paths = {wallet:'M3 5h16v14H3z M3 8h16 M14 12h5v4h-5z',bag:'M5 7h14l1 13H4L5 7 M8 7V5a4 4 0 0 1 8 0v2',users:'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M17 3a4 4 0 0 1 0 8 M22 20v-2a4 4 0 0 0-3-3.87',arrow:'M4 17l6-6 4 4 6-10 M14 5h6v6',sun:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1 1 M18 18l1 1 M5 19l1-1 M18 6l1-1',moon:'M20 14A9 9 0 0 1 10 3a9 9 0 1 0 10 11'};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]}"/></svg>`;
const format = value => new Intl.NumberFormat('zh-CN').format(value);
let activePeriod = 'week';
function metric(card, data) {
  const value = card.id === 'conversion' ? data[card.id].toFixed(2)+'%' : format(data[card.id]);
  const points = card.spark.map((v,i)=>`${i*24},${58-v}`).join(' ');
  return `<div class="card-head"><h2 id="${card.id}-title">${card.title}</h2><span class="metric-icon">${icon(card.icon)}</span></div><p class="metric-value numeric"><span class="unit">${card.unit}</span>${value}</p><p class="metric-bottom"><span class="change numeric">↗ ${data.changes[card.change]}${card.id==='conversion'?' 个百分点':'%'}</span><span>较上一${activePeriod==='week'?'周':'周期'}</span></p><svg class="sparkline" viewBox="0 0 216 60" preserveAspectRatio="none" aria-hidden="true"><path d="M${points.replaceAll(' ',' L')} L216 60 L0 60 Z" fill="currentColor" opacity=".07"/><polyline points="${points}" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;
}
function trend(data) {
  const max = Math.ceil(Math.max(...data.trend)/10000)*10000;
  const pts = data.trend.map((v,i)=>[44+i*416/(data.trend.length-1),180-v/max*148]);
  const line = pts.map(p=>p.join(',')).join(' ');
  const grid = [0,.5,1].map(r=>`<line class="grid-line" x1="44" x2="460" y1="${180-r*148}" y2="${180-r*148}"/><text x="0" y="${184-r*148}">${max*r/10000}万</text>`).join('');
  const labels = data.labels.map((label,i)=>i%2===0||i===data.labels.length-1?`<text x="${pts[i][0]}" y="207" text-anchor="${i===data.labels.length-1?'end':'middle'}">${label}</text>`:'').join('');
  return `<div class="card-head"><div><h2 id="trend-title">销售额趋势</h2><p class="card-description">${activePeriod==='week'?'每日销售额':'按区间汇总销售额'} · 与生意的节奏保持同步</p></div><span class="chart-label">人民币</span></div><div class="chart-summary"><strong class="numeric">¥ ${format(data.revenue)}</strong><span>本期累计销售额</span></div><svg class="chart" viewBox="0 0 480 220" role="img" aria-labelledby="trend-svg-title trend-svg-desc"><title id="trend-svg-title">本期销售额趋势</title><desc id="trend-svg-desc">${data.labels.map((l,i)=>`${l}：${data.trend[i]}元`).join('；')}</desc>${grid}<path d="M${line.replaceAll(' ',' L')} L460 180 L44 180 Z" fill="currentColor" opacity=".08"/><polyline points="${line}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="var(--surface)" stroke="currentColor" stroke-width="2"/>`).join('')}${labels}</svg>`;
}
const channels = ['自然搜索','直接访问','社交媒体','其他渠道'];
const channelColors = ['var(--accent)','#8da876','#c5ce96','var(--orange)'];
function channelCard(data) {
  let offset = 0;
  const circles = data.shares.map((share,i)=>{const result=`<circle cx="90" cy="90" r="68" pathLength="100" stroke="currentColor" style="color:${channelColors[i]}" stroke-dasharray="${share} ${100-share}" stroke-dashoffset="${-offset}"/>`;offset+=share;return result;}).join('');
  return `<div class="card-head"><div><h2 id="channels-title">访客来源</h2><p class="card-description">每一份关注，都有迹可循</p></div><span class="chart-label">渠道分布</span></div><div class="channel-body"><div class="donut-wrap"><svg class="donut" viewBox="0 0 180 180" role="img" aria-label="访客来源占比：${channels.map((c,i)=>c+data.shares[i]+'%').join('，')}">${circles}</svg><div class="donut-label"><strong class="numeric">${format(data.visitors)}</strong><small>总访客人数</small></div></div><ul class="channel-list">${channels.map((c,i)=>`<li><span class="channel-name"><span class="swatch" style="background:${channelColors[i]}"></span>${c}</span><strong class="numeric">${data.shares[i]}%</strong></li>`).join('')}</ul></div><p class="insight">↗ <b>自然搜索</b>贡献了 ${data.shares[0]}% 的访客，是本期最主要的流量来源。</p>`;
}
function render() {
  const data = periods[activePeriod];
  document.querySelector('#date-label').textContent = data.label;
  document.querySelector('#dashboard').innerHTML = cards.map(card=>`<section class="card ${card.kind==='metric'?'metric':'wide'}" aria-labelledby="${card.id}-title">${card.kind==='metric'?metric(card,data):card.kind==='trend'?trend(data):channelCard(data)}</section>`).join('');
  document.querySelectorAll('[data-period]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.period===activePeriod)));
}
document.querySelectorAll('[data-period]').forEach(button=>button.addEventListener('click',()=>{activePeriod=button.dataset.period;render();document.querySelector('#announcement').textContent=`已切换到${button.textContent}的数据`; }));
function setTheme(theme) {
  document.documentElement.dataset.theme=theme;
  const button=document.querySelector('#theme-toggle');
  button.innerHTML=icon(theme==='dark'?'sun':'moon');
  button.setAttribute('aria-label',theme==='dark'?'切换到浅色主题':'切换到深色主题');
  button.setAttribute('aria-pressed',String(theme==='dark'));
}
let savedTheme;
try { savedTheme=localStorage.getItem('qiye-theme'); } catch { /* Storage can be disabled under file://. */ }
setTheme(['light','dark'].includes(savedTheme)?savedTheme:'light');
document.querySelector('#theme-toggle').addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='light'?'dark':'light';setTheme(theme);try{localStorage.setItem('qiye-theme',theme);}catch{} });
document.querySelector('#export').addEventListener('click',()=>{
  const data=periods[activePeriod];
  const rows=[['统计周期',data.label],['指标','数值'],['销售额（元）',data.revenue],['成交订单',data.orders],['访客人数',data.visitors],['支付转化率（%）',data.conversion],[],['趋势日期','销售额（元）'],...data.labels.map((l,i)=>[l,data.trend[i]]),[],['访客来源','占比（%）'],...channels.map((c,i)=>[c,data.shares[i]])];
  const csv='\uFEFF'+rows.map(row=>row.map(cell=>'"'+String(cell).replaceAll('"','""')+'"').join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
  const link=document.createElement('a');link.href=url;link.download=`栖野经营数据-${activePeriod}.csv`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  document.querySelector('#announcement').textContent='已导出当前周期的 CSV 数据';
});
render();
