export const N=24;
export const SUPPORTED_SIZES=[24,29,52] as const;
import {colors} from './colorLibrary';
export {colors} from './colorLibrary';
export type Board=(number|null)[];
export const boardSize=(board:Board)=>Math.round(Math.sqrt(board.length));
export const empty=(size:number=N):Board=>Array(size*size).fill(null);
export const sample=():Board=>{const a=empty();for(let y=3;y<21;y++)for(let x=3;x<21;x++){const X=(x-11.5)/8,Y=(y-10)/8;if(Math.pow(X*X+Y*Y-1,3)-X*X*Y*Y*Y<0)a[y*N+x]=x<12?0:8}return a};
export function resizeBoard(board:Board,newSize:number):Board{const size=boardSize(board),result=empty(newSize),dx=Math.floor((newSize-size)/2),dy=Math.floor((newSize-size)/2);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<newSize&&ny<newSize)result[ny*newSize+nx]=board[y*size+x]}return result}
export function restore():Board{try{const a=JSON.parse(localStorage.getItem('atelier-board')||'null');const size=Math.sqrt(a?.length??0);if(Array.isArray(a)&&SUPPORTED_SIZES.some(v=>v===size)&&a.every(v=>v===null||(Number.isInteger(v)&&v>=0&&v<colors.length)))return a}catch{}return empty(29)}
export function colorCounts(board:Board){return colors.map((hex,i)=>({hex,i,count:board.filter(v=>v===i).length})).filter(v=>v.count>0).sort((a,b)=>b.count-a.count)}
