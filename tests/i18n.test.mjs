import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildSync} from 'esbuild';
import {createRequire} from 'node:module';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const out=mkdtempSync(join(tmpdir(),'tnag-i18n-'));
try{
 buildSync({entryPoints:['src/lib/i18n.ts'],outfile:join(out,'i18n.cjs'),bundle:true,platform:'node',format:'cjs'});
 const {priceLabel,amountToInput,amountFromInput,SPEND_MIN,SPEND_MAX}=createRequire(import.meta.url)(join(out,'i18n.cjs'));
 test('Vietnamese keeps the stored thousands of dong',()=>{
  assert.equal(priceLabel(45,'vi'),'45.000đ');
  assert.equal(priceLabel(45,'vi',true),'~45.000đ');
 });
 test('English restates the price on the Atlanta lunch scale',()=>{
  assert.equal(priceLabel(45,'en'),'$13.50');
  assert.equal(priceLabel(150,'en',true),'~$45.00');
  // Cheapest and dearest custom dish the pool validator accepts.
  assert.equal(priceLabel(10,'en'),'$3.00');
  assert.equal(priceLabel(500,'en'),'$150.00');
 });
 test('the rarity bands land where an Atlanta diner would put them',()=>{
  // priceRarity steps at 40/65/100/130; a tier has to read as its own price bracket.
  assert.deepEqual([40,65,100,130].map(t=>priceLabel(t,'en')),['$12.00','$19.50','$30.00','$39.00']);
  // The whole catalog, cheapest counter dish to the one splurge.
  assert.equal(priceLabel(25,'en'),'$7.50');
  assert.equal(priceLabel(260,'en'),'$78.00');
 });
 test('a spend typed in either currency stores the same thousands of dong',()=>{
  assert.equal(amountFromInput('50','vi'),50);
  assert.equal(amountFromInput('15','en'),50);
  assert.equal(amountToInput(50,'en'),'15');
  assert.equal(amountToInput(45,'en'),'13.5');
  for(const thousands of [SPEND_MIN,35,50,75,100,150,SPEND_MAX])
   assert.equal(amountFromInput(amountToInput(thousands,'en'),'en'),thousands);
 });
 test('the English spend bounds match the Vietnamese ones',()=>{
  assert.equal(amountToInput(SPEND_MIN,'en'),'9');
  assert.equal(amountToInput(SPEND_MAX,'en'),'54');
 });
 test('a dollar amount always resolves to a whole number of thousands',()=>{
  // validateProfile and the spend check both require an integer price.
  for(const usd of ['12.34','3.01','149.99','15.5'])assert.ok(Number.isInteger(amountFromInput(usd,'en')));
  assert.ok(Number.isNaN(amountFromInput('abc','en')));
 });
}finally{rmSync(out,{recursive:true,force:true})}
