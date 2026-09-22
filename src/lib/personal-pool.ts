import { foods, type Food } from './foods';
import { createFoodSelector, priceRarity } from './case-mechanics';
import { PRICE_MAX, PRICE_MIN } from './i18n';
export type CustomFood = { id: string; name: string; price: number; veg: boolean };
// `enabled` lists the catalog dishes a visitor has opted in. The case starts
// empty, so an unsaved or cleared profile means "no dishes yet", not "all".
export type PoolProfile = { enabled: number[]; custom: CustomFood[]; revision: number };
export const emptyProfile = (): PoolProfile => ({ enabled: [], custom: [], revision: 0 });
const ids = new Set(foods.map(f => f.image));
export const catalogIds = (): number[] => foods.map(f => f.image);
export function validateProfile(input: unknown): PoolProfile {
 if (!input || typeof input !== 'object') throw new Error('Invalid profile');
 const p = input as Record<string, unknown>;
 if (Object.keys(p).some(k => !['enabled','custom','revision'].includes(k)) || !Array.isArray(p.enabled) || !Array.isArray(p.custom) || !Number.isSafeInteger(p.revision) || (p.revision as number)<0) throw new Error('Invalid profile');
 if (p.enabled.length>foods.length || p.custom.length>50 || new Set(p.enabled).size!==p.enabled.length || p.enabled.some(id=>!ids.has(id))) throw new Error('Invalid dishes');
 const custom = p.custom.map((item: unknown): CustomFood => {
  if (!item || typeof item!=='object') throw new Error('Invalid dish');
  const f=item as Record<string,unknown>;
  if(Object.keys(f).some(k=>!['id','name','price','veg'].includes(k)) || typeof f.id!=='string' || !/^[0-9a-f-]{36}$/i.test(f.id) || typeof f.name!=='string' || !f.name.trim() || f.name.length>60 || /[\x00-\x1f\x7f]/.test(f.name) || !Number.isInteger(f.price) || (f.price as number)<PRICE_MIN || (f.price as number)>PRICE_MAX || typeof f.veg!=='boolean') throw new Error('Invalid dish');
  return {id:f.id,name:f.name.trim().normalize('NFC'),price:f.price as number,veg:f.veg};
 });
 if(new Set(custom.map(f=>f.id)).size!==custom.length) throw new Error('Invalid dish');
 return {enabled:p.enabled as number[],custom,revision:p.revision as number};
}
// Cookies written before the case started empty stored the catalog ids a
// visitor had switched off. Read that opt-out list back as the same opt-in set
// so an existing pool survives the change instead of silently resetting.
export function readProfile(input: unknown): PoolProfile {
 if (input && typeof input === 'object') {
  const p = input as Record<string, unknown>;
  if (Array.isArray(p.disabled) && !('enabled' in p)) {
   // Reject a damaged opt-out list rather than inverting it, which would read
   // as "every dish is on" and hand back a pool the visitor never chose.
   const off = p.disabled as unknown[];
   if (off.length>foods.length || new Set(off).size!==off.length || off.some(id=>typeof id!=='number' || !ids.has(id))) throw new Error('Invalid dishes');
   return validateProfile({enabled:catalogIds().filter(id=>!off.includes(id)),custom:p.custom,revision:p.revision});
  }
 }
 return validateProfile(input);
}
export function personalFoods(profile: PoolProfile): Food[] {
 const on = new Set(profile.enabled);
 return [...foods.filter(f=>on.has(f.image)), ...profile.custom.map(f=>({...f,customId:f.id,image:-1,sub:'Món của tôi',quip:'',rarity:priceRarity(f.price)}))];
}
// The spend control is a ceiling, not an average. A dish priced above it is out
// of the pool entirely rather than merely unlikely, which is what stops a 260k
// risotto from landing on a visitor who said they spend 50k.
export const withinSpend = (population: Food[], cap: number) => population.filter(f => f.price <= cap);
// Nobody spends their ceiling every day, so a draw should land under it. The
// pull is only ever downward: a generous ceiling leaves the ordinary lunch
// spread alone rather than dragging every roll up to the dearest dish allowed,
// which is what aiming at the cap itself would do.
export const SPEND_HEADROOM = 0.8;
export function personalSelector(population: Food[], cap: number) {
 const pool=withinSpend(population,cap);
 if(!pool.length) return null;
 const natural=createFoodSelector(pool,null);
 const ceiling=cap*SPEND_HEADROOM;
 if(natural.expectedPrice<=ceiling) return natural;
 // A tight ceiling: pull the mean down to it, as far as the pool can reach. A
 // pool of 25k dishes under a 30k cap has nothing cheaper to shift towards.
 const feasible=Math.max(Math.min(...pool.map(f=>f.price)),Math.min(ceiling,Math.max(...pool.map(f=>f.price))));
 return createFoodSelector(pool,feasible);
}
