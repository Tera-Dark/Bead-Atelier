import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDownToLine, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Download, Eraser, Eye, EyeOff, FileImage, FolderOpen, Grid2X2, Hand, Heart, ImagePlus, Layers3, Maximize2, Minus, Paintbrush, PaintBucket, Palette, PanelLeftClose, PanelLeftOpen, Pipette, Play, Pause, Printer, Redo2, RotateCcw, Settings2, SlidersHorizontal, Sparkles, Star, Undo2, Volume2, VolumeX, X, ZoomIn, ZoomOut, Box, BookOpen } from 'lucide-react';
import Scene from './Scene';
import FlatBoard, { type BeadRenderStyle, MIN_ZOOM, MAX_ZOOM } from './FlatBoard';
import BeadPreview from './BeadPreview';
import Minimap from './Minimap';
import PatternSheet from './PatternSheet';
import TemplateThumb from './TemplateThumb';
import { AmbientAudio } from './audio';
import { BeadSfx } from './sfx';
import { Board, colors, boardSize, empty, restore, resizeBoard, colorCounts, SUPPORTED_SIZES } from './board';
import { templates } from './templates';
import { convertImage, type ImageOptions } from './imageConversion';

type Tool = 'brush'|'erase'|'fill'|'picker'|'hand';
type Section = 'editor'|'pattern';
type Drawer = 'templates'|'image'|null;
type Settings = { grid:boolean;volume:number;sfx:boolean;sfxVolume:number };
type Panels = { rail:boolean;tools:boolean;palette:boolean;frequent:boolean;minimap:boolean;playback:boolean;status:boolean };
const settingsDefaults:Settings = {grid:true,volume:35,sfx:true,sfxVolume:45};
const panelsDefaults:Panels = {rail:true,tools:true,palette:true,frequent:true,minimap:true,playback:true,status:true};
function loadValue<T>(key:string,fallback:T):T{try{return {...fallback,...JSON.parse(localStorage.getItem(key)||'{}')} as T}catch{return fallback}}
function download(blob:Blob,name:string){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1200)}
function saveTextFile(text:string,name:string,type:string){download(new Blob([text],{type}),name)}
function clamp(n:number,min:number,max:number){return Math.min(max,Math.max(min,n))}
const toolItems:[Tool,string,typeof Paintbrush][]=[['brush','画笔',Paintbrush],['erase','擦除',Eraser],['fill','填色',PaintBucket],['picker','取色',Pipette],['hand','平移',Hand]];

