import type {Board} from './board';
import {boardSize,colors} from './board';
import type {BeadRenderStyle} from './FlatBoard';
type Props={board:Board;renderStyle?:BeadRenderStyle};
export default function TemplateThumb({board,renderStyle='pixel'}:Props){
 const size=boardSize(board);
 return <svg className={'template-thumb thumbnail-'+renderStyle} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={renderStyle==='pixel'?'清晰像素图案缩略图':'拼豆图案缩略图'} preserveAspectRatio="xMidYMid meet">
  {board.map((v,i)=>{if(v===null)return null;const x=i%size,y=Math.floor(i/size),color=colors[v];
   if(renderStyle==='pixel'||renderStyle==='chart')return <g key={i}><rect x={x} y={y} width="1" height="1" fill={color}/>{renderStyle==='chart'&&size<=29&&<text x={x+.5} y={y+.7} fontSize=".31" textAnchor="middle" fill={[12,10,9,5,7].includes(v)?'#fff':'#54453e'}>{v+1}</text>}</g>;
   return <g key={i}><circle cx={x+.5} cy={y+.5} r=".46" fill={color}/>{renderStyle==='beads'&&<circle cx={x+.5} cy={y+.5} r=".16" fill="#fffaf5"/>}</g>;
  })}
 </svg>
}
