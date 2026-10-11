import type { Board } from './board';
import { N, colors } from './board';

type Props = { board: Board; name: string; labels?: boolean };

export default function PatternSheet({ board, name, labels = true }: Props) {
  const used = colors.map((color, index) => ({
    color, index, count: board.filter(v => v === index).length
  })).filter(c => c.count > 0);
  const cell = 22, pad = 38, total = N * cell + pad * 2;
  const count = board.filter(v => v !== null).length;
  const showWhiteText = (hex: string) => {
    const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
    return rgb.map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
      .reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0) < .3;
  };
  return <article className="pattern-paper">
    <div className="pattern-heading"><div><span>BEAD ATELIER / PATTERN SHEET</span><h2>{name || '未命名作品'}</h2></div><b>{N} × {N}</b></div>
    <svg id="pattern-svg" xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${total} ${total}`} role="img" aria-label="带坐标及色号的拼豆图纸">
      <rect width={total} height={total} fill="#fff" />
      {Array.from({length:N},(_,i) => <g key={'index'+i} fontSize="10" fill="#847b75" textAnchor="middle" fontFamily="Arial,sans-serif">
        <text x={pad+(i+.5)*cell} y={pad-11}>{i+1}</text>
        <text x={pad+(i+.5)*cell} y={pad+N*cell+18}>{i+1}</text>
        <text x={pad-15} y={pad+(i+.5)*cell+3}>{i+1}</text>
        <text x={pad+N*cell+15} y={pad+(i+.5)*cell+3}>{i+1}</text>
      </g>)}
      {board.map((v,i) => {
        const x=pad+i%N*cell, y=pad+Math.floor(i/N)*cell;
        return <g key={i}>
          <rect x={x} y={y} width={cell} height={cell} fill={v===null?'#ffffff':colors[v]} />
          {v!==null && labels && <text x={x+cell/2} y={y+cell/2+3.2} textAnchor="middle" fontSize="8.2" fontWeight="600" fill={showWhiteText(colors[v])?'#fff':'#3f3633'} fontFamily="Arial,sans-serif">{String(v+1).padStart(2,'0')}</text>}
        </g>;
      })}
      {Array.from({length:N+1},(_,i)=><g key={'grid'+i} stroke={i%5===0?'#c68f7c':'#e5dcd3'} strokeWidth={i%5===0?1.6:.55}>
        <line x1={pad+i*cell} y1={pad} x2={pad+i*cell} y2={pad+N*cell}/>
        <line x1={pad} y1={pad+i*cell} x2={pad+N*cell} y2={pad+i*cell}/>
      </g>)}
    </svg>
    <div className="pattern-summary"><span>共 {count} 颗拼豆</span><span>{used.length} 种颜色</span><span>示例色号 · 非品牌官方色号</span></div>
    <div className="pattern-legend">{used.map(c=><div key={c.index} className="legend-item">
      <span className="legend-swatch" style={{background:c.color}}/>
      <span>#{String(c.index+1).padStart(2,'0')}</span><strong>{c.count}</strong>
    </div>)}</div>
    <p className="pattern-note">按横纵坐标定位拼豆，每格标注示例色板编号。每 5 格加粗辅助线；未来可切换真实品牌色号。</p>
  </article>;
}