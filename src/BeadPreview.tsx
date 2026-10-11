import type{Board}from './board';import{boardSize,colors}from './board';
type Props={board:Board;className?:string;showEmpty?:boolean};
export default function BeadPreview({board,className='',showEmpty=false}:Props){const size=boardSize(board);return <svg className={className} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="拼豆作品缩略图" preserveAspectRatio="xMidYMid meet">{showEmpty&&<rect width={size} height={size} fill="#f8f4ee"/>}{board.map((v,i)=>v===null?null:<rect key={i} x={i%size} y={Math.floor(i/size)} width="1" height="1" fill={colors[v]}/>)}</svg>}
