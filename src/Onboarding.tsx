import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, MousePointer2, Sparkles, X } from 'lucide-react';

export type TourTarget = 'create'|'board'|'tools'|'palette'|'templates'|'pattern';
const steps:{target:TourTarget,title:string,description:string,tip:string}[]=[
 {target:'create',title:'先创建自己的画布',description:'从 24×24、29×29、52×52 中选择尺寸，也能设置图纸分区辅助线。',tip:'第一步 · 创建'},
 {target:'board',title:'画布就是你的游乐场',description:'滚轮围绕鼠标放大局部；按空格或右键拖动。有限底板不会无限滚走。',tip:'第二步 · 操作'},
 {target:'tools',title:'把一颗颗颜色放下来',description:'画笔、擦除、填色、吸管和手形平移都在这里。连续画一笔只需撤销一次。',tip:'第三步 · 绘制'},
 {target:'palette',title:'选择最喜欢的颜色',description:'点击颜色开始画画；右键收藏到画布左下角的常用色板。',tip:'第四步 · 配色'},
 {target:'templates',title:'从可爱图案开始也可以',description:'模板馆提供原创像素动物，载入作品或打开逐颗跟拼模式。',tip:'第五步 · 灵感'},
 {target:'pattern',title:'最后把作品变成图纸',description:'坐标、分区辅助线、用量统计与可打印的图纸，帮助把设计真正做出来。',tip:'第六步 · 成品'}
];
type Props={onCreate:()=>void;onStep:(target:TourTarget)=>void;request:number};
export default function Onboarding({onCreate,onStep,request}:Props){
 const [mode,setMode]=useState<'welcome'|'tour'|'off'>(()=>localStorage.getItem('atelier-onboarding-v1')?'off':'welcome');
 const [step,setStep]=useState(0);
 const [focus,setFocus]=useState<DOMRect|null>(null);
 const [viewport,setViewport]=useState({w:window.innerWidth,h:window.innerHeight});
 useEffect(()=>{if(request<1)return;setMode('tour');setStep(0)},[request]);
 useEffect(()=>{if(mode!=='tour')return;onStep(steps[step].target)},[mode,step,onStep]);
 useEffect(()=>{if(mode!=='tour')return;let frame=0;let nextFrame=0;const measure=()=>{const el=document.querySelector('[data-tour="'+steps[step].target+'"]');setFocus(el?.getBoundingClientRect()??null);setViewport({w:window.innerWidth,h:window.innerHeight})};frame=requestAnimationFrame(()=>{nextFrame=requestAnimationFrame(measure)});window.addEventListener('resize',measure);const id=window.setInterval(measure,650);return()=>{cancelAnimationFrame(frame);cancelAnimationFrame(nextFrame);window.removeEventListener('resize',measure);window.clearInterval(id)}},[mode,step]);
 function finish(){localStorage.setItem('atelier-onboarding-v1','complete');setMode('off');setFocus(null);onStep('board')}
 function begin(){localStorage.setItem('atelier-onboarding-v1','started');setMode('tour');setStep(0)}
 function go(n:number){if(n>=steps.length){finish();return}setStep(Math.max(0,n))}
 function create(){finish();onCreate()}
 if(mode==='off')return null;
 if(mode==='welcome')return <div className="welcome-overlay" role="dialog" aria-modal="true" aria-label="欢迎来到 Bead Atelier">
   <section className="welcome-card">
    <div className="welcome-art" aria-hidden="true"><i className="float-bead b1"/><i className="float-bead b2"/><i className="float-bead b3"/><i className="float-bead b4"/><div className="welcome-paw">✿</div></div>
    <div className="welcome-eyebrow">HELLO, LITTLE MAKER</div><h2>欢迎来到<br/><em>你的拼豆小世界。</em></h2>
    <p>第一次见面，要不要花一分钟认识一下画布、色板和可爱的拼豆玩法？</p>
    <button className="welcome-primary" onClick={begin}><Sparkles size={17}/> 跟我逛逛工作室 <ChevronRight size={17}/></button>
    <button className="welcome-secondary" onClick={create}>跳过教程，直接新建画布</button>
    <button className="welcome-skip" onClick={finish}>先看看工作室</button>
   </section>
  </div>;
 const target=steps[step],margin=12,fw=focus?.width??260,fh=focus?.height??100,fl=focus?.left??(viewport.w-260)/2,ft=focus?.top??90;
 const bubbleW=Math.min(330,viewport.w-26);
 const below=ft+fh+bubbleW*.58+36<viewport.h,anchorTop=below?ft+fh+22:Math.max(10,ft-224);
 const bubbleLeft=Math.min(Math.max(margin,fl+fw/2-bubbleW/2),viewport.w-bubbleW-margin);
 return <div className="tour-layer" role="dialog" aria-modal="true" aria-label="工作台动态入门指引">
   {focus&&<div className="tour-highlight" style={{left:Math.max(4,fl-7),top:Math.max(4,ft-7),width:fw+14,height:fh+14}}/>}
   <div className="tour-panel" style={{width:bubbleW,left:bubbleLeft,top:Math.min(viewport.h-228,Math.max(12,anchorTop))}}>
    <div className="tour-topline"><span>{target.tip}</span><button aria-label="跳过教程" onClick={finish}><X size={16}/></button></div>
    <div className="tour-icon"><MousePointer2 size={21}/><span>✦</span></div>
    <h3>{target.title}</h3><p>{target.description}</p>
    <div className="tour-footer"><div className="tour-dots">{steps.map((s,i)=><span key={s.target} className={i===step?'current':''}/>)}</div><div className="tour-actions">{step>0&&<button onClick={()=>go(step-1)}><ArrowLeft size={15}/></button>}<button className="next" onClick={()=>go(step+1)}>{step===steps.length-1?<><Check size={15}/> 完成</>:<>下一步 <ArrowRight size={15}/></>}</button></div></div>
   </div>
  </div>
}
