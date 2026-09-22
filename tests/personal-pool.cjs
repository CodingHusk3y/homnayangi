const assert=require('node:assert/strict');const {buildSync}=require('esbuild');const {mkdtempSync,rmSync}=require('node:fs');const {tmpdir}=require('node:os');const {join}=require('node:path');
const out=mkdtempSync(join(tmpdir(),'pool-test-'));try{
 buildSync({entryPoints:['src/lib/personal-pool.ts','src/lib/foods.ts','src/lib/i18n.ts'],outdir:out,bundle:true,platform:'node',format:'cjs'});
 const {emptyProfile,validateProfile,readProfile,personalFoods,personalSelector,withinSpend,SPEND_HEADROOM,catalogIds}=require(join(out,'personal-pool.js'));const {foods}=require(join(out,'foods.js'));
 const {PRICE_MIN,PRICE_MAX}=require(join(out,'i18n.js'));
 const all=catalogIds();
 // The case now starts empty, and an empty case is a valid saved state.
 assert.deepEqual(personalFoods(emptyProfile()),[]);
 assert.equal(personalSelector(personalFoods(emptyProfile()),50),null);
 assert.throws(()=>validateProfile({enabled:[999],custom:[],revision:0}));
 assert.throws(()=>validateProfile({enabled:[all[0],all[0]],custom:[],revision:0}));
 assert.throws(()=>validateProfile({disabled:[],custom:[],revision:0}));
 // A custom dish may be priced anywhere in PRICE_MIN..PRICE_MAX and nowhere else.
 const dish=price=>({enabled:[],custom:[{id:crypto.randomUUID(),name:'Splurge',price,veg:false}],revision:0});
 for(const price of [PRICE_MIN,PRICE_MAX])assert.equal(validateProfile(dish(price)).custom[0].price,price);
 for(const price of [PRICE_MIN-1,PRICE_MAX+1,0,-5])assert.throws(()=>validateProfile(dish(price)));
 // Cookies written before the change stored opt-outs; they must read back as the same dishes.
 assert.deepEqual(readProfile({disabled:all.slice(1),custom:[],revision:0}).enabled,[all[0]]);
 assert.equal(readProfile({disabled:[],custom:[],revision:0}).enabled.length,foods.length);
 assert.throws(()=>readProfile({disabled:[999],custom:[],revision:0}));
 // Opting the whole catalog in has to stay inside the 3500-character cookie budget.
 assert.ok(encodeURIComponent(JSON.stringify(validateProfile({enabled:all,custom:[],revision:0}))).length<3500);
 const p=validateProfile({enabled:[],custom:[{id:crypto.randomUUID(),name:'Solo',price:85,veg:true}],revision:0});const items=personalFoods(p);assert.equal(items.length,1);
 // The only dish costs 85, so a cap that clears it leaves it as the whole pool.
 const s=personalSelector(items,100);assert.equal(s.expectedPrice,85);assert.equal(s.choose(items).name,'Solo');assert.equal(personalSelector([],50),null);
 // A cap below the only dish leaves nothing to draw, rather than drawing it anyway.
 assert.equal(personalSelector(items,50),null);assert.deepEqual(withinSpend(items,50),[]);
 const catalog=personalFoods(validateProfile({enabled:all,custom:[],revision:0}));assert.equal(catalog.length,foods.length);
 // The spend is a ceiling: nothing dearer survives, at any cap.
 for(const cap of [25,30,50,100,180,260,500]){
  const pool=withinSpend(catalog,cap);assert.ok(pool.every(f=>f.price<=cap));
  assert.equal(pool.length,catalog.filter(f=>f.price<=cap).length);
  const sel=personalSelector(catalog,cap);
  for(let i=0;i<200;i++)assert.ok(sel.choose(pool).price<=cap);
  // The mean lands under the ceiling, never on it: a ceiling is not a target.
  assert.ok(sel.expectedPrice<cap||pool.every(f=>f.price===cap));
  // Every dish left in the pool stays drawable; truncating must not silently
  // concentrate the whole distribution on the dearest dishes allowed.
  assert.ok(pool.every(f=>sel.probabilities.get(f)>0));
 }
 // The pull is downward only. Raising an already generous ceiling leaves the
 // ordinary lunch spread where it was instead of dragging the mean up with it.
 assert.equal(personalSelector(catalog,260).expectedPrice,personalSelector(catalog,500).expectedPrice);
 assert.ok(personalSelector(catalog,50).expectedPrice<=50*SPEND_HEADROOM+1e-6);
 // A cap under the cheapest catalog dish empties the case instead of throwing.
 assert.equal(personalSelector(catalog,24),null);
 const pair=[{...items[0],price:10},{...items[0],price:500}];
 // Only the 10 clears these caps, so it is the only thing that can be drawn.
 for(const cap of [30,50,150,180]){const sel=personalSelector(pair,cap);assert.equal(sel.expectedPrice,10);for(let i=0;i<100;i++)assert.equal(sel.choose(withinSpend(pair,cap)).price,10)}
 assert.equal(personalSelector(pair,1),null);
 // Both clear a 999 cap, and with the ceiling out of the way the lunch prior
 // decides: the 10 sits nearer an ordinary lunch, so it wins more often, but
 // the 500 stays a live outcome rather than a rounding error.
 const wide=personalSelector(pair,999);
 assert.ok(wide.probabilities.get(pair[0])>wide.probabilities.get(pair[1]));
 assert.ok(wide.probabilities.get(pair[1])>.01);
 // The tail has to reach the dearest dish anyone can add. A bell curve put this
 // at one roll in 10^70, which is the same as never: the price field would
 // accept a splurge the case could not deliver.
 const splurge={customId:'s',name:'Splurge',price:PRICE_MAX,rarity:4,image:-1,sub:'',quip:''};
 const withSplurge=[...catalog,splurge];
 const odds=personalSelector(withSplurge,PRICE_MAX).probabilities.get(splurge);
 assert.ok(odds>1/10000,`a ${PRICE_MAX}k dish drops at 1 in ${Math.round(1/odds)}`);
 // Still a splurge, not the house special: rarer than any catalog dish.
 assert.ok(catalog.every(f=>personalSelector(withSplurge,PRICE_MAX).probabilities.get(f)>odds));
 console.log('PASS: empty case, legacy cookie migration, cookie budget, removed IDs, price boundaries, spend ceiling and personalized selection.');
}finally{rmSync(out,{recursive:true,force:true})}
