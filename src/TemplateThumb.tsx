import type { Board } from './board';
import { N, colors } from './board';
export default function TemplateThumb({board}: {board:Board}){
 return <svg className="template-thumb" viewBox="0 0 240 240" role="img" aria-label="拼豆图案缩略图">
  {board.map((v,i)=>v===null?null:<g key={i}><circle cx={i%N*10+5} cy={Math.floor(i/N)*10+5} r="4.85" fill={colors[v]}/><circle cx={i%N*10+5} cy={Math.floor(i/N)*10+5} r="1.55" fill="#fff9f2"/></g>)}
 </svg>;
}