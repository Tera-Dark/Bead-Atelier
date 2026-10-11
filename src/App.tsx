import PatternSheet from './PatternSheet';
import TemplateThumb from './TemplateThumb';
import {BookOpen, Palette, Printer, Sparkles, FileText, Play, Download, ChevronLeft, SlidersHorizontal, Heart, Info} from 'lucide-react';
import{templates}from'./templates';import{BeadSfx}from'./sfx';
import{useEffect,useRef,useState}from'react';import{ArrowDownToLine,Check,ChevronDown,CircleHelp,Eraser,Grid2X2,ImagePlus,Layers3,Paintbrush,Redo2,Undo2,WandSparkles,Settings2,Music2,Volume2,VolumeX,Grid3X3,PaintBucket,Pipette,Box,Square,ZoomIn,ZoomOut,FolderOpen,FileImage,RotateCcw,X}from'lucide-react';import Scene from'./Scene';import FlatBoard from'./FlatBoard';import{AmbientAudio}from'./audio';import{Board,N,colors,empty,restore}from'./board';type Tool='brush'|'erase'|'fill'|'picker';type View='2d'|'3d';const store='atelier-board';const settingsKey='atelier-settings';type Settings={grid:boolean;volume:number;sfx:boolean;sfxVolume:number};const defaults:Settings={grid:true,volume:35,sfx:true,sfxVolume:45};function getSettings():Settings{try{const saved=JSON.parse(localStorage.getItem(settingsKey)||'{}') as Partial<Settings>;return {grid:typeof saved.grid==='boolean'?saved.grid:defaults.grid,volume:typeof saved.volume==='number'&&Number.isFinite(saved.volume)?Math.max(0,Math.min(100,saved.volume)):defaults.volume,sfx:typeof saved.sfx==='boolean'?saved.sfx:true,sfxVolume:typeof saved.sfxVolume==='number'&&Number.isFinite(saved.sfxVolume)?Math.max(0,Math.min(100,saved.sfxVolume)):45}}catch{return defaults}}function download(blob:Blob,name:string){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
export default function App(){const[board,setBoard]=useState<Board>(restore),boardRef=useRef(board),past=useRef<Board[]>([]),future=useRef<Board[]>([]);boardRef.current=board;const[selected,setSelected]=useState(0),[tool,setTool]=useState<Tool>('brush'),[view,setView]=useState<View>('2d'),[help,setHelp]=useState(false),[settingsOpen,setSettingsOpen]=useState(false),[settings,setSettings]=useState(getSettings),[zoom,setZoom]=useState(100),[playing,setPlaying]=useState(false),[name,setName]=useState(()=>localStorage.getItem('atelier-name')||'未命名作品');const sfx=useRef<BeadSfx|null>(null),[gallery,setGallery]=useState(false),[justPlaced,setJustPlaced]=useState(-1);const[guide,setGuide]=useState<Board|null>(null),[guideName,setGuideName]=useState(''),[auto,setAuto]=useState(false),[speed,setSpeed]=useState(60),[finished,setFinished]=useState(false);const playback=useRef<number|undefined>(undefined),snapshot=useRef<Board|null>(null),playOrder=useRef<number[]>([]),playIndex=useRef(0);const [page,setPage]=useState<'editor'|'pattern'>('editor'),[drawer,setDrawer]=useState<'templates'|'image'|null>(null);const imageInput=useRef<HTMLInputElement>(null),projectInput=useRef<HTMLInputElement>(null),audio=useRef<AmbientAudio|null>(null);const count=board.filter(v=>v!==null).length,unique=new Set(board.filter(v=>v!==null)).size;useEffect(()=>{localStorage.setItem(store,JSON.stringify(board))},[board]);useEffect(()=>{localStorage.setItem(settingsKey,JSON.stringify(settings));audio.current?.setVolume(settings.volume/100)},[settings]);useEffect(()=>{localStorage.setItem('atelier-name',name)},[name]);useEffect(()=>()=>{audio.current?.stop();sfx.current?.dispose();if(playback.current!==undefined)clearInterval(playback.current)},[]);function stopAuto(){if(playback.current!==undefined)clearInterval(playback.current);playback.current=undefined;setAuto(false)}function resetGuide(){stopAuto();setGuide(null);setFinished(false)}function commit(next:Board){past.current.push([...boardRef.current]);if(past.current.length>100)past.current.shift();future.current=[];boardRef.current=next;setBoard(next)}function act(i:number){if(auto)return;const current=boardRef.current;const feedback=(kind:'place'|'erase')=>{if(settings.sfx){if(!sfx.current)sfx.current=new BeadSfx();sfx.current.play(kind,settings.sfxVolume/100)}setJustPlaced(i)};if(tool==='picker'){if(current[i]!==null){setSelected(current[i]!);setTool('brush')}return}const v=tool==='erase'?null:selected;if(guide&&v!==null&&guide[i]!==v&&tool!=='fill'){if(settings.sfx){if(!sfx.current)sfx.current=new BeadSfx();sfx.current.play('erase',settings.sfxVolume/100)}return}if(tool==='fill'){const target=current[i];if(target===v)return;const next=[...current],stack=[i],seen=new Set<number>();while(stack.length){const p=stack.pop()!;if(seen.has(p)||next[p]!==target)continue;seen.add(p);next[p]=v;const x=p%N,y=Math.floor(p/N);if(x>0)stack.push(p-1);if(x<N-1)stack.push(p+1);if(y>0)stack.push(p-N);if(y<N-1)stack.push(p+N)}commit(next);feedback('place');return}if(current[i]===v)return;const next=[...current];next[i]=v;commit(next);feedback(tool==='erase'?'erase':'place');if(guide&&next.every((c,k)=>c===guide[k])){setFinished(true);if(settings.sfx){if(!sfx.current)sfx.current=new BeadSfx();sfx.current.play('complete',settings.sfxVolume/100)}}}function undo(){const b=past.current.pop();if(b){future.current.push([...boardRef.current]);boardRef.current=b;setBoard(b)}}function redo(){const b=future.current.pop();if(b){past.current.push([...boardRef.current]);boardRef.current=b;setBoard(b)}}useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.target instanceof HTMLInputElement)return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();if(e.shiftKey)redo();else undo()}else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();redo()}else if(!e.ctrlKey&&!e.metaKey){const k=e.key.toLowerCase();if(k==='b')setTool('brush');if(k==='e')setTool('erase');if(k==='g')setTool('fill');if(k==='i')setTool('picker')}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);function startGuide(t:typeof templates[number]){resetGuide();setPage('editor');setDrawer(null);setGuide([...t.board]);setGuideName(t.name);commit(empty());setName(t.name+' · 跟拼');setSelected(t.palette[0]??0);setTool('brush');setView('2d');setGallery(false)}function startAuto(){if(auto){stopAuto();return}const target=guide??[...boardRef.current];if(!target.some(v=>v!==null))return;stopAuto();snapshot.current=[...boardRef.current];playOrder.current=target.map((v,i)=>v===null?-1:i).filter(i=>i>=0).sort((a,b)=>{const ya=Math.floor(a/N),yb=Math.floor(b/N);return ya===yb?a-b:ya-yb});playIndex.current=0;const first=empty();boardRef.current=first;setBoard(first);setView('2d');setFinished(false);setAuto(true);const interval=Math.max(12,180-speed*1.65);playback.current=window.setInterval(()=>{const i=playOrder.current[playIndex.current++];if(i===undefined){stopAuto();setFinished(true);if(settings.sfx){if(!sfx.current)sfx.current=new BeadSfx();sfx.current.play('complete',settings.sfxVolume/100)}return}const next=[...boardRef.current];next[i]=target[i];boardRef.current=next;setBoard(next);setJustPlaced(i);if(settings.sfx){if(!sfx.current)sfx.current=new BeadSfx();sfx.current.play('place',settings.sfxVolume/100)}},interval)}function restoreAuto(){stopAuto();if(snapshot.current){boardRef.current=[...snapshot.current];setBoard([...snapshot.current]);snapshot.current=null;setFinished(false)}}function importImage(f?:File){if(!f)return;resetGuide();setPage('editor');setDrawer(null);const u=URL.createObjectURL(f),img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=N;c.height=N;const ctx=c.getContext('2d')!;ctx.fillStyle='#fff';ctx.fillRect(0,0,N,N);const scale=Math.min(img.width,img.height),sx=(img.width-scale)/2,sy=(img.height-scale)/2;ctx.drawImage(img,sx,sy,scale,scale,0,0,N,N);const data=ctx.getImageData(0,0,N,N).data,palette=colors.map(c=>[1,3,5].map(k=>parseInt(c.slice(k,k+2),16)));const result:Board=[];for(let i=0;i<N*N;i++){let best=Infinity,choice=0;for(let j=0;j<palette.length;j++){const d=palette[j].reduce((s,n,k)=>s+(n-data[i*4+k])**2,0);if(d<best){best=d;choice=j}}result.push(choice)}commit(result);URL.revokeObjectURL(u)};img.onerror=()=>URL.revokeObjectURL(u);img.src=u}function exportJSON(){download(new Blob([JSON.stringify({version:2,name,size:N,palette:colors,board},null,2)],{type:'application/json'}),name+'.json')}function openProject(f?:File){if(!f)return;resetGuide();setPage('editor');setDrawer(null);const reader=new FileReader();reader.onload=()=>{try{const v=JSON.parse(String(reader.result));if(v.size!==N||!Array.isArray(v.board)||v.board.length!==N*N||!v.board.every((n:unknown)=>n===null||(Number.isInteger(n)&&typeof n==='number'&&n>=0&&n<colors.length)))throw Error('bad');commit(v.board);if(typeof v.name==='string')setName(v.name)}catch{alert('项目文件无效，请选择 Bead Atelier 导出的 JSON 文件。')}};reader.readAsText(f)}function exportPNG(){const c=document.createElement('canvas');c.width=N*28;c.height=N*28;const ctx=c.getContext('2d')!;ctx.fillStyle='#faf8f5';ctx.fillRect(0,0,c.width,c.height);board.forEach((v,i)=>{const x=(i%N+.5)*28,y=(Math.floor(i/N)+.5)*28;ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fillStyle=v===null?'#e7e1d9':colors[v];ctx.fill();if(v!==null){ctx.beginPath();ctx.arc(x,y,3.8,0,Math.PI*2);ctx.fillStyle='#faf8f5';ctx.fill()}});c.toBlob(b=>{if(b)download(b,name+'.png')})}function toggleMusic(){if(playing){audio.current?.stop();setPlaying(false)}else{const a=new AmbientAudio();audio.current=a;try{a.start(settings.volume/100);setPlaying(true)}catch{setPlaying(false)}}}function clear(){if(window.confirm('确定清空画板吗？可以使用撤销恢复。')){resetGuide();snapshot.current=null;commit(empty());setPage('editor')}}

