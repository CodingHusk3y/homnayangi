import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildSync} from 'esbuild';
import {createRequire} from 'node:module';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const out=mkdtempSync(join(tmpdir(),'tnag-i18n-'));
try{
 buildSync({entryPoints:['src/lib/i18n.ts','src/lib/foods.ts'],outdir:out,outExtension:{'.js':'.cjs'},bundle:true,platform:'node',format:'cjs'});
 const require_=createRequire(import.meta.url);
 const {priceLabel,amountToInput,amountFromInput,usdFromThousands,spendRangeHint,SPEND_MIN,SPEND_MAX,PRICE_MIN,PRICE_MAX}=require_(join(out,'i18n.cjs'));
 const {foods}=require_(join(out,'foods.cjs'));
 test('Vietnamese keeps the stored thousands of dong',()=>{
  assert.equal(priceLabel(45,'vi'),'45.000đ');
  assert.equal(priceLabel(45,'vi',true),'~45.000đ');
 });
 test('English restates the price on the Atlanta lunch scale',()=>{
  assert.equal(priceLabel(45,'en'),'$11');
  assert.equal(priceLabel(150,'en',true),'~$23');
  // Cheapest and dearest custom dish the pool validator accepts.
  assert.equal(priceLabel(PRICE_MIN,'en'),'$5');
  assert.equal(priceLabel(PRICE_MAX,'en'),'$500');
 });
 test('the rarity bands land where an Atlanta diner would put them',()=>{
  // priceRarity steps at 40/65/100/130; a tier has to read as its own price bracket.
  assert.deepEqual([40,65,100,130].map(t=>priceLabel(t,'en')),['$11','$14','$18','$21']);
  // The whole catalog, cheapest counter dish to the one splurge. A flat
  // multiplier priced this risotto at $78, which is a dinner for two.
  assert.equal(priceLabel(25,'en'),'$8');
  assert.equal(priceLabel(260,'en'),'$32');
 });
 test('no dish in the catalog is priced outside an Atlanta lunch',()=>{
  for(const food of foods){
   const usd=usdFromThousands(food.price);
   assert.ok(usd>=8&&usd<=32,`${food.name} at ${food.price}k reads as $${usd.toFixed(2)}`);
  }
 });
 test('the scale stays ordered, so a dearer dish never reads as cheaper',()=>{
  for(let t=10;t<500;t++)assert.ok(usdFromThousands(t+1)>usdFromThousands(t));
 });
 test('a spend typed in either currency stores the same thousands of dong',()=>{
  assert.equal(amountFromInput('50','vi'),50);
  assert.equal(amountToInput(50,'en'),'12.06');
  assert.equal(amountFromInput('12.06','en'),50);
  // Every price a dish or a spend can hold survives the trip through dollars
  // and back, so switching language never rewrites a saved cookie. The curve
  // flattens as it climbs, so the cents have to stay meaningful at $500 too.
  for(let thousands=PRICE_MIN;thousands<=PRICE_MAX;thousands++)
   assert.equal(amountFromInput(amountToInput(thousands,'en'),'en'),thousands);
  // The ceiling is a round number of dollars, because that is the side that
  // runs into it: typing 500 has to be accepted, not rejected by one đồng.
  assert.equal(amountFromInput('500','en'),PRICE_MAX);
 });
 test('the English spend bounds match the Vietnamese ones',()=>{
  // The floor is the cheapest dish in the catalog: a ceiling under it would
  // leave nothing to draw. The ceiling clears the dearest dish anyone can add.
  assert.equal(SPEND_MIN,25);
  assert.equal(amountToInput(SPEND_MIN,'en'),'8');
  // A dish may be added right up to the spend ceiling, so the two must agree:
  // a dish dearer than any reachable spend could never be drawn at all.
  assert.equal(SPEND_MAX,PRICE_MAX);
  assert.equal(amountToInput(SPEND_MAX,'en'),'500');
  assert.equal(spendRangeHint('en'),'Enter $8–$500.');
  assert.equal(spendRangeHint('vi'),'Nhập từ 25 đến 27.017 nghìn.');
 });
 test('a dollar amount always resolves to a whole number of thousands',()=>{
  // validateProfile and the spend check both require an integer price.
  for(const usd of ['12.34','3.01','149.99','15.5'])assert.ok(Number.isInteger(amountFromInput(usd,'en')));
  assert.ok(Number.isNaN(amountFromInput('abc','en')));
 });
}finally{rmSync(out,{recursive:true,force:true})}
