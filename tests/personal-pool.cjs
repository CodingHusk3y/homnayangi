const assert=require('node:assert/strict');const {buildSync}=require('esbuild');const {mkdtempSync,rmSync}=require('node:fs');const {tmpdir}=require('node:os');const {join}=require('node:path');
const out=mkdtempSync(join(tmpdir(),'pool-test-'));try{
 buildSync({entryPoints:['src/lib/personal-pool.ts','src/lib/foods.ts'],outdir:out,bundle:true,platform:'node',format:'cjs'});
 const {emptyProfile,validateProfile,readProfile,personalFoods,personalSelector,catalogIds}=require(join(out,'personal-pool.js'));const {foods}=require(join(out,'foods.js'));
 const all=catalogIds();
 // The case now starts empty, and an empty case is a valid saved state.
 assert.deepEqual(personalFoods(emptyProfile()),[]);
 assert.equal(personalSelector(personalFoods(emptyProfile()),50),null);
 assert.throws(()=>validateProfile({enabled:[999],custom:[],revision:0}));
 assert.throws(()=>validateProfile({enabled:[all[0],all[0]],custom:[],revision:0}));
 assert.throws(()=>validateProfile({disabled:[],custom:[],revision:0}));
 // Cookies written before the change stored opt-outs; they must read back as the same dishes.
 assert.deepEqual(readProfile({disabled:all.slice(1),custom:[],revision:0}).enabled,[all[0]]);
 assert.equal(readProfile({disabled:[],custom:[],revision:0}).enabled.length,foods.length);
 assert.throws(()=>readProfile({disabled:[999],custom:[],revision:0}));
 // Opting the whole catalog in has to stay inside the 3500-character cookie budget.
 assert.ok(encodeURIComponent(JSON.stringify(validateProfile({enabled:all,custom:[],revision:0}))).length<3500);
 const p=validateProfile({enabled:[],custom:[{id:crypto.randomUUID(),name:'Solo',price:85,veg:true}],revision:0});const items=personalFoods(p);assert.equal(items.length,1);const s=personalSelector(items,50);assert.equal(s.expectedPrice,85);assert.equal(s.choose(items).name,'Solo');assert.equal(personalSelector([],50),null);
 const catalog=personalFoods(validateProfile({enabled:all,custom:[],revision:0}));assert.equal(catalog.length,foods.length);
 for(const target of [30,50,100,180])assert.ok(Math.abs(personalSelector(catalog,target).expectedPrice-target)<1e-8);
 const pair=[{...items[0],price:10},{...items[0],price:500}];for(const target of [30,50,150,180]){const sel=personalSelector(pair,target);assert.ok(Math.abs(sel.expectedPrice-target)<1e-8);for(let i=0;i<100;i++)assert.ok(pair.includes(sel.choose(pair)))}
 assert.equal(personalSelector(pair,1).expectedPrice,10);assert.equal(personalSelector(pair,999).expectedPrice,500);
 console.log('PASS: empty case, legacy cookie migration, cookie budget, removed IDs, price boundaries, feasible mean and personalized selection.');
}finally{rmSync(out,{recursive:true,force:true})}