function loadTemplate(t:typeof templates[number]){
  resetGuide();
  snapshot.current=null;
  commit([...t.board]);
  setName(t.name);
  setView('2d');
  setPage('editor');
  setDrawer(null);
  setTool('brush');
}
function openDrawer(next:'templates'|'image'){
  setPage('editor');
  setDrawer(previous=>previous===next?null:next);
}
function exportPatternSvg(){
  const svg=document.getElementById('pattern-svg');
  if(!svg){setPage('pattern');return}
  const markup=new XMLSerializer().serializeToString(svg);
  download(new Blob([markup],{type:'image/svg+xml;charset=utf-8'}), (name||'拼豆图纸')+'.svg');
}
const toolItems:[Tool,string,typeof Paintbrush][]=[
 ['brush','画笔 B',Paintbrush],['erase','擦除 E',Eraser],
 ['fill','填色 G',PaintBucket],['picker','取色 I',Pipette]
];
return <div className="atelier-app">
  <header className="atelier-header">
    <button className="atelier-brand" onClick={()=>{setPage('editor');setDrawer(null)}} aria-label="返回 Bead Atelier 创作工作台">
      <img src={'./bead-paw.png'} width="39" height="39" alt="四色拼豆爪爪"/>
      <span>bead atelier<span className="brand-stop">.</span><small>拼豆工作室</small></span>
    </button>
    <div className="header-project">
      <input aria-label="作品名称" value={name} maxLength={32} onChange={e=>setName(e.target.value)}/>
      <span className="saved-label"><Check size={13}/> 已保存到本机</span>
    </div>
    <div className="header-right">
      <button className={'bare-icon '+(playing?'active':'')} onClick={toggleMusic} title={playing?'关闭背景音乐':'开启背景音乐'} aria-label="背景音乐">{playing?<Volume2 size={19}/>:<VolumeX size={19}/>}</button>
      <button className="bare-icon" onClick={()=>setSettingsOpen(true)} title="设置" aria-label="设置"><Settings2 size={19}/></button>
      <button className="bare-icon help-trigger" onClick={()=>setHelp(true)} title="帮助" aria-label="帮助"><CircleHelp size={19}/></button>
      <details className="export-dropdown">
        <summary><Download size={16}/> 导出 <ChevronDown size={14}/></summary>
        <div className="export-options">
          <button onClick={exportPNG}><FileImage size={16}/> 成品图片 PNG</button>
          <button onClick={exportJSON}><FolderOpen size={16}/> 项目备份 JSON</button>
          <button onClick={()=>{setPage('pattern');setDrawer(null)}}><FileText size={16}/> 打开拼豆图纸</button>
        </div>
      </details>
    </div>
  </header>
  <div className="atelier-shell">
    <nav className="activity-rail" aria-label="主导航">
      <div className="rail-primary">
        <button className={page==='editor'&&!drawer?'rail-tab active':'rail-tab'} title="创作" onClick={()=>{setPage('editor');setDrawer(null)}}><Paintbrush size={21}/><span>创作</span></button>
        <button className={drawer==='templates'?'rail-tab active':'rail-tab'} title="模板" onClick={()=>openDrawer('templates')}><Heart size={21}/><span>模板</span></button>
        <button className={drawer==='image'?'rail-tab active':'rail-tab'} title="图片转拼豆" onClick={()=>openDrawer('image')}><ImagePlus size={21}/><span>图片</span></button>
        <button className={page==='pattern'?'rail-tab active':'rail-tab'} title="图纸" onClick={()=>{setPage('pattern');setDrawer(null)}}><BookOpen size={21}/><span>图纸</span></button>
      </div>
      <div className="rail-secondary">
        <button className="rail-tab" title="设置" onClick={()=>setSettingsOpen(true)}><Settings2 size={20}/><span>设置</span></button>
      </div>
    </nav>
    {drawer&&<aside className="context-drawer">
      <div className="drawer-heading">
        <div><small>YOUR LITTLE STUDIO</small><h2>{drawer==='templates'?'灵感模板':'图片转拼豆'}</h2></div>
        <button className="quiet-button" aria-label="关闭侧栏" onClick={()=>setDrawer(null)}><ChevronLeft size={19}/></button>
      </div>
      {drawer==='templates'?<>
        <p className="drawer-intro">挑选一个可爱图案，直接修改，或从空白底板开始慢慢拼。</p>
        <div className="template-list">
          {templates.map(t=><div className="template-entry" key={t.id}>
            <button className="template-preview" onClick={()=>loadTemplate(t)} title={'打开'+t.name}>
              <TemplateThumb board={t.board}/>
            </button>
            <div className="template-details"><strong>{t.name}</strong><small>{t.count} 颗 · {t.palette.length} 色</small></div>
            <div className="template-actions">
              <button onClick={()=>startGuide(t)}>跟着拼</button>
              <button onClick={()=>loadTemplate(t)}>载入成品</button>
            </div>
          </div>)}
        </div>
      </>:<>
        <p className="drawer-intro">从照片或插画开始，让灵感变成一颗颗可触摸的颜色。</p>
        <button className="upload-zone" onClick={()=>imageInput.current?.click()}>
          <span><ImagePlus size={28}/></span><strong>选择一张图片</strong><small>PNG / JPG / WEBP</small>
        </button>
        <div className="process-caption"><span>01 · 上传图片</span><span>02 · 自动转换</span><span>03 · 继续编辑</span></div>
        <div className="panel-hint"><Info size={16}/><span>当前按中心正方形裁剪、匹配 16 色示例色板，输出 24×24 拼豆。后续将增加裁剪预览、真实色号和抖动选项。</span></div>
      </>}
    </aside>}
    <main className="atelier-workspace">
      <div className="workspace-heading">
        <div className="workspace-heading-left">
          <span className="workspace-overline">CREATIVE STUDIO <b>/</b> {page==='pattern'?'图纸工作区':'绘制工作区'}</span>
          <h1>{page==='pattern'?'拼豆图纸': '好好享受，每一颗拼豆。'}<span>✳</span></h1>
        </div>
        <div className="workspace-view">
          {page==='editor'?<div className="view-tabs" aria-label="编辑视图">
            <button className={view==='2d'?'current':''} onClick={()=>setView('2d')}><Grid2X2 size={16}/> 平面</button>
            <button className={view==='3d'?'current':''} onClick={()=>setView('3d')}><Box size={16}/> 3D 预览</button>
          </div>:<button className="soft-action" onClick={()=>setPage('editor')}><ChevronLeft size={16}/> 返回编辑</button>}
        </div>
      </div>
      {page==='editor'?<div className="editor-surface">
        <div className="board-area">
          {view==='2d'?<FlatBoard board={board} tool={tool} selected={selected} onCell={act} grid={settings.grid} zoom={zoom} justPlaced={justPlaced} guide={guide}/>:<Scene board={board} paint={act} selected={selected} erase={tool==='erase'}/>}
          <div className="board-size-pill">{N} × {N}</div>
          {guide&&<div className="guide-chip"><span>🐾 {guideName} · 跟拼模式</span><strong>{board.filter((v,i)=>guide[i]!==null&&v===guide[i]).length} / {guide.filter(v=>v!==null).length}</strong><button onClick={resetGuide} title="退出跟拼"><X size={15}/></button></div>}
          {finished&&<div className="complete-note"><span>✨</span><h3>每颗都拼好了！</h3><p>这是一件专属于你的小作品。</p><div><button onClick={()=>{setFinished(false);setView('3d')}}>看看 3D 成品</button><button className="text-action" onClick={()=>setFinished(false)}>继续编辑</button></div></div>}
        </div>
        <div className="editor-dock">
          <div className="tool-group">{toolItems.map(([key,label,Icon])=><button key={key} className={'dock-tool '+(tool===key?'active':'')} onClick={()=>setTool(key)} title={label} aria-label={label} aria-pressed={tool===key}><Icon size={18}/><span>{label.split(' ')[0]}</span></button>)}</div>
          <span className="dock-divider"/>
          <div className="tool-group">
            <button className="dock-icon" title="撤销 Ctrl+Z" onClick={undo}><Undo2 size={19}/></button>
            <button className="dock-icon" title="重做 Ctrl+Shift+Z" onClick={redo}><Redo2 size={19}/></button>
          </div>
          <span className="dock-divider"/>
          <div className="tool-group zoom-group">
            <button className="dock-icon" title="缩小" disabled={view==='3d'} onClick={()=>setZoom(z=>Math.max(55,z-15))}><ZoomOut size={18}/></button>
            <span>{view==='3d'?'3D':zoom+'%'}</span>
            <button className="dock-icon" title="放大" disabled={view==='3d'} onClick={()=>setZoom(z=>Math.min(180,z+15))}><ZoomIn size={18}/></button>
          </div>
        </div>
        <div className="palette-dock">
          <div className="palette-label"><Palette size={17}/> 色板 <small>{colors.length} 色</small></div>
          <div className="compact-swatches">{colors.map((c,i)=><button key={i} className={'compact-swatch '+(selected===i&&tool!=='erase'?'selected':'')} onClick={()=>{setSelected(i);setTool('brush')}} title={'色号 '+String(i+1).padStart(2,'0')+' · '+c} aria-label={'选择 '+String(i+1).padStart(2,'0')+' 号颜色'} aria-pressed={selected===i&&tool!=='erase'}><i style={{background:c}}/></button>)}</div>
          <div className="current-ink"><span style={{background:colors[selected]}}/>{String(selected+1).padStart(2,'0')}</div>
        </div>
        <div className="play-dock">
          <span><Sparkles size={16}/> 慢慢拼，也很好玩</span>
          <button className={auto?'playing':''} onClick={startAuto}>{auto?'暂停动画':'▶ 自动拼豆'}</button>
          {snapshot.current&&<button className="play-restore" onClick={restoreAuto}><RotateCcw size={15}/> 恢复</button>}
          <label>速度<input type="range" value={speed} min="10" max="100" disabled={auto} onChange={e=>setSpeed(+e.target.value)}/></label>
        </div>
      </div>:<div className="pattern-layout">
        <div className="pattern-preview"><PatternSheet board={board} name={name}/></div>
        <aside className="pattern-aside">
          <div className="pattern-aside-eyebrow">PATTERN / 图纸</div>
          <h2>每颗颜色，<br/>都有迹可循。</h2>
          <p>横纵坐标、格内示例色号、每 5 格辅助线和颜色用量，整理在同一张图纸上。</p>
          <div className="pattern-info-row"><span>底板</span><strong>{N} × {N}</strong></div>
          <div className="pattern-info-row"><span>已放置拼豆</span><strong>{count} 颗</strong></div>
          <div className="pattern-info-row"><span>使用颜色</span><strong>{unique} 色</strong></div>
          <button className="pattern-export primary" onClick={()=>window.print()}><Printer size={17}/> 打印 / 保存为 PDF</button>
          <button className="pattern-export secondary" onClick={exportPatternSvg}><Download size={17}/> 导出 SVG 图纸</button>
          <p className="pattern-warning">图纸目前使用内置示例色号（01–16），不等同于真实品牌色号。</p>
        </aside>
      </div>}
      <footer className="work-status"><span><Layers3 size={16}/> {count} 颗已放置 <i/> {unique} 色在用</span><span><Check size={14}/> 本机自动保存</span></footer>
    </main>
  </div>
  <input ref={imageInput} hidden type="file" accept="image/*" onChange={e=>{importImage(e.target.files?.[0]);e.target.value=''}}/>
  <input ref={projectInput} hidden type="file" accept=".json,application/json" onChange={e=>{openProject(e.target.files?.[0]);e.target.value=''}}/>
  {(help||settingsOpen)&&<div className="dialog-backdrop" onMouseDown={()=>{setHelp(false);setSettingsOpen(false)}}>
    <section className="atelier-dialog" role="dialog" aria-modal="true" aria-label={settingsOpen?'工作室设置':'使用说明'} onMouseDown={e=>e.stopPropagation()}>
      <button className="dialog-close" onClick={()=>{setHelp(false);setSettingsOpen(false)}} aria-label="关闭"><X size={20}/></button>
      <span className="workspace-overline">{settingsOpen?'PREFERENCES':'HELLO, MAKER'}</span>
      <h2>{settingsOpen?'小小工作室的设置':'欢迎来到拼豆工作室'}</h2>
      {settingsOpen?<div className="preferences">
        <label><span><strong>显示画板格线</strong><small>平面模式中的细格线</small></span><input type="checkbox" checked={settings.grid} onChange={e=>setSettings((s:Settings)=>({...s,grid:e.target.checked}))}/></label>
        <label><span><strong>舒缓背景音乐</strong><small>点击开启后才播放</small></span><button className="soft-action" onClick={toggleMusic}>{playing?'暂停音乐':'播放音乐'}</button></label>
        <label><span><strong>背景音乐音量</strong><small>{settings.volume}%</small></span><input type="range" min="0" max="100" value={settings.volume} onChange={e=>setSettings((s:Settings)=>({...s,volume:+e.target.value}))}/></label>
        <label><span><strong>拼豆放置音效</strong><small>细腻的落位声，独立开关</small></span><input type="checkbox" checked={settings.sfx} onChange={e=>setSettings((s:Settings)=>({...s,sfx:e.target.checked}))}/></label>
        <label><span><strong>音效音量</strong><small>{settings.sfxVolume}%</small></span><input type="range" min="0" max="100" value={settings.sfxVolume} onChange={e=>setSettings((s:Settings)=>({...s,sfxVolume:+e.target.value}))}/></label>
        <div className="data-actions">
          <button onClick={()=>projectInput.current?.click()}><FolderOpen size={16}/> 打开项目 JSON</button>
          <button onClick={clear}><Grid2X2 size={16}/> 清空画板</button>
        </div>
      </div>:<div className="guide-text">
        <p>先在「模板」里挑一只小动物，或直接用画笔创作。左侧「图片」可以把一张照片转成简单的拼豆图案。</p>
        <p>快捷键：<b>B</b> 画笔、<b>E</b> 橡皮、<b>G</b> 填色、<b>I</b> 取色；<b>Ctrl+Z</b> 撤销。右键拖动旋转 3D 底板，滚轮缩放。</p>
        <p>「图纸」支持坐标、色号、材料数量与打印。数据保存在当前浏览器，定期导出 JSON 项目备份更安全。</p>
      </div>}
    </section>
  </div>}
</div>;
}
