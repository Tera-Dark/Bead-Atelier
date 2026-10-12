import {Board,colors,empty} from './board';
import {visibleColorIds} from './colorLibrary';
export type ImageOptions={size:number;maxColors:number;dither:boolean;fit:'cover'|'contain';transparent:boolean};
const rgb=(hex:string)=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
function lab(r:number,g:number,b:number){const transform=(v:number)=>{const n=v/255;return n>.04045?((n+.055)/1.055)**2.4:n/12.92};const R=transform(r),G=transform(g),B=transform(b);const x=(R*.4124564+G*.3575761+B*.1804375)/.95047,y=(R*.2126729+G*.7151522+B*.072175),z=(R*.0193339+G*.119192+B*.9503041)/1.08883;const f=(v:number)=>v>.008856?Math.cbrt(v):7.787*v+16/116;return [116*f(y)-16,500*(f(x)-f(y)),200*(f(y)-f(z))]}
export async function convertImage(file:File,opt:ImageOptions):Promise<Board>{
 const url=URL.createObjectURL(file);try{
  const img=new Image();await new Promise<void>((resolve,reject)=>{img.onload=()=>resolve();img.onerror=()=>reject(new Error('无法读取该图片'));img.src=url});
  const refColors=colors.map(rgb),labs=refColors.map(c=>lab(c[0],c[1],c[2]));
  const validColors=visibleColorIds();
  const nearest=(r:number,g:number,b:number,possible:number[])=>{const p=lab(r,g,b);let best=possible[0],dist=Infinity;for(const i of possible){const q=labs[i],d=(p[0]-q[0])**2+(p[1]-q[1])**2+(p[2]-q[2])**2;if(d<dist){dist=d;best=i}}return best};
  const {size}=opt,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)throw Error('浏览器不支持图片转换');
  ctx.clearRect(0,0,size,size);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  if(opt.fit==='cover'){const scale=Math.max(size/img.width,size/img.height),w=img.width*scale,h=img.height*scale;ctx.drawImage(img,(size-w)/2,(size-h)/2,w,h)}
  else{const scale=Math.min(size/img.width,size/img.height),w=img.width*scale,h=img.height*scale;ctx.drawImage(img,(size-w)/2,(size-h)/2,w,h)}
  const data=ctx.getImageData(0,0,size,size).data,work=new Float32Array(size*size*3),alpha=new Uint8Array(size*size),counts=new Array(colors.length).fill(0);
  for(let i=0;i<size*size;i++){const a=data[i*4+3],visible=!opt.transparent||a>=120;alpha[i]=visible?1:0;for(let k=0;k<3;k++)work[i*3+k]=opt.transparent?data[i*4+k]:(data[i*4+k]*a/255+255*(1-a/255));if(visible)counts[nearest(work[i*3],work[i*3+1],work[i*3+2],validColors)]++}
  const allowed=validColors.map(i=>({count:counts[i],i})).sort((a,b)=>b.count-a.count).slice(0,Math.max(1,Math.min(colors.length,opt.maxColors))).map(v=>v.i);
  const board=empty(size);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=y*size+x;if(!alpha[i])continue;const r=work[i*3],g=work[i*3+1],b=work[i*3+2],choice=nearest(r,g,b,allowed);board[i]=choice;if(opt.dither){const c=refColors[choice],err=[r-c[0],g-c[1],b-c[2]];const spread=(dx:number,dy:number,ratio:number)=>{const nx=x+dx,ny=y+dy;if(nx<0||nx>=size||ny>=size||!alpha[ny*size+nx])return;const j=(ny*size+nx)*3;for(let k=0;k<3;k++)work[j+k]=Math.max(0,Math.min(255,work[j+k]+err[k]*ratio))};spread(1,0,7/16);spread(-1,1,3/16);spread(0,1,5/16);spread(1,1,1/16)}}
  return board;
 }finally{URL.revokeObjectURL(url)}
}
