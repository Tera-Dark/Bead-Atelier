import {useEffect,useMemo,useRef,useState} from 'react';
import {Check,Copy,Download,Eye,EyeOff,Filter,Heart,Import,Palette,Plus,Search,Shuffle,Star,Trash2,X} from 'lucide-react';
import {colors,type Board} from './board';
import {BUILTIN_COLOR_COUNT,colorMeta,normalizeHex,visibleColorIds} from './colorLibrary';
type Tab='all'|'favorites'|'custom'|'used'|'recent';
type Props={
 board:Board;selected:number;favorites:number[];recent:number[];revision:number;
 onChoose:(index:number)=>void;onFavorite:(index:number)=>void;onAdd:(hex:string,name:string)=>number;
 onRename:(index:number,name:string)=>void;onArchive:(index:number,archive:boolean)=>void;
 onReplace:(from:number,to:number)=>void;onExport:()=>void;onImport:(file:File)=>void;onClose:()=>void
};
const rgb=(hex:string):[number,number,number]=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)) as [number,number,number];
function hsvFromHex(hex:string){const [rr,gg,bb]=rgb(hex).map(v=>v/255),max=Math.max(rr,gg,bb),min=Math.min(rr,gg,bb),d=max-min;
 let h=0;if(d!==0){switch(max){case rr:h=((gg-bb)/d)%6;break;case gg:h=(bb-rr)/d+2;break;default:h=(rr-gg)/d+4;}h*=60}return {h:(h+360)%360,s:max===0?0:d/max*100,v:max*100};
}
function hexFromHSV(h:number,s:number,v:number){const ss=s/100,vv=v/100,c=vv*ss,x=c*(1-Math.abs(h/60%2-1)),m=vv-c;let q:[number,number,number];
 if(h<60)q=[c,x,0];else if(h<120)q=[x,c,0];else if(h<180)q=[0,c,x];else if(h<240)q=[0,x,c];else if(h<300)q=[x,0,c];else q=[c,0,x];
 return '#'+q.map(n=>Math.round((n+m)*255).toString(16).padStart(2,'0')).join('').toUpperCase();
}
const tabs:{key:Tab;label:string}[]=[{key:'all',label:'全部'},{key:'favorites',label:'收藏'},{key:'custom',label:'自定义'},{key:'used',label:'作品中'},{key:'recent',label:'最近'}];
export default function ColorStudio({board,selected,favorites,recent,revision,onChoose,onFavorite,onAdd,onRename,onArchive,onReplace,onExport,onImport,onClose}:Props){
 const [tab,setTab]=useState<Tab>('all'),[search,setSearch]=useState(''),[order,setOrder]=useState<'code'|'usage'>('code'),[archived,setArchivedVisible]=useState(false);
 const [draft,setDraft]=useState(colors[selected]||'#E7A097'),[inputHex,setInputHex]=useState(colors[selected]||'#E7A097');
 const [colorName,setColorName]=useState('我的颜色'),[editing,setEditing]=useState<number|null>(null),[replaceWhenEditing,setReplaceWhenEditing]=useState(true);
 const [from,setFrom]=useState<number|null>(null),[to,setTo]=useState<number>(selected),[message,setMessage]=useState('');
 const fileRef=useRef<HTMLInputElement>(null);
 const counts=useMemo(()=>{const a=new Array(colors.length).fill(0) as number[];for(const i of board)if(i!==null&&i>=0&&i<a.length)a[i]++;return a},[board,revision]);
 const used=counts.map((n,i)=>({n,i})).filter(v=>v.n>0);
 const visible=visibleColorIds();
 const results=colors.map((hex,i)=>({hex,i,meta:colorMeta(i),n:counts[i]||0}))
  .filter(item=>archived||!item.meta.archived||item.n>0)
  .filter(item=>tab==='all'||(tab==='favorites'?favorites.includes(item.i):tab==='custom'?!item.meta.builtin:tab==='used'?item.n>0:recent.includes(item.i)))
  .filter(item=>{const q=search.trim().toLowerCase();return !q||item.hex.toLowerCase().includes(q)||String(item.i+1).includes(q)||item.meta.name.toLowerCase().includes(q)})
  .sort((a,b)=>order==='usage'?b.n-a.n||a.i-b.i:a.i-b.i);
 const picker=typeof window!=='undefined'&&'EyeDropper' in window;
 useEffect(()=>{if(editing===null){setDraft(colors[selected]||'#E7A097');setInputHex(colors[selected]||'#E7A097');setTo(selected)}},[selected,editing]);
 const hsv=hsvFromHex(draft),channels=rgb(draft);
 const commitDraft=(hex:string)=>{const c=normalizeHex(hex);if(c){setDraft(c);setInputHex(c)}else setInputHex(hex)};
 const setChannel=(k:number,value:number)=>{const next=[...channels];next[k]=Math.max(0,Math.min(255,value));commitDraft('#'+next.map(c=>c.toString(16).padStart(2,'0')).join(''))};
 const setHSV=(kind:'h'|'s'|'v',n:number)=>{const next={...hsv,[kind]:n};commitDraft(hexFromHSV(next.h,next.s,next.v))};
 const toast=(s:string)=>{setMessage(s)};
 function startEdit(index:number){if(index<BUILTIN_COLOR_COUNT)return;setEditing(index);setDraft(colors[index]);setInputHex(colors[index]);setColorName(colorMeta(index).name);setReplaceWhenEditing(true);setMessage('编辑颜色值时会创建新色号，旧作品保持原样；可勾选替换当前画板。')}
 function saveColor(){
  try{
   if(!normalizeHex(inputHex))throw Error('HEX 格式应为 #RRGGBB');
   const name=colorName.trim()||'我的颜色';
   if(editing!==null&&draft.toUpperCase()===colors[editing].toUpperCase()){
     onRename(editing,name);toast('颜色名称已保存');setEditing(null);return;
   }
   const index=onAdd(draft,name);
   if(editing!==null&&index!==editing&&replaceWhenEditing&&counts[editing]>0)onReplace(editing,index);
   onChoose(index);setEditing(null);toast(index>=BUILTIN_COLOR_COUNT?'颜色已保存到自定义色库':'这个颜色已经存在，已选中');
  }catch(e){toast(e instanceof Error?e.message:'无法保存颜色')}
 }
 function replaceColor(){if(from===null||from===to){toast('请先选择不同的源颜色和目标颜色');return}
  if(!counts[from]){toast('当前作品还没有使用该颜色');return}
  if(window.confirm('将当前作品中的 '+counts[from]+' 颗 '+colorMeta(from).name+' 更换为 '+colorMeta(to).name+'？\n此操作可以撤销。')){onReplace(from,to);toast('已完成换色，可用 Ctrl+Z 撤销')}}
 const pickScreen=async()=>{try{
  const C=(window as Window&{EyeDropper?:new()=>{open:()=>Promise<{sRGBHex:string}>}}).EyeDropper;
  if(!C){toast('此浏览器暂不支持屏幕取色，可使用下方颜色选择器');return}
  const sample=await new C().open();commitDraft(sample.sRGBHex);
 }catch(e){if(e instanceof Error&&e.name!=='AbortError')toast('屏幕取色未完成')}};
 const copy=async()=>{try{await navigator.clipboard.writeText(draft);toast('已复制 '+draft)}catch{toast('复制失败，可以直接选择 HEX 输入框复制')}};
 return <div className="color-studio">
  <div className="color-header"><div><span>MY COLOR LIBRARY</span><h2>我的拼豆色彩</h2></div><button className="quiet-button" title="关闭颜色管理" onClick={onClose}><X size={18}/></button></div>
  <p className="color-subtitle">精准取色、收藏配色、整理作品中用到的每一种颜色。</p>
  <div className="color-active"><span style={{background:colors[selected]}}/><div><small>当前画笔颜色 · #{selected+1}</small><strong>{colorMeta(selected).name}</strong><code>{colors[selected]}</code></div><button aria-label="收藏当前色" title="收藏当前色" onClick={()=>onFavorite(selected)} className={favorites.includes(selected)?'on':''}><Star size={17} fill={favorites.includes(selected)?'#d19a87':'none'}/></button></div>
  <div className="color-tabs" role="tablist" aria-label="颜色列表分类">{tabs.map(t=><button role="tab" aria-selected={tab===t.key} className={tab===t.key?'active':''} key={t.key} onClick={()=>setTab(t.key)}>{t.label}</button>)}</div>
  <div className="color-search"><Search size={15}/><input aria-label="搜索颜色" value={search} placeholder="搜索色号 / HEX / 名称" onChange={e=>setSearch(e.target.value)}/><select aria-label="颜色排序" value={order} onChange={e=>setOrder(e.target.value as 'code'|'usage')}><option value="code">色号</option><option value="usage">用量</option></select></div>
  <div className="color-list" role="list">{results.map(item=><div role="listitem" key={item.i} className={'color-item '+(selected===item.i?'active':'')+(item.meta.archived?' is-archived':'')}>
    <button className="color-main" onClick={()=>{onChoose(item.i);setTo(item.i)}} title={item.hex}><span className="color-dot" style={{background:item.hex}}/ ><span><b>{item.meta.name}</b><small>#{String(item.i+1).padStart(2,'0')} · {item.hex}</small></span>{item.n>0&&<em>{item.n} 颗</em>}</button>
    <button className={'color-mini '+(favorites.includes(item.i)?'is-star':'')} title="收藏 / 取消收藏" onClick={()=>onFavorite(item.i)}><Star size={15} fill={favorites.includes(item.i)?'#d3a08d':'none'}/></button>
    {!item.meta.builtin&&<button className="color-mini" title="编辑自定义颜色" onClick={()=>startEdit(item.i)}><Palette size={15}/></button>}
   </div>)}
   {results.length===0&&<p className="color-empty">这里还没有符合条件的颜色。试着更换筛选条件吧 ✳</p>}
  </div>
  <div className="color-archive-row"><span>{visible.length} 个可用色 · {used.length} 个作品用色</span><label><input type="checkbox" checked={archived} onChange={e=>setArchivedVisible(e.target.checked)}/> 显示归档</label></div>
  {editing!==null&&<div className="edit-warning"><span>正在编辑：{colorMeta(editing).name}</span><button onClick={()=>{setEditing(null);setColorName('我的颜色');setMessage('')}}>取消编辑</button>{colorMeta(editing).archived?<button onClick={()=>{onArchive(editing,false);toast('已恢复至色板')}}>恢复到色板</button>:<button onClick={()=>{if(counts[editing]>0&&!window.confirm('此颜色当前正在作品中使用。归档只隐藏色板项，不会删除已绘制的拼豆。继续吗？'))return;onArchive(editing,true);toast('已归档。作品颜色不会改变');setEditing(null)}}>归档此色</button>}</div>}
  <section className="color-creator"><div className="color-section-title"><strong>{editing!==null?'编辑自定义颜色':'创建自定义颜色'}</strong><span>HEX · RGB · HSV</span></div>
    <div className="color-picker-head"><input type="color" aria-label="原生颜色选择器" title="打开系统颜色选择器" value={draft} onChange={e=>commitDraft(e.target.value)}/><label>HEX <input aria-label="十六进制颜色" spellCheck={false} value={inputHex} onChange={e=>commitDraft(e.target.value)} onBlur={()=>{if(!normalizeHex(inputHex))setInputHex(draft)}}/></label><button onClick={copy} title="复制 HEX"><Copy size={16}/></button><button onClick={pickScreen} disabled={!picker} title={picker?'从屏幕任意位置取色':'此浏览器不支持屏幕取色'}><Eye size={17}/></button></div>
    <div className="color-hsv">{([{key:'h',name:'色相',max:360,value:hsv.h},{key:'s',name:'饱和度',max:100,value:hsv.s},{key:'v',name:'明度',max:100,value:hsv.v}] as {key:'h'|'s'|'v';name:string;max:number;value:number}[]).map(o=><label key={o.key}><span>{o.name}</span><input type="range" min={0} max={o.max} value={Math.round(o.value)} onChange={e=>setHSV(o.key,+e.target.value)}/><b>{Math.round(o.value)}{o.key==='h'?'°':'%'}</b></label>)}</div>
    <div className="color-rgb">{channels.map((c,i)=><label key={i}>{['R','G','B'][i]}<input type="number" min={0} max={255} value={c} onChange={e=>setChannel(i,Number(e.target.value)||0)}/></label>)}</div>
    <label className="color-name-input">自定义名称<input value={colorName} maxLength={30} placeholder="例如：草莓奶油粉" onChange={e=>setColorName(e.target.value)}/></label>
    {editing!==null&&counts[editing]>0&&<label className="color-replace-toggle"><input type="checkbox" checked={replaceWhenEditing} onChange={e=>setReplaceWhenEditing(e.target.checked)}/> 同时替换当前作品中使用的 {counts[editing]} 颗旧颜色（可撤销）</label>}
    <button className="color-save" disabled={!normalizeHex(inputHex)} onClick={saveColor}><Plus size={17}/>{editing===null?'保存到我的色库':'保存编辑结果'}</button>
  </section>
  <section className="color-replacer"><div className="color-section-title"><strong>整幅作品快速换色</strong><span>支持撤销</span></div><p>将当前作品中指定颜色的所有拼豆一次性替换，无需逐颗修改。</p>
   <div className="color-replace-select"><label>替换<input type="color" aria-label="源颜色预览" readOnly value={colors[from??selected]||'#FFFFFF'} /><select aria-label="要替换的作品颜色" value={from??''} onChange={e=>setFrom(e.target.value===''?null:+e.target.value)}><option value="">选择已有颜色</option>{used.map(({i,n})=><option key={i} value={i}>{colorMeta(i).name} ({n}颗)</option>)}</select></label>
   <Shuffle size={17}/><label>换成<input type="color" aria-label="目标颜色预览" readOnly value={colors[to]||'#FFFFFF'}/><select aria-label="目标颜色" value={to} onChange={e=>setTo(+e.target.value)}>{visible.map(i=><option key={i} value={i}>{colorMeta(i).name} #{i+1}</option>)}</select></label></div>
   <button className="color-replace-button" disabled={from===null||from===to||!counts[from]} onClick={replaceColor}>替换作品中的所有同色拼豆</button>
  </section>
  <div className="color-library-actions"><button onClick={onExport}><Download size={15}/> 导出自定义色库</button><button onClick={()=>fileRef.current?.click()}><Import size={15}/> 导入色库</button><input ref={fileRef} hidden type="file" accept=".json,application/json" onChange={e=>{const f=e.target.files?.[0];if(f)onImport(f);e.target.value=''}}/></div>
  {message&&<div className="color-toast" role="status"><Check size={14}/>{message}<button onClick={()=>setMessage('')}><X size={13}/></button></div>}
  <p className="color-note">基础色号不会变动。编辑颜色值会创建新色，旧作品与其他项目中的原颜色不会被覆盖。自定义颜色最多 80 个；归档不会重用色号。</p>
 </div>
}
