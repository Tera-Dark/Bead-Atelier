/** Short, locally synthesized tactile sounds; no external audio assets. */
export class BeadSfx{
 private ctx:AudioContext|null=null;
 private last=0;
 unlock(){if(!this.ctx)this.ctx=new AudioContext();if(this.ctx.state==='suspended')void this.ctx.resume()}
 private tone(ctx:AudioContext,start:number,freq:number,volume:number,duration:number,slide=1.15){
  const osc=ctx.createOscillator(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
  osc.type='sine';osc.frequency.setValueAtTime(freq,start);osc.frequency.exponentialRampToValueAtTime(freq*slide,start+duration);
  filter.type='lowpass';filter.frequency.value=1200;
  gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(Math.max(.0001,volume),start+.006);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
  osc.connect(filter);filter.connect(gain);gain.connect(ctx.destination);osc.start(start);osc.stop(start+duration+.005);
  osc.onended=()=>{osc.disconnect();filter.disconnect();gain.disconnect()}
 }
 play(kind:'place'|'erase'|'complete'='place',volume=.45){
  if(volume<=0)return;const now=performance.now();
  if(kind!=='complete'&&now-this.last<48)return;this.last=now;
  try{
   this.unlock();const ctx=this.ctx!;const start=ctx.currentTime;
   if(kind==='complete'){
    [523.25,659.25,783.99].forEach((f,i)=>this.tone(ctx,start+i*.11,f,volume*.08,.28,1.005));return
   }
   const freq=kind==='erase'?345:510+(Math.random()-.5)*80;
   this.tone(ctx,start,freq,volume*.12,kind==='erase'?.065:.1,kind==='erase'?.72:1.22);
   this.tone(ctx,start+.003,freq*1.8,volume*.025,.039,.85);
  }catch{}
 }
 dispose(){void this.ctx?.close();this.ctx=null}
}