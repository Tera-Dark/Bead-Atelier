import {useState} from 'react';
import {Check, Download, Grid2X2, Plus, X} from 'lucide-react';
import {SUPPORTED_SIZES} from './board';
export type GuideSpacing=0|5|10;
export type NewCanvasOptions={size:number;name:string;guideSpacing:GuideSpacing;showCoords:boolean};
type Props={currentName:string;defaultSize:number;defaultSpacing:GuideSpacing;defaultCoords:boolean;hasBeads:boolean;onCancel:()=>void;onBackup:()=>void;onCreate:(value:NewCanvasOptions)=>void};
export default function NewCanvasDialog({currentName,defaultSize,defaultSpacing,defaultCoords,hasBeads,onCancel,onBackup,onCreate}:Props){
 const [size,setSize]=useState(defaultSize),[name,setName]=useState(currentName==='未命名作品'?'我的拼豆作品':currentName);
 const [spacing,setSpacing]=useState<GuideSpacing>(defaultSpacing),[coords,setCoords]=useState(defaultCoords);
 const [confirmOverwrite,setConfirmOverwrite]=useState(false);
 const submit=()=>{if(hasBeads&&!confirmOverwrite){setConfirmOverwrite(true);return}onCreate({size,name:name.trim()||'未命名作品',guideSpacing:spacing,showCoords:coords})};
 return <div className="dialog-backdrop newcanvas-backdrop" onMouseDown={onCancel}>
 <section className="newcanvas-card" onMouseDown={e=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label="新建拼豆画布">
  <button className="dialog-close" aria-label="关闭" onClick={onCancel}><X size={20}/></button>
  <div className="newcanvas-heading"><span>NEW LITTLE CREATION</span><h2>从一块小画布，<br/>开始你的灵感。</h2><p>选择底板大小、辅助网格，再慢慢放下第一颗拼豆。</p></div>
  <label className="newcanvas-label">作品名称<input maxLength={40} value={name} onChange={e=>setName(e.target.value)} placeholder="给作品起个可爱的名字"/></label>
  <div className="newcanvas-section">底板尺寸 <small>目前支持三种正方形底板</small></div>
  <div className="canvas-sizes">{SUPPORTED_SIZES.map(n=><button type="button" key={n} onClick={()=>setSize(n)} className={size===n?'selected':''}><span className="size-grid" style={{backgroundSize:`${n===52?5:9}px ${n===52?5:9}px`}}/><strong>{n} × {n}</strong><small>{n===24?'迷你挂件':n===29?'常规底板':'精细大图'}</small>{size===n&&<Check size={15} className="size-check"/>}</button>)}</div>
  <div className="newcanvas-section">辅助线 <small>方便分区定位，不影响最终成品</small></div>
  <div className="canvas-guide-list">{([0,5,10] as GuideSpacing[]).map(v=><button type="button" key={v} className={spacing===v?'selected':''} onClick={()=>setSpacing(v)}>{v===0?'无分区线':`每 ${v} 格分区`}</button>)}</div>
  <label className="coords-toggle"><span>显示顶部和左侧坐标 <small>大图更容易精准定位</small></span><input type="checkbox" checked={coords} onChange={e=>setCoords(e.target.checked)}/></label>
  {confirmOverwrite&&<div className="overwrite-alert"><b>当前画板上已有拼豆</b><span>创建后会替换当前画板。建议先备份为 JSON，避免丢失作品。</span><button onClick={onBackup}><Download size={14}/> 先保存旧作品</button></div>}
  <div className="newcanvas-actions"><button className="cancel" onClick={onCancel}>取消</button><button className="create" onClick={submit}><Plus size={17}/>{confirmOverwrite?'确定替换并新建':'创建画布'}</button></div>
 </section></div>
}
