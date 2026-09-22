import {useEffect,useRef,useState} from 'react';
import {SlidersHorizontal,Plus,Trash2} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {foods} from '@/lib/foods';
import {amountFromInput,amountStep,amountToInput,foodName,priceLabel,type Language} from '@/lib/i18n';
import {emptyProfile,validateProfile,type PoolProfile} from '@/lib/personal-pool';
import type {Preferences} from '@/hooks/use-preferences';
export function PreferencesPanel({preferences:a,language,disabled,variant='header'}:{preferences:Preferences;language:Language;disabled:boolean;variant?:'header'|'inventory'}){
 const vi=language==='vi';const [open,setOpen]=useState(false),[draft,setDraft]=useState<PoolProfile>(emptyProfile),[search,setSearch]=useState(''),[tab,setTab]=useState<'builtIn'|'custom'>('builtIn');
 const [editing,setEditing]=useState<string|null>(null),[name,setName]=useState(''),[price,setPrice]=useState(()=>amountToInput(50,language)),[veg,setVeg]=useState(false),[notice,setNotice]=useState(''),[confirmDelete,setConfirmDelete]=useState(false);
 useEffect(()=>{setDraft(a.profile)},[a.profile]);
 // The price field is typed in the language's currency, so a switch has to
 // convert what is already in it instead of re-reading the digits.
 const priceUnit=useRef(language);
 useEffect(()=>{if(priceUnit.current!==language){const thousands=amountFromInput(price,priceUnit.current);priceUnit.current=language;if(Number.isFinite(thousands))setPrice(amountToInput(thousands,language))}},[language]);
 const resetForm=()=>{setEditing(null);setName('');setPrice(amountToInput(50,language));setVeg(false)};
 function add(){
  try{const item={id:editing||crypto.randomUUID(),name:name.trim(),price:amountFromInput(price,language),veg};const next=validateProfile({...draft,custom:editing?draft.custom.map(f=>f.id===editing?item:f):[...draft.custom,item]});updateDraft(next);resetForm();setNotice('')}catch{setNotice(vi?'Tên 1–60 ký tự, giá 10–500 nghìn, tối đa 50 món.':'Name: 1–60 characters, price: $3–$150, up to 50 dishes.')}
 }
 const dirty=JSON.stringify(draft)!==JSON.stringify(a.profile);
 const updateDraft=(next:PoolProfile)=>{setDraft(next);a.save(next)};
 const query=search.trim().toLocaleLowerCase();
 const filtered=foods.filter(f=>foodName(f,language).toLocaleLowerCase().includes(query));
 const enabled=new Set(draft.enabled);
 const total=draft.enabled.length+draft.custom.length;
 return <><button className={variant==='inventory'?'customize-food-button':'preferences-button'} disabled={disabled} onClick={()=>{setDraft(a.profile);setNotice('');setConfirmDelete(false);setOpen(true)}} aria-label={variant==='inventory'?(vi?'Tuỳ chỉnh món ăn':'Customize food'):(vi?'Món của tôi':'My dishes')}>{variant==='inventory'?<><SlidersHorizontal size={16}/><span className="customize-full">{vi?'Tuỳ chỉnh món ăn':'Customize food'}</span><span className="customize-short">{vi?'Tuỳ chỉnh':'Customize'}</span></>:<><SlidersHorizontal size={17}/><span>{vi?'Món của tôi':'My dishes'}</span></>}</button>
 <Dialog open={open} onOpenChange={setOpen}><DialogContent className="preferences-dialog"><DialogTitle>{vi?'Món của tôi':'My dishes'}</DialogTitle><DialogDescription>{vi?'Hòm bắt đầu trống. Chọn món có sẵn hoặc tự thêm món; lựa chọn tự động lưu bằng cookie trên máy này.':'The case starts empty. Pick catalog dishes or add your own; choices are automatically saved in cookies on this computer.'}</DialogDescription>
 <div className="pool-tabs"><button className={tab==='builtIn'?'selected':''} onClick={()=>setTab('builtIn')}>{vi?'Món có sẵn':'Catalog'} ({draft.enabled.length}/{foods.length})</button><button className={tab==='custom'?'selected':''} onClick={()=>setTab('custom')}>{vi?'Món tự thêm':'Custom'} ({draft.custom.length}/50)</button></div>
 <div className="pool-body"><fieldset>
 {tab==='builtIn'?<><input className="pool-search" placeholder={vi?'Tìm món…':'Search dishes…'} aria-label={vi?'Tìm món':'Search dishes'} value={search} onChange={e=>setSearch(e.target.value)}/><div className="pool-list">{filtered.length===0&&<p>{vi?'Không có món nào khớp.':'No dishes match.'}</p>}{filtered.map(f=><label className="pool-row" key={f.image}><input type="checkbox" checked={enabled.has(f.image)} onChange={e=>updateDraft({...draft,enabled:e.target.checked?[...draft.enabled,f.image]:draft.enabled.filter(id=>id!==f.image)})}/><span>{foodName(f,language)}{f.veg?' · 🌱':''}</span><small>{priceLabel(f.price,language)}</small></label>)}</div>
 <div className="pool-bulk"><button className="subtle-button" onClick={()=>updateDraft({...draft,enabled:[...new Set([...draft.enabled,...filtered.map(f=>f.image)])]})}>{query?(vi?`Thêm ${filtered.length} món đang lọc`:`Add ${filtered.length} filtered`):(vi?`Chọn tất cả ${foods.length} món`:`Select all ${foods.length}`)}</button><button className="subtle-button" onClick={()=>{const drop=new Set(filtered.map(f=>f.image));updateDraft({...draft,enabled:draft.enabled.filter(id=>!drop.has(id))})}}>{query?(vi?'Bỏ món đang lọc':'Remove filtered'):(vi?'Bỏ chọn tất cả':'Clear all')}</button></div></>:<>
 <div className="custom-form"><label>{vi?'Tên món':'Dish name'}<input value={name} maxLength={60} onChange={e=>setName(e.target.value)}/></label><label>{vi?'Giá (nghìn đồng)':'Price (USD)'}<input type="number" min={amountToInput(10,language)} max={amountToInput(500,language)} step={amountStep(language)} inputMode={vi?'numeric':'decimal'} value={price} onChange={e=>setPrice(e.target.value)}/></label><label className="inline-check"><input type="checkbox" checked={veg} onChange={e=>setVeg(e.target.checked)}/>{vi?'Món chay':'Vegetarian'}</label><button className="pool-primary" onClick={add}><Plus size={16}/>{editing?(vi?'Cập nhật':'Update'):(vi?'Thêm món':'Add dish')}</button>{editing&&<button onClick={resetForm}>{vi?'Huỷ sửa':'Cancel edit'}</button>}</div>
 <div className="pool-list">{draft.custom.length===0&&<p>{vi?'Thêm quán cơm quen hoặc món tủ của bạn.':'Add your favorite dish.'}</p>}{draft.custom.map(f=><div className="pool-row" key={f.id}><button onClick={()=>{setEditing(f.id);setName(f.name);setPrice(amountToInput(f.price,language));setVeg(f.veg)}}>{f.name}{f.veg?' · 🌱':''}</button><small>{priceLabel(f.price,language)}</small><button aria-label={`${vi?'Xóa':'Remove'} ${f.name}`} onClick={()=>{updateDraft({...draft,custom:draft.custom.filter(item=>item.id!==f.id)});if(editing===f.id)resetForm()}}><Trash2 size={15}/></button></div>)}</div></>}
 </fieldset></div>
 <div className="pool-save"><small>{total===0?(vi?'Hòm đang trống — chọn ít nhất một món để mở hòm':'Case is empty — pick at least one dish to open it'):`${total} ${vi?'món trong hòm':'dishes in case'}`} · {dirty?(vi?'Chưa lưu':'Unsaved'):(vi?'Tự động lưu trên máy':'Saved automatically')}</small></div>
 <div className="preferences-bottom"><button onClick={async()=>{const p=await a.reload();if(p)setDraft(p)}}>{vi?'Tải lại cookie':'Reload cookies'}</button><button onClick={()=>setConfirmDelete(!confirmDelete)}>{vi?'Xóa danh sách đã lưu':'Clear saved dishes'}</button></div>{confirmDelete&&<div className="delete-confirm"><p>{vi?'Xóa danh sách món đã lưu trên trình duyệt này? Hòm sẽ trở lại trạng thái trống.':'Clear the saved food pool on this browser? The case goes back to empty.'}</p><button onClick={async()=>{if(await a.remove())setOpen(false)}}>{vi?'Xác nhận xóa':'Confirm deletion'}</button></div>}

 {(a.error||notice)&&<p className="preferences-message" role="status">{a.error||notice}</p>}
 </DialogContent></Dialog></>;
}
