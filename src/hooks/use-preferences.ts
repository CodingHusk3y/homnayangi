import {useEffect,useState} from 'react';
import {emptyProfile,readProfile,validateProfile,type PoolProfile} from '@/lib/personal-pool';
import {readCookie,writeCookie,clearCookie} from '@/lib/cookies';
function load(){try{return readProfile(readCookie('pool'))}catch{return emptyProfile()}}
export function usePreferences(){
 // `ready` stays false until the cookie is read, so an empty first render is
 // not mistaken for an empty case and shown as the add-your-first-dish state.
 const [profile,setProfile]=useState<PoolProfile>(emptyProfile),[error,setError]=useState(''),[ready,setReady]=useState(false);
 useEffect(()=>{setProfile(load());setReady(true)},[]);
 const save=(next:PoolProfile)=>{try{const checked=validateProfile(next);writeCookie('pool',checked);setProfile(checked);setError('');return true}catch(e){setError((e as Error).message);return false}};
 const reload=()=>{const next=load();setProfile(next);setError('');return next};
 const remove=()=>{try{clearCookie('pool');setProfile(emptyProfile());setError('');return true}catch(e){setError((e as Error).message);return false}};
 return {profile,ready,error,setError,save,reload,remove};
}
export type Preferences=ReturnType<typeof usePreferences>;
