// Synthetic demonstration only. Run: node analyze.mjs
import fs from 'node:fs';
import assert from 'node:assert/strict';
const rows = fs.readFileSync(new URL('data/transactions.csv', import.meta.url),'utf8').trim().split(/\r?\n/);
const keys = rows.shift().split(',');
const data = rows.map(line => Object.fromEntries(line.split(',').map((v,i)=>[keys[i],i>=4?Number(v):v])));
export function calculate(r) {
  for (const k of ['quantity','list_price','net_price','unit_cost','approved_discount']) {
    if (!Number.isFinite(r[k]) || r[k]<0) throw new Error('Invalid '+k);
  }
  if(r.list_price<=0 || r.quantity<=0 || r.approved_discount>=1) throw new Error('Invalid pricing input');
  const revenue=r.quantity*r.net_price, cost=r.quantity*r.unit_cost;
  const floor=r.list_price*(1-r.approved_discount);
  const gap=Math.max(0,floor-r.net_price);
  return {...r,revenue,cost,gross_profit:revenue-cost,margin:revenue?(revenue-cost)/revenue:null,
    actual_discount:1-r.net_price/r.list_price,approved_floor:floor,
    review_exposure:gap*r.quantity,proposed_price:Math.max(r.net_price,floor)};
}
assert.equal(calculate({quantity:10,list_price:100,net_price:70,unit_cost:50,approved_discount:.2}).review_exposure,100);
assert.equal(calculate({quantity:10,list_price:100,net_price:90,unit_cost:50,approved_discount:.2}).review_exposure,0);
assert.equal(calculate({quantity:10,list_price:100,net_price:0,unit_cost:50,approved_discount:.2}).margin,null);
assert.throws(()=>calculate({quantity:-1,list_price:100,net_price:70,unit_cost:50,approved_discount:.2}));
const calculated=data.map(calculate);
assert.equal(new Set(data.map(r=>r.line_id)).size,data.length,'Duplicate line IDs');
const sum=(items,key)=>items.reduce((s,r)=>s+r[key],0);
const revenue=sum(calculated,'revenue'), cost=sum(calculated,'cost'), gp=revenue-cost;
const exposure=sum(calculated,'review_exposure');
const money=n=>n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
const pct=n=>(100*n).toFixed(1)+'%';
let report='# Pricing review findings\n\n**Synthetic demonstration. These are modeled results, not employment achievements or realized savings.**\n\n';
report+='| Metric | Value |\n|---|---:|\n';
for(const [k,v] of [['Transaction lines',data.length],['Revenue',money(revenue)],['Gross profit',money(gp)],['Weighted gross margin',pct(gp/revenue)],['Below-floor lines',calculated.filter(r=>r.review_exposure>0).length],['Price exception exposure',money(exposure)]]) report+='| '+k+' | '+v+' |\n';
report+='\n## Prioritize the review\n\n| Product family | Revenue | Gross margin | Exception exposure |\n|---|---:|---:|---:|\n';
for(const family of [...new Set(data.map(r=>r.family))]) {
 const group=calculated.filter(r=>r.family===family);
 const rev=sum(group,'revenue'), profit=sum(group,'gross_profit');
 report+='| '+family+' | '+money(rev)+' | '+pct(profit/rev)+' | '+money(sum(group,'review_exposure'))+' |\n';
}
report+='\n## Price realization and volume sensitivity\n\nOnly below-floor lines receive a price change. Retention applies to those lines; other lines remain unchanged. Costs vary directly with retained units.\n\n| Scenario | Revenue | Gross profit | GP change | Gross margin |\n|---|---:|---:|---:|---:|\n';
for(const [label,realization,retention] of [['Baseline',0,1],['50% gap realization; no volume loss',.5,1],['Full floor; no volume loss',1,1],['Full floor; 5% affected volume loss',1,.95],['Full floor; 10% affected volume loss',1,.9]]) {
 let rev=0,c=0;
 for(const r of calculated) {
   const q=r.quantity*(r.review_exposure>0?retention:1);
   rev+=q*(r.net_price+(r.proposed_price-r.net_price)*realization);
   c+=q*r.unit_cost;
 }
 report+='| '+label+' | '+money(rev)+' | '+money(rev-c)+' | '+money(rev-c-gp)+' | '+pct((rev-c)/rev)+' |\n';
}
report+='\n## Commercial interpretation\n\nReview the largest dollar exceptions with sales and finance before changing prices. Validate contract terms, special-price authorizations, rebate treatment, and competitive context. A below-floor sale is a review flag, not proof of an error. Prioritize opportunities that can be retained and monitor gross profit dollars as well as margin percentage.\n\nThe full-floor scenario assumes every exception can be corrected. It is an upper-bound arithmetic scenario, not a forecast. Volume sensitivities are assumptions, not estimated elasticity.\n';
fs.mkdirSync(new URL('reports/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('reports/findings.md',import.meta.url),report);
const cols=[...keys,'revenue','cost','gross_profit','margin','actual_discount','approved_floor','review_exposure','proposed_price'];
fs.writeFileSync(new URL('reports/line_review.csv',import.meta.url),cols.join(',')+'\n'+calculated.map(r=>cols.map(k=>typeof r[k]==='number'?r[k].toFixed(6):r[k]??'').join(',')).join('\n')+'\n');
console.log(report);
console.log('Validation passed: fixture calculations, zero revenue, invalid inputs, unique IDs.');

