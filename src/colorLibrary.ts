/** Stable, browser-local palette. Never reuse an index, including archived entries. */
const builtin=['#e7a097','#e9b78e','#f2d49f','#f7e8c7','#b7c8a7','#8bafa2','#9ebeca','#aaa8cb','#d0abc2','#977576','#79706b','#fcfaf4','#50545a','#d6c9b8','#db7b6c','#d5bb68','#302e2d','#573a2f','#85502f','#b67a49','#df943c','#f0af65','#969493','#b7b5b1','#719f3e','#91c053','#f6c52f','#f8d977','#f4b6bc','#f0eae2'] as const;
export const BUILTIN_COLOR_COUNT=builtin.length;
export const MAX_CUSTOM_COLORS=80;
export type CustomColor={hex:string;name:string;archived:boolean};
const key='atelier-custom-palette-v1';
export function normalizeHex(input:string):string|null{
 const s=input.trim().replace(/^#/,'').toUpperCase();
 if(/^[0-9A-F]{3}$/.test(s))return '#'+[...s].map(x=>x+x).join('');
 return /^[0-9A-F]{6}$/.test(s)?'#'+s:null;
}
function read():CustomColor[]{
 try{const data=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(data))return [];
 return data.slice(0,MAX_CUSTOM_COLORS).map((v:unknown,i:number)=>{
   const obj=v&&typeof v==='object'?v as Partial<CustomColor>:{};
   return {hex:normalizeHex(typeof obj.hex==='string'?obj.hex:'')||'#888888',name:typeof obj.name==='string'?obj.name.slice(0,30):'自定义颜色 '+(i+1),archived:obj.archived===true};
 });}catch{return []}
}
const custom=read();
export const colors:string[]=[...builtin,...custom.map(c=>c.hex)];
const save=()=>{try{localStorage.setItem(key,JSON.stringify(custom))}catch{throw Error('颜色库保存失败：请检查浏览器的本地存储空间')}};
export function isBuiltIn(index:number){return index>=0&&index<BUILTIN_COLOR_COUNT}
export function colorMeta(index:number){
 if(isBuiltIn(index))return {name:'基础颜色 '+String(index+1).padStart(2,'0'),archived:false,builtin:true};
 const c=custom[index-BUILTIN_COLOR_COUNT];
 return {name:c?.name||'未命名颜色',archived:c?.archived??true,builtin:false};
}
export function visibleColorIds(){return colors.map((_,i)=>i).filter(i=>!colorMeta(i).archived)}
export function addColor(hexValue:string,name='自定义颜色'):number{
 const hex=normalizeHex(hexValue);if(!hex)throw Error('请输入有效的 HEX 颜色');
 const found=colors.findIndex((v,i)=>v.toUpperCase()===hex&&!colorMeta(i).archived);
 if(found>=0)return found;
 if(custom.length>=MAX_CUSTOM_COLORS)throw Error('自定义色板最多支持 '+MAX_CUSTOM_COLORS+' 色');
 const item={hex,name:name.trim().slice(0,30)||'自定义颜色 '+(custom.length+1),archived:false};
 custom.push(item);colors.push(hex);
 try{save()}catch(e){custom.pop();colors.pop();throw e}
 return colors.length-1;
}
export function renameColor(index:number,name:string){
 const c=custom[index-BUILTIN_COLOR_COUNT];if(!c)throw Error('基础色板不支持重命名');
 const previous=c.name;c.name=name.trim().slice(0,30)||'自定义颜色';
 try{save()}catch(e){c.name=previous;throw e}
}
export function setArchived(index:number,archived:boolean){
 const c=custom[index-BUILTIN_COLOR_COUNT];if(!c)throw Error('基础颜色不可归档');
 const previous=c.archived;c.archived=archived;
 try{save()}catch(e){c.archived=previous;throw e}
}
export function registerColorForImport(value:string,desiredName?:string){
 const hex=normalizeHex(value);if(!hex)throw Error('项目文件包含无效颜色');
 const index=colors.findIndex(v=>v.toUpperCase()===hex);
 if(index!==-1)return index;
 return addColor(hex,desiredName||'导入颜色');
}
export function customPaletteExport(){
 return {version:1,kind:'bead-atelier-palette',colors:custom.filter(c=>!c.archived).map(({name,hex})=>({name,hex}))};
}
