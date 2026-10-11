import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, CSSProperties } from 'react';
import { type Board, boardSize, colors } from './board';
export type BeadRenderStyle = 'pixel' | 'beads' | 'dots' | 'chart';
type Tool='brush'|'erase'|'fill'|'picker'|'hand';
type Point={x:number;y:number};
type Viewport={width:number;height:number;boardPx:number};
type Props={
 board:Board;tool:Tool;selected:number;onCell:(i:number)=>void;grid:boolean;zoom:number;
 justPlaced:number;placementId?:number;guide?:Board|null;renderStyle:BeadRenderStyle;guideSpacing:0|5|10;showCoords:boolean;onStrokeStart?:()=>void;onStrokeEnd?:()=>void;
 pan:Point;onPan:(p:Point)=>void;onZoom:(z:number)=>void;onViewport:(v:Viewport)=>void
};
export const MIN_ZOOM=75,MAX_ZOOM=300;
const clamp=(v:number,min:number,max:number)=>Math.min(max,Math.max(min,v));
export function clampCanvasPan(p:Point,zoom:number,viewport:Viewport):Point{
 const scale=zoom/100,board=viewport.boardPx*scale;
 const limit=(extent:number)=>board>extent ? (board-extent)/2 : Math.max(0,(extent-board)/2-22);
 return {x:clamp(p.x,-limit(viewport.width),limit(viewport.width)),y:clamp(p.y,-limit(viewport.height),limit(viewport.height))};
}
function computeBase(w:number,h:number){return Math.max(165,Math.min(780,Math.max(165,w-66),Math.max(165,h-62)))}
export default function FlatBoard({board,tool,selected,onCell,grid,zoom,justPlaced,placementId=0,guide,renderStyle,guideSpacing,showCoords,onStrokeStart,onStrokeEnd,pan,onPan,onZoom,onViewport}:Props){
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 const [dims,setDims]=useState({width:740,height:620,boardPx:558});
 const [hover,setHover]=useState(-1),[space,setSpace]=useState(false);
 const gesture=useRef<{type:'draw'|'pan';startX:number;startY:number;pan:Point;last:number}|null>(null);
 const size=boardSize(board),cellPx=27;
 useEffect(()=>{const h=host.current;if(!h)return;const measure=()=>{const width=h.clientWidth,height=h.clientHeight,boardPx=computeBase(width,height);if(width>0&&height>0)setDims(p=>p.width===width&&p.height===height&&p.boardPx===boardPx?p:{width,height,boardPx})};const observer=new ResizeObserver(measure);observer.observe(h);measure();return()=>observer.disconnect()},[]);
 useEffect(()=>{onViewport(dims)},[dims,onViewport]);
 useEffect(()=>{const p=clampCanvasPan(pan,zoom,dims);if(Math.abs(p.x-pan.x)>.5||Math.abs(p.y-pan.y)>.5)onPan(p)},[zoom,dims,pan,onPan]);
 useEffect(()=>{const onDown=(e:KeyboardEvent)=>{if(e.code!=='Space'||e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement)return;e.preventDefault();setSpace(true)},onUp=(e:KeyboardEvent)=>{if(e.code==='Space')setSpace(false)},onBlur=()=>setSpace(false);window.addEventListener('keydown',onDown);window.addEventListener('keyup',onUp);window.addEventListener('blur',onBlur);return()=>{window.removeEventListener('keydown',onDown);window.removeEventListener('keyup',onUp);window.removeEventListener('blur',onBlur)}},[]);
 useEffect(()=>{const h=host.current;if(!h)return;const wheel=(e:WheelEvent)=>{
  e.preventDefault();
  const delta=e.deltaY*(e.deltaMode===1?20:e.deltaMode===2?180:1);
  const newZoom=clamp(Math.round(zoom*Math.exp(-delta*.002)),MIN_ZOOM,MAX_ZOOM);
  if(newZoom===zoom)return;
  const rect=h.getBoundingClientRect(),dx=e.clientX-rect.left-rect.width/2,dy=e.clientY-rect.top-rect.height/2,ratio=newZoom/zoom;
  const newPan=clampCanvasPan({x:dx+(pan.x-dx)*ratio,y:dy+(pan.y-dy)*ratio},newZoom,dims);
  onPan(newPan);onZoom(newZoom);
 };h.addEventListener('wheel',wheel,{passive:false});return()=>h.removeEventListener('wheel',wheel)},[zoom,pan,dims,onPan,onZoom]);
 useEffect(()=>{const el=canvas.current;if(!el)return;const dpr=Math.min(2,window.devicePixelRatio||1),unit=cellPx,w=size*unit;el.width=w*dpr;el.height=w*dpr;
 const ctx=el.getContext('2d');if(!ctx)return;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,w,w);ctx.fillStyle='#fdfaf6';ctx.fillRect(0,0,w,w);
 const shapeCircle=(cx:number,cy:number,r:number)=>{ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2)};
 for(let i=0;i<board.length;i++){
  const x=i%size*unit,y=Math.floor(i/size)*unit,cx=x+unit/2,cy=y+unit/2,v=board[i],wanted=guide?.[i];
  const chart=renderStyle==='chart',pixel=renderStyle==='pixel',beads=renderStyle==='beads',dots=renderStyle==='dots';
  ctx.fillStyle=chart?'#fff':pixel?'#fffdf9':'#faf7f2';ctx.fillRect(x,y,unit,unit);
  if(v===null){
    if(wanted!==null&&wanted!==undefined){ctx.globalAlpha=pixel?0.22:0.2;ctx.fillStyle=colors[wanted];if(pixel||chart)ctx.fillRect(x+1,y+1,unit-2,unit-2);else{shapeCircle(cx,cy,unit*.42);ctx.fill()}ctx.globalAlpha=1}
    else if(beads||dots){ctx.fillStyle='#dfd8d0';shapeCircle(cx,cy,unit*.105);ctx.fill()}
  }else if(pixel||chart){
    ctx.fillStyle=colors[v];ctx.fillRect(x,y,unit,unit);
    if(chart){ctx.fillStyle=[12,10,9,5,7].includes(v)?'#fff':'#473c36';ctx.font='600 10px Arial,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(v+1).padStart(2,'0'),cx,cy+.4)}
  }else{
    ctx.fillStyle=colors[v];ctx.shadowColor='#65584c26';ctx.shadowBlur=2;ctx.shadowOffsetY=1;shapeCircle(cx,cy,unit*(dots?.415:.425));ctx.fill();ctx.shadowColor='transparent';ctx.shadowOffsetY=0;
    ctx.strokeStyle='#ffffffb8';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(cx-.5,cy-.7,unit*.34,Math.PI*1.15,Math.PI*1.7);ctx.stroke();
    if(beads){ctx.fillStyle='#fdf9f5';shapeCircle(cx,cy,unit*.152);ctx.fill();ctx.strokeStyle='#00000020';ctx.lineWidth=.7;ctx.stroke()}
  }
  if(grid||chart){
    const major=i%size%5===0||Math.floor(i/size)%5===0;
    if(chart||!pixel||zoom>=145){
      ctx.strokeStyle=chart?(major?'#d9afa2':'#e9e1db'):(pixel?'#d9cec657':'#e5ddd5');
      ctx.lineWidth=chart&&major?1.15:.45;ctx.strokeRect(x+.25,y+.25,unit-.5,unit-.5);
    }
  }
 }
 if(guideSpacing>0){ctx.save();ctx.strokeStyle='#cc9a86';ctx.lineWidth=size>=52?1.4:1.8;ctx.beginPath();for(let j=0;j<=size;j+=guideSpacing){const p=j*unit+.5;ctx.moveTo(p,0);ctx.lineTo(p,w);ctx.moveTo(0,p);ctx.lineTo(w,p)}ctx.stroke();ctx.restore()}
 },[board,size,grid,zoom,guide,renderStyle,guideSpacing]);
 const getIndex=(clientX:number,clientY:number)=>{const rect=canvas.current?.getBoundingClientRect();if(!rect)return -1;const x=Math.floor((clientX-rect.left)/rect.width*size),y=Math.floor((clientY-rect.top)/rect.height*size);return x>=0&&x<size&&y>=0&&y<size?y*size+x:-1};
 const pointerDown=(e:ReactPointerEvent<HTMLDivElement>)=>{
  if(e.button!==0&&e.button!==1&&e.button!==2)return;
  e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);
  const drag=e.button!==0||space||tool==='hand';
  const index=getIndex(e.clientX,e.clientY);
  gesture.current={type:drag?'pan':'draw',startX:e.clientX,startY:e.clientY,pan:{...pan},last:index};
  if(!drag&&index>=0){onStrokeStart?.();onCell(index)}
 };
 const pointerMove=(e:ReactPointerEvent<HTMLDivElement>)=>{
  const index=getIndex(e.clientX,e.clientY);setHover(prev=>prev===index?prev:index);
  const g=gesture.current;if(!g)return;
  if(g.type==='pan'){onPan(clampCanvasPan({x:g.pan.x+e.clientX-g.startX,y:g.pan.y+e.clientY-g.startY},zoom,dims))}
  else if(index>=0&&index!==g.last){const prev=g.last;g.last=index;if(prev<0){onCell(index)}else{let x0=prev%size,y0=Math.floor(prev/size),x1=index%size,y1=Math.floor(index/size);const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let err=dx+dy;while(x0!==x1||y0!==y1){const e2=2*err;if(e2>=dy){err+=dy;x0+=sx}if(e2<=dx){err+=dx;y0+=sy}if(x0>=0&&y0>=0&&x0<size&&y0<size)onCell(y0*size+x0)}}}
 };
 const clearGesture=()=>{if(gesture.current?.type==='draw')onStrokeEnd?.();gesture.current=null};
 const scale=zoom/100;
 const canvasStyle:CSSProperties={width:dims.boardPx,height:dims.boardPx,transform:`translate(calc(-50% + ${pan.x}px),calc(-50% + ${pan.y}px)) scale(${scale})`};
 const border=size>0?100/size:0;
 return <div ref={host} className={'finite-canvas '+(tool==='hand'||space?'panning':'')+' mode-'+renderStyle}
  onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={clearGesture} onPointerCancel={clearGesture} onLostPointerCapture={clearGesture} onContextMenu={e=>e.preventDefault()}>
  <div className={'finite-artboard '+(showCoords?'axis-visible':'')} style={canvasStyle}><div className="finite-grid-inner">
   <canvas ref={canvas} className="finite-pixels" aria-label="有边界的平面拼豆画板，滚轮缩放，右键或空格拖拽"/>
   {hover>=0&&tool!=='hand'&&<span className="finite-cell-hover" style={{left:(hover%size*border)+'%',top:(Math.floor(hover/size)*border)+'%',width:border+'%',height:border+'%'}}/>}
   {justPlaced>=0&&board[justPlaced]!==null&&<span key={placementId} className={'bead-landing style-'+renderStyle} style={{left:((justPlaced%size+.5)*border)+'%',top:((Math.floor(justPlaced/size)+.5)*border)+'%',width:border+'%',background:colors[board[justPlaced]!]}}>{renderStyle==='beads'&&<i/>}</span>}
   {showCoords&&<><div className="canvas-axis top-axis" aria-hidden="true">{Array.from({length:size},(_,i)=><span key={i} style={{left:((i+.5)/size*100)+'%'}}>{i+1}</span>)}</div><div className="canvas-axis left-axis" aria-hidden="true">{Array.from({length:size},(_,i)=><span key={i} style={{top:((i+.5)/size*100)+'%'}}>{i+1}</span>)}</div></>}
  </div></div>
  <span className="finite-shortcuts">滚轮缩放 · 空格 / 右键拖动平移 · {MIN_ZOOM}–{MAX_ZOOM}%</span>
 </div>
}