export default function App(){
 const [board,setBoard]=useState<Board>(restore),boardRef=useRef<Board>(board);
 const history=useRef<Board[]>([]),redoHistory=useRef<Board[]>([]);
 const [selected,setSelected]=useState(0),[tool,setTool]=useState<Tool>('brush');
 const [renderStyle,setRenderStyle]=useState<BeadRenderStyle>(()=>{const v=localStorage.getItem('atelier-render-style');return v==='beads'||v==='dots'||v==='chart'||v==='pixel'?v:'pixel'});
 const [view,setView]=useState<'2d'|'3d'>('2d'),[section,setSection]=useState<Section>('editor'),[drawer,setDrawer]=useState<Drawer>(null);
 const [name,setName]=useState(()=>localStorage.getItem('atelier-name')||'未命名作品');
 const [settings,setSettings]=useState<Settings>(()=>loadValue('atelier-settings',settingsDefaults));
 const [panels,setPanels]=useState<Panels>(()=>loadValue('atelier-panels',panelsDefaults));
 const [layoutOpen,setLayoutOpen]=useState(false),[help,setHelp]=useState(false),[preferences,setPreferences]=useState(false),[codesOpen,setCodesOpen]=useState(false);
 const [music,setMusic]=useState(false),musicRef=useRef<AmbientAudio|null>(null),sfxRef=useRef<BeadSfx|null>(null);
 const [zoom,setZoom]=useState(100),[pan,setPan]=useState({x:0,y:0}),[metrics,setMetrics]=useState({width:760,height:600,boardPx:570});
 const [fused,setFused]=useState(false),[placed,setPlaced]=useState(-1),[placementId,setPlacementId]=useState(0);
 const [favorites,setFavorites]=useState<number[]>(()=>{try{const a=JSON.parse(localStorage.getItem('atelier-favorites')||'null');return Array.isArray(a)?a.filter((x:unknown)=>typeof x==='number'&&x>=0&&x<colors.length).slice(0,8):[0,1,2,4,8]}catch{return[0,1,2,4,8]}});
 const [guide,setGuide]=useState<Board|null>(null),[guideName,setGuideName]=useState(''),[finish,setFinish]=useState(false);
 const [auto,setAuto]=useState<'idle'|'playing'|'paused'>('idle'),[speed,setSpeed]=useState(58);
 const autoTimer=useRef<number|undefined>(undefined),autoTarget=useRef<Board|null>(null),autoOrder=useRef<number[]>([]),autoIndex=useRef(0),snapshot=useRef<Board|null>(null);
 const [imageFile,setImageFile]=useState<File|null>(null),[imageUrl,setImageUrl]=useState<string|null>(null);
 const [imageOpts,setImageOpts]=useState<ImageOptions>({size:24,maxColors:12,dither:false,fit:'contain',transparent:true});
 const [imageResult,setImageResult]=useState<Board|null>(null),[imageError,setImageError]=useState(''),[converting,setConverting]=useState(false);
 const [patternLabels,setPatternLabels]=useState(true),[codes,setCodes]=useState<string[]>(()=>{try{const a=JSON.parse(localStorage.getItem('atelier-codes')||'null');return Array.isArray(a)?Array.from({length:16},(_,i)=>typeof a[i]==='string'?a[i].slice(0,6):''):Array(16).fill('')}catch{return Array(16).fill('')}});
 const imageInput=useRef<HTMLInputElement>(null),projectInput=useRef<HTMLInputElement>(null);
 const size=boardSize(board),count=board.filter(v=>v!==null).length,used=colorCounts(board);
 const inGuide=guide!==null&&guide.length===board.length;
 const guidedCount=inGuide?board.filter((v,i)=>guide[i]!==null&&v===guide[i]).length:0;
 const guidedTotal=inGuide?guide.filter(v=>v!==null).length:0;
 boardRef.current=board;
 useEffect(()=>localStorage.setItem('atelier-board',JSON.stringify(board)),[board]);
 useEffect(()=>localStorage.setItem('atelier-name',name),[name]);
 useEffect(()=>localStorage.setItem('atelier-render-style',renderStyle),[renderStyle]);
 useEffect(()=>{localStorage.setItem('atelier-settings',JSON.stringify(settings));musicRef.current?.setVolume(settings.volume/100)},[settings]);
 useEffect(()=>localStorage.setItem('atelier-panels',JSON.stringify(panels)),[panels]);
 useEffect(()=>localStorage.setItem('atelier-favorites',JSON.stringify(favorites)),[favorites]);
 useEffect(()=>localStorage.setItem('atelier-codes',JSON.stringify(codes)),[codes]);
 useEffect(()=>()=>{musicRef.current?.stop();sfxRef.current?.dispose();if(autoTimer.current!==undefined)clearInterval(autoTimer.current)},[]);
 useEffect(()=>{if(!imageFile){setImageResult(null);return}let cancelled=false;setConverting(true);setImageError('');convertImage(imageFile,imageOpts).then(b=>{if(!cancelled)setImageResult(b)}).catch(e=>{if(!cancelled){setImageError(e instanceof Error?e.message:'转换失败');setImageResult(null)}}).finally(()=>{if(!cancelled)setConverting(false)});return()=>{cancelled=true}},[imageFile,imageOpts]);
 useEffect(()=>{if(!imageFile){setImageUrl(null);return}const u=URL.createObjectURL(imageFile);setImageUrl(u);return()=>URL.revokeObjectURL(u)},[imageFile]);
 const onViewport=useCallback((r:{width:number;height:number;boardPx:number})=>setMetrics(old=>old.width===r.width&&old.height===r.height&&old.boardPx===r.boardPx?old:r),[]);
 const onZoom=useCallback((n:number)=>setZoom(clamp(n,MIN_ZOOM,MAX_ZOOM)),[]);
 const ui=(key:keyof Panels)=>setPanels(p=>({...p,[key]:!p[key]}));
 const feedback=(i:number,kind:'place'|'erase'|'complete'='place')=>{if(settings.sfx){if(!sfxRef.current)sfxRef.current=new BeadSfx();sfxRef.current.play(kind,settings.sfxVolume/100)}setPlaced(i);setPlacementId(t=>t+1)};
 function commit(next:Board){history.current.push([...boardRef.current]);if(history.current.length>90)history.current.shift();redoHistory.current=[];boardRef.current=next;setBoard(next)}
 function stopTimer(){if(autoTimer.current!==undefined)clearInterval(autoTimer.current);autoTimer.current=undefined}
 function resetAuto(){stopTimer();setAuto('idle');autoTarget.current=null;autoOrder.current=[];autoIndex.current=0;snapshot.current=null}
 function resetGuide(){resetAuto();setGuide(null);setFinish(false)}
 function act(i:number){if(auto!=='idle')return;const current=boardRef.current;if(i<0||i>=current.length||tool==='hand')return;
 if(tool==='picker'){const c=current[i]??(inGuide?guide[i]:null);if(c!==null){setSelected(c);setTool('brush')}return}
 const v=tool==='erase'?null:selected;
 if(inGuide&&v!==null&&guide[i]!==v)return;
 if(tool==='fill'){if(inGuide)return;const target=current[i];if(target===v)return;const next=[...current],stack=[i],seen=new Set<number>(),n=boardSize(current);while(stack.length){const p=stack.pop()!;if(seen.has(p)||next[p]!==target)continue;seen.add(p);next[p]=v;const x=p%n,y=Math.floor(p/n);if(x>0)stack.push(p-1);if(x<n-1)stack.push(p+1);if(y>0)stack.push(p-n);if(y<n-1)stack.push(p+n)}commit(next);feedback(i);return}
 if(current[i]===v)return;const next=[...current];next[i]=v;commit(next);feedback(i,tool==='erase'?'erase':'place');
 if(inGuide&&next.every((c,k)=>c===guide[k])){setFinish(true);feedback(i,'complete')}}
 function undo(){if(auto!=='idle')return;const b=history.current.pop();if(!b)return;redoHistory.current.push([...boardRef.current]);boardRef.current=b;setBoard(b)}
 function redo(){if(auto!=='idle')return;const b=redoHistory.current.pop();if(!b)return;history.current.push([...boardRef.current]);boardRef.current=b;setBoard(b)}
 useEffect(()=>{function onKey(e:KeyboardEvent){if(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement)return;const key=e.key.toLowerCase();if((e.metaKey||e.ctrlKey)&&key==='z'){e.preventDefault();if(e.shiftKey)redo();else undo()}else if((e.metaKey||e.ctrlKey)&&key==='y'){e.preventDefault();redo()}else if(!e.ctrlKey&&!e.metaKey&&!e.altKey){if(key==='b')setTool('brush');if(key==='e')setTool('erase');if(key==='g')setTool('fill');if(key==='i')setTool('picker');if(key==='h')setTool('hand')}}window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[auto]);
 function selectColor(i:number){setSelected(i);setTool('brush')}
 function toggleFavorite(i:number){setFavorites(prev=>prev.includes(i)?prev.filter(v=>v!==i):[i,...prev].slice(0,8))}
 function switchSize(n:number){if(n===size)return;const next=resizeBoard(boardRef.current,n);if(n<size&&next.filter(v=>v!==null).length<count&&!window.confirm('缩小底板会裁掉边缘部分的拼豆，确定继续吗？'))return;resetGuide();commit(next);setZoom(100);setPan({x:0,y:0});setImageOpts(o=>({...o,size:n}))}
 function useTemplate(t:typeof templates[number],guided:boolean){resetGuide();const target=[...t.board];if(guided){setGuide(target);setGuideName(t.name);commit(empty(t.size));setName(t.name+' · 跟拼');setSelected(t.palette[0]??0)}else{commit(target);setName(t.name)}setSection('editor');setView('2d');setDrawer(null);setTool('brush');setZoom(100);setPan({x:0,y:0});setImageOpts(o=>({...o,size:t.size}))}
 function onImageSelected(f?:File){if(!f)return;if(!f.type.startsWith('image/')){setImageError('请选择有效图片');return}setImageFile(f);setDrawer('image');setSection('editor')}
 function applyImage(){if(!imageResult)return;resetGuide();commit([...imageResult]);setView('2d');setSection('editor');setDrawer(null);setZoom(100);setPan({x:0,y:0});setName(imageFile?.name.replace(/\.[^.]+$/,'')||'图片拼豆作品')}
 function toggleMusic(){if(music){musicRef.current?.stop();setMusic(false)}else{const a=new AmbientAudio();try{a.start(settings.volume/100);musicRef.current=a;setMusic(true)}catch{setMusic(false)}}}
 function tickAuto(){const i=autoOrder.current[autoIndex.current++];if(i===undefined){stopTimer();setAuto('idle');setFinish(true);feedback(-1,'complete');return}const next=[...boardRef.current];next[i]=autoTarget.current?.[i]??null;boardRef.current=next;setBoard(next);feedback(i)}
 function runAuto(){stopTimer();setAuto('playing');autoTimer.current=window.setInterval(tickAuto,Math.max(17,178-speed*1.55))}
 function toggleAuto(){if(settings.sfx){if(!sfxRef.current)sfxRef.current=new BeadSfx();sfxRef.current.unlock()}if(auto==='playing'){stopTimer();setAuto('paused');return}if(auto==='paused'){runAuto();return}const target=inGuide?[...guide]:[...boardRef.current];if(!target.some(v=>v!==null))return;history.current.push([...boardRef.current]);redoHistory.current=[];snapshot.current=[...boardRef.current];autoTarget.current=target;autoOrder.current=target.map((v,i)=>v===null?-1:i).filter(i=>i>=0);autoIndex.current=0;boardRef.current=empty(boardSize(target));setBoard(boardRef.current);setSection('editor');setView('2d');setFinish(false);runAuto()}
 function restoreAuto(){stopTimer();setAuto('idle');if(snapshot.current){const next=[...snapshot.current];boardRef.current=next;setBoard(next)}snapshot.current=null;autoTarget.current=null;setFinish(false)}
 function saveProject(){saveTextFile(JSON.stringify({version:3,name,size,palette:colors,board},null,2),(name||'拼豆作品')+'.json','application/json')}
 function loadProject(f?:File){if(!f)return;const reader=new FileReader();reader.onload=()=>{try{const v=JSON.parse(String(reader.result));if(!SUPPORTED_SIZES.some(s=>s===v.size)||!Array.isArray(v.board)||v.board.length!==v.size*v.size||!v.board.every((x:unknown)=>x===null||(typeof x==='number'&&Number.isInteger(x)&&x>=0&&x<colors.length)))throw Error('项目格式或尺寸不受支持');resetGuide();commit(v.board);setName(typeof v.name==='string'?v.name:'导入的作品');setView('2d');setSection('editor');setDrawer(null);setZoom(100);setPan({x:0,y:0})}catch(e){alert(e instanceof Error?e.message:'项目文件读取失败')}};reader.readAsText(f)}
 function exportPNG(){const canvas=document.createElement('canvas'),unit=28;canvas.width=size*unit;canvas.height=size*unit;const ctx=canvas.getContext('2d');if(!ctx)return;ctx.fillStyle='#faf8f5';ctx.fillRect(0,0,canvas.width,canvas.height);board.forEach((v,i)=>{const x=(i%size+.5)*unit,y=(Math.floor(i/size)+.5)*unit;ctx.fillStyle=v===null?'#e9e2d8':colors[v];ctx.beginPath();ctx.arc(x,y,v===null?3:11,0,Math.PI*2);ctx.fill();if(v!==null){ctx.fillStyle='#fff9f3';ctx.beginPath();ctx.arc(x,y,3.6,0,Math.PI*2);ctx.fill()}});canvas.toBlob(blob=>{if(blob)download(blob,(name||'拼豆作品')+'.png')})}
 function exportPatternSvg(){const svg=document.getElementById('pattern-svg');if(svg){saveTextFile(new XMLSerializer().serializeToString(svg),(name||'拼豆图纸')+'.svg','image/svg+xml;charset=utf-8')}else{setSection('pattern');setDrawer(null)}}
 function exportMaterialCSV(){const rows=['色号,RGB颜色,用量',...used.map(v=>[(codes[v.i]?.trim()||String(v.i+1).padStart(2,'0')),v.hex,v.count].join(','))];saveTextFile('\uFEFF'+rows.join('\r\n'),(name||'拼豆作品')+'-材料清单.csv','text/csv;charset=utf-8')}
 function clearBoard(){if(!window.confirm('清空画板？可以使用撤销恢复。'))return;resetGuide();commit(empty(size));setSection('editor')}
 const patternCodes=codes.some(c=>c.trim())?codes.map((c,i)=>c.trim()||String(i+1).padStart(2,'0')):undefined;
 const portrait=()=>setSection('editor');
 return <div className="atelier-app">
  <header className="atelier-header">
   <button className="atelier-brand" onClick={()=>{portrait();setDrawer(null)}} aria-label="返回工作台"><img src="./bead-paw.png" alt="四色拼豆爪爪" width="39" height="39"/><span>bead atelier<span className="brand-stop">.</span><small>拼豆创作工作室</small></span></button>
   <div className="header-project"><input aria-label="作品名称" value={name} maxLength={40} onChange={e=>setName(e.target.value)}/><span className="saved-label"><Check size={13}/> 已自动保存</span></div>
   <div className="header-right">
    <button className="bare-icon" title={music?'关闭音乐':'开启音乐'} onClick={toggleMusic}>{music?<Volume2 size={19}/>:<VolumeX size={19}/>}</button>
    <button className={'bare-icon '+(layoutOpen?'active':'')} title="布局与窗口显隐" onClick={()=>setLayoutOpen(p=>!p)}><SlidersHorizontal size={19}/></button>
    <button className="bare-icon" title="工作室设置" onClick={()=>setPreferences(true)}><Settings2 size={19}/></button>
    <button className="bare-icon help-trigger" title="帮助" onClick={()=>setHelp(true)}><CircleHelp size={19}/></button>
    <details className="export-dropdown"><summary><Download size={16}/> 导出 <ChevronDown size={14}/></summary><div className="export-options"><button onClick={exportPNG}><FileImage size={16}/> 图片 PNG</button><button onClick={saveProject}><FolderOpen size={16}/> 项目 JSON</button><button onClick={()=>{setSection('pattern');setDrawer(null)}}><BookOpen size={16}/> 拼豆图纸</button><button onClick={exportMaterialCSV}><Layers3 size={16}/> 材料清单 CSV</button></div></details>
   </div>
   {layoutOpen&&<div className="layout-pop"><div className="layout-title"><strong>个性化工作台</strong><button onClick={()=>{setPanels(panelsDefaults);setLayoutOpen(false)}}>恢复默认</button></div>{([['rail','主导航'],['tools','绘画工具'],['palette','完整色板'],['frequent','常用颜色'],['minimap','右上角缩略图'],['playback','自动拼豆'],['status','底部状态']] as [keyof Panels,string][]).map(([key,label])=><label key={key}><span>{label}</span><input type="checkbox" checked={panels[key]} onChange={()=>ui(key)}/></label>)}<button className="layout-close" onClick={()=>setLayoutOpen(false)}>完成</button></div>}
  </header>
  <div className="atelier-shell">
   {panels.rail&&<nav className="activity-rail" aria-label="工作台导航"><div className="rail-primary">
    <button className={'rail-tab '+(section==='editor'&&!drawer?'active':'')} onClick={()=>{setSection('editor');setDrawer(null)}}><Paintbrush size={21}/><span>创作</span></button>
    <button className={'rail-tab '+(drawer==='templates'?'active':'')} onClick={()=>{setSection('editor');setDrawer(x=>x==='templates'?null:'templates')}}><Heart size={21}/><span>模板</span></button>
    <button className={'rail-tab '+(drawer==='image'?'active':'')} onClick={()=>{setSection('editor');setDrawer(x=>x==='image'?null:'image')}}><ImagePlus size={21}/><span>图片</span></button>
    <button className={'rail-tab '+(section==='pattern'?'active':'')} onClick={()=>{setSection('pattern');setDrawer(null)}}><BookOpen size={21}/><span>图纸</span></button>
   </div><div className="rail-secondary"><button className="rail-tab" onClick={()=>setPreferences(true)}><Settings2 size={20}/><span>设置</span></button></div></nav>}
   {!panels.rail&&<button className="restore-rail" onClick={()=>ui('rail')} title="显示导航"><PanelLeftOpen size={18}/></button>}
   {drawer&&<aside className="context-drawer"><div className="drawer-heading"><div><small>YOUR LITTLE STUDIO</small><h2>{drawer==='templates'?'可爱模板馆':'图片转拼豆'}</h2></div><button className="quiet-button" title="收起侧栏" onClick={()=>setDrawer(null)}><ChevronLeft size={19}/></button></div>
    {drawer==='templates'?<><p className="drawer-intro">这次从像素画本身出发设计：有表情、有轮廓，也有小配饰。挑一只慢慢拼吧。</p><div className="template-collection-note"><Sparkles size={14}/> 原创像素图案 · 非临摹或搬运图纸</div><div className="template-list">{templates.map(t=><div className="template-entry" key={t.id} title={t.description}><button className="template-preview" onClick={()=>useTemplate(t,false)}><TemplateThumb board={t.board} renderStyle="pixel"/></button><div className="template-details"><strong>{t.name}</strong><small>{t.size}×{t.size} · {t.palette.length} 色 · {t.count} 颗</small><span className={'difficulty '+(t.size===52?'advanced':'')}>{t.difficulty}</span></div><div className="template-actions"><button onClick={()=>useTemplate(t,true)}>跟着拼</button><button onClick={()=>useTemplate(t,false)}>打开作品</button></div></div>)}</div></>:
    <><p className="drawer-intro">上传照片或插画，选择底板大小、色数和转换方式，再预览效果。</p><button className="upload-zone" onClick={()=>imageInput.current?.click()}><ImagePlus size={30}/><strong>{imageFile?'更换图片':'选择图片'}</strong><small>PNG · JPG · WEBP</small></button>
      {imageFile&&<><div className="conversion-compare"><div><span>原始图片</span>{imageUrl&&<img src={imageUrl} alt="原图预览"/>}</div><div><span>拼豆效果</span>{converting?<div className="preview-loading">正在转换…</div>:imageResult?<BeadPreview board={imageResult} showEmpty/>:<div className="preview-loading">等待预览</div>}</div></div>
      <div className="convert-settings"><label>底板规格<select value={imageOpts.size} onChange={e=>setImageOpts(s=>({...s,size:+e.target.value}))}>{SUPPORTED_SIZES.map(n=><option key={n} value={n}>{n} × {n}</option>)}</select></label><label>色彩数量 <b>{imageOpts.maxColors} 色</b><input type="range" min="2" max="16" value={imageOpts.maxColors} onChange={e=>setImageOpts(s=>({...s,maxColors:+e.target.value}))}/></label><label>裁剪方式<select value={imageOpts.fit} onChange={e=>setImageOpts(s=>({...s,fit:e.target.value as ImageOptions['fit']}))}><option value="contain">完整显示（留白）</option><option value="cover">填满画板（裁剪）</option></select></label><label>色彩抖动<input type="checkbox" checked={imageOpts.dither} onChange={e=>setImageOpts(s=>({...s,dither:e.target.checked}))}/></label><label>保留透明区域<input type="checkbox" checked={imageOpts.transparent} onChange={e=>setImageOpts(s=>({...s,transparent:e.target.checked}))}/></label></div>
      {imageError&&<p className="convert-error">{imageError}</p>}<button className="apply-conversion" disabled={!imageResult||converting} onClick={applyImage}><Sparkles size={17}/> 使用这个拼豆图案</button></>}
      <p className="conversion-notice">使用本地 Lab 近似色差匹配与可选误差扩散，不上传图片。内置色板目前并非某品牌官方色号。</p></>}
   </aside>}
   <main className="atelier-workspace">
    <div className="workspace-heading"><div className="workspace-heading-left"><span className="workspace-overline">BEAD ATELIER <b>/</b> {section==='pattern'?'图纸制作':'自由创作'}</span><h1>{section==='pattern'?'一颗一颗，都有迹可循。':'把喜欢的颜色，慢慢拼出来。'}<span> ✳</span></h1></div>
      <div className="workspace-view">{section==='editor'?<>{view==='2d'&&<label className="render-style-picker"><span>绘制样式</span><select aria-label="画板显示样式" value={renderStyle} onChange={e=>setRenderStyle(e.target.value as BeadRenderStyle)}><option value="pixel">▦ 像素色块</option><option value="beads">◉ 拼豆圆环</option><option value="dots">● 糖果圆点</option><option value="chart">▤ 色号方格</option></select></label>}<div className="view-tabs"><button className={view==='2d'?'current':''} onClick={()=>setView('2d')}><Grid2X2 size={16}/> 平面</button><button className={view==='3d'?'current':''} onClick={()=>setView('3d')}><Box size={16}/> 3D 预览</button></div>{view==='3d'&&<button className={'fuse-mode '+(fused?'active':'')} onClick={()=>setFused(v=>!v)} title="切换普通拼豆与熨烫后预览（视觉模拟）"><Sparkles size={14}/>{fused?'返回拼豆':'熨烫预览'}</button>}</>:<button className="soft-action" onClick={()=>setSection('editor')}><ChevronLeft size={16}/> 返回创作</button>}</div>
    </div>
    {section==='editor'?<div className="editor-surface">
      <div className="board-area">
       {view==='2d'?<FlatBoard board={board} tool={tool} selected={selected} onCell={act} grid={settings.grid} zoom={zoom} justPlaced={placed} placementId={placementId} guide={inGuide?guide:null} renderStyle={renderStyle} pan={pan} onPan={setPan} onZoom={onZoom} onViewport={onViewport}/>:<Scene board={board} size={size} paint={act} selected={selected} erase={tool==='erase'} fused={fused} justPlaced={placed} placementId={placementId}/>}
       <div className="board-size-pill" onClick={()=>setPreferences(true)} title="在设置中更改底板尺寸">{size} × {size}</div>
       {view==='2d'&&panels.minimap&&<div className="mini-host"><Minimap board={board} zoom={zoom} pan={pan} viewport={metrics} onNavigate={setPan}/><button className="panel-dismiss" title="隐藏缩略图" onClick={()=>ui('minimap')}><X size={13}/></button></div>}
       {view==='2d'&&panels.frequent&&<div className="frequent-palette"><div className="frequent-title"><span><Star size={13}/> 常用颜色</span><button title="隐藏常用色板" onClick={()=>ui('frequent')}><X size={12}/></button></div><div className="favorite-swatches">{favorites.map(i=><button key={i} aria-label={'选择常用颜色 '+(i+1)} className={i===selected?'chosen':''} style={{background:colors[i]}} title={'选择色号 '+String(i+1).padStart(2,'0')} onClick={()=>selectColor(i)}/>)}</div><button className="pin-color" onClick={()=>toggleFavorite(selected)}><Star size={12} fill={favorites.includes(selected)?'#d39c7c':'none'}/>{favorites.includes(selected)?'取消收藏当前颜色':'收藏当前颜色'}</button></div>}
       {inGuide&&<div className="guide-chip"><span>🐾 {guideName}</span><strong>{guidedCount} / {guidedTotal}</strong><button onClick={resetGuide} title="退出跟拼"><X size={15}/></button></div>}{inGuide&&<div className="guide-color-step"><b>分颜色慢慢拼</b><div>{colorCounts(guide).map(c=><button title={'选择 '+String(c.i+1).padStart(2,'0')+' 号颜色'} key={c.i} className={selected===c.i?'active':''} style={{borderColor:selected===c.i?c.hex:'transparent'}} onClick={()=>selectColor(c.i)}><i style={{background:c.hex}}/><small>{board.filter(v=>v===c.i).length}/{c.count}</small></button>)}</div></div>}
       {finish&&<div className="complete-note"><span>✨</span><h3>拼好啦！</h3><p>每一颗拼豆都变成小小快乐。</p><button onClick={()=>{setFinish(false);setView('3d')}}>欣赏 3D 作品</button><button className="text-action" onClick={()=>setFinish(false)}>继续创作</button></div>}
      </div>
      {panels.tools&&<div className="editor-dock"><div className="tool-group">{toolItems.map(([key,label,Icon])=><button key={key} className={'dock-tool '+(tool===key?'active':'')} onClick={()=>setTool(key)} title={label} aria-pressed={tool===key}><Icon size={18}/><span>{label}</span></button>)}</div><span className="dock-divider"/><div className="tool-group"><button className="dock-icon" title="撤销" onClick={undo}><Undo2 size={19}/></button><button className="dock-icon" title="重做" onClick={redo}><Redo2 size={19}/></button></div><span className="dock-divider"/><div className="tool-group zoom-group"><button className="dock-icon" disabled={view==='3d'} onClick={()=>onZoom(zoom-15)} title="缩小"><ZoomOut size={18}/></button><span>{view==='3d'?'3D':zoom+'%'}</span><button className="dock-icon" disabled={view==='3d'} onClick={()=>onZoom(zoom+15)} title="放大"><ZoomIn size={18}/></button><button className="dock-icon fit-canvas" onClick={()=>{setPan({x:0,y:0});setZoom(100)}} title="居中还原"><Maximize2 size={17}/></button></div><button className="dock-hide" title="隐藏工具栏" onClick={()=>ui('tools')}><EyeOff size={15}/></button></div>}
      {panels.palette&&<div className="palette-dock"><div className="palette-label"><Palette size={17}/> 色板 <small>{colors.length} 色</small></div><div className="compact-swatches">{colors.map((c,i)=><button key={i} aria-label={'选择颜色 '+(i+1)} title={'示例色号 '+String(i+1).padStart(2,'0')+' · '+c} className={'compact-swatch '+(selected===i?'selected':'')} onClick={()=>selectColor(i)} onContextMenu={e=>{e.preventDefault();toggleFavorite(i)}}><i style={{background:c}}/></button>)}</div><span className="current-ink"><span style={{background:colors[selected]}}/> {String(selected+1).padStart(2,'0')}</span><button className="dock-hide" title="隐藏色板" onClick={()=>ui('palette')}><EyeOff size={15}/></button></div>}
      {panels.playback&&<div className="play-dock"><span><Sparkles size={16}/> 轻轻一颗，刚刚好</span><button className={auto==='playing'?'playing':''} onClick={toggleAuto}>{auto==='playing'?<><Pause size={14}/> 暂停</>:auto==='paused'?<><Play size={14}/> 继续</>:<><Play size={14}/> 自动拼豆动画</>}</button>{snapshot.current&&<button className="play-restore" onClick={restoreAuto}><RotateCcw size={15}/> 恢复</button>}<label>速度<input type="range" min="10" max="100" value={speed} disabled={auto!=='idle'} onChange={e=>setSpeed(+e.target.value)}/></label><button className="dock-hide" title="隐藏动画栏" onClick={()=>ui('playback')}><EyeOff size={15}/></button></div>}
      {!panels.tools&&!panels.palette&&!panels.playback&&<div className="minimal-reveal"><button onClick={()=>setPanels(p=>({...p,tools:true,palette:true,playback:true}))}><Eye size={16}/> 展开创作工具</button></div>}
     </div>:<div className="pattern-layout"><div className="pattern-preview"><PatternSheet board={board} size={size} name={name} labels={patternLabels} brandCodes={patternCodes}/></div><aside className="pattern-aside"><div className="pattern-aside-eyebrow">PATTERN / 图纸</div><h2>制作，也可以很简单。</h2><p>定位网格、颜色编号、每五格辅助线和用量清单，按纸张格式整理。</p><div className="pattern-info-row"><span>底板</span><strong>{size} × {size}</strong></div><div className="pattern-info-row"><span>拼豆数量</span><strong>{count} 颗</strong></div><div className="pattern-info-row"><span>使用颜色</span><strong>{used.length} 色</strong></div><label className="pattern-option">显示格内编号 <input type="checkbox" checked={patternLabels} onChange={e=>setPatternLabels(e.target.checked)}/></label><button className="pattern-export primary" onClick={()=>window.print()}><Printer size={16}/> 打印 / 保存 PDF</button><button className="pattern-export secondary" onClick={exportPatternSvg}><Download size={16}/> SVG 矢量图</button><button className="pattern-export secondary" onClick={exportMaterialCSV}><Layers3 size={16}/> CSV 材料清单</button><button className="pattern-export tertiary" onClick={()=>setCodesOpen(true)}><Palette size={16}/> 自定义颜色编号</button><p className="pattern-warning">示例色板不是品牌官方色号。自定义编号只更改打印标签，不会更改颜色本身。</p></aside></div>}
    {panels.status&&<footer className="work-status"><span><Layers3 size={16}/> {count} 颗拼豆 <i/> {used.length} 种颜色 <i/> {size} × {size}</span><span><Check size={14}/> 数据本地保存</span></footer>}
   </main>
  </div>
  <input hidden ref={imageInput} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e=>{onImageSelected(e.target.files?.[0]);e.target.value=''}}/>
  <input hidden ref={projectInput} type="file" accept=".json,application/json" onChange={e=>{loadProject(e.target.files?.[0]);e.target.value=''}}/>
  {(help||preferences||codesOpen)&&<div className="dialog-backdrop" onMouseDown={()=>{setHelp(false);setPreferences(false);setCodesOpen(false)}}><section className="atelier-dialog" role="dialog" aria-modal="true" onMouseDown={e=>e.stopPropagation()}><button className="dialog-close" onClick={()=>{setHelp(false);setPreferences(false);setCodesOpen(false)}} aria-label="关闭"><X size={20}/></button><span className="workspace-overline">{codesOpen?'COLOR LABELS':preferences?'PREFERENCES':'HELLO, MAKER'}</span><h2>{codesOpen?'设置自己的色号':preferences?'小小工作室设置':'欢迎来到 Bead Atelier ✳'}</h2>
   {codesOpen?<><p className="guide-text">可填写已有品牌的真实色号用于图纸标注。留空会显示默认编号；这里不会自动验证品牌对应颜色。</p><div className="code-editor">{colors.map((c,i)=><label key={i}><span className="legend-swatch" style={{background:c}}/><small>{String(i+1).padStart(2,'0')}</small><input value={codes[i]} maxLength={6} placeholder={String(i+1).padStart(2,'0')} onChange={e=>setCodes(a=>a.map((v,k)=>k===i?e.target.value.replace(/[^a-zA-Z0-9-]/g,''):v))}/></label>)}</div><button className="apply-conversion" onClick={()=>setCodesOpen(false)}>完成</button></>:
   preferences?<div className="preferences">
    <label><span><strong>底板尺寸</strong><small>支持 24、29、52 三种尺寸</small></span><select value={size} onChange={e=>switchSize(+e.target.value)}>{SUPPORTED_SIZES.map(n=><option key={n} value={n}>{n} × {n}</option>)}</select></label>
    <label><span><strong>画布网格</strong><small>平面编辑辅助线</small></span><input type="checkbox" checked={settings.grid} onChange={e=>setSettings(s=>({...s,grid:e.target.checked}))}/></label>
    <label><span><strong>柔和背景音乐</strong><small>需要手动开启</small></span><button className="soft-action" onClick={toggleMusic}>{music?'暂停':'播放'}</button></label>
    <label><span><strong>音乐音量</strong><small>{settings.volume}%</small></span><input type="range" value={settings.volume} min="0" max="100" onChange={e=>setSettings(s=>({...s,volume:+e.target.value}))}/></label>
    <label><span><strong>拼豆落位音效</strong><small>独立开关</small></span><input type="checkbox" checked={settings.sfx} onChange={e=>setSettings(s=>({...s,sfx:e.target.checked}))}/></label>
    <label><span><strong>音效音量</strong><small>{settings.sfxVolume}%</small></span><input type="range" value={settings.sfxVolume} min="0" max="100" onChange={e=>setSettings(s=>({...s,sfxVolume:+e.target.value}))}/></label>
    <div className="data-actions"><button onClick={()=>projectInput.current?.click()}><FolderOpen size={16}/> 打开项目</button><button onClick={saveProject}><Download size={16}/> 备份项目</button><button onClick={clearBoard}><Grid2X2 size={16}/> 清空画板</button></div>
   </div>:<div className="guide-text"><p>选择「模板」跟着可爱动物图案拼，或到「图片」上传照片。图纸模块支持坐标、色号、材料统计、打印与 PDF 保存。</p><p>使用手形工具、空格拖动或右键拖动平移 2D 画布。直接滚动鼠标滚轮以指针位置为中心缩放，范围为 75–300%，不会出现无限画布；缩放后可以在边界内平移。右上角缩略图可以快速跳转位置。</p><p>快捷键 B 画笔、E 擦除、G 填色、I 取色、H 平移、Ctrl+Z 撤销。点击顶部滑杆图标，可以独立隐藏各个窗口。</p><p>数据只保存在本机浏览器中。建议定期通过「导出 → 项目 JSON」保存备份。</p></div>}
  </section></div>}
 </div>;
}
