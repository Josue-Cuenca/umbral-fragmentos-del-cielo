"""Bake the supplied project's chiptune motifs into local WAV assets for Phaser.Sound."""
import math,wave,struct
from pathlib import Path
RATE=22050
out=Path('src/assets/audio');out.mkdir(parents=True,exist_ok=True)
def wav(name,samples):
 with wave.open(str(out/(name+'.wav')),'wb') as f:
  f.setnchannels(1);f.setsampwidth(2);f.setframerate(RATE)
  f.writeframes(b''.join(struct.pack('<h',max(-32767,min(32767,int(s*24000)))) for s in samples))
def note(data,start,freq,duration,amp=.3,end=None):
 for j in range(int(duration*RATE)):
  k=int(start*RATE)+j
  if k>=len(data):break
  t=j/RATE;env=min(1,t/.008)*math.exp(-t/max(.02,duration*.33))
  phase=2*math.pi*(freq*t if end is None else freq*t+(end-freq)*t*t/(2*duration))
  data[k]+=amp*(2/math.pi*math.asin(math.sin(phase)))*env
melodies=[[64,71,76,78,76,71,67,71,62,69,74,76,74,69,66,69],[61,68,73,75,80,75,73,68,59,66,71,73,78,73,71,66],[62,69,74,78,81,78,74,69,60,67,72,76,72,67,62,69]]
for z,m in enumerate(melodies):
 data=[0.] * int(16*.205*RATE)
 for i,n in enumerate(m):
  note(data,i*.205,440*2**((n-69)/12),.24,.4)
  if i%4==0:note(data,i*.205,440*2**((m[(i//8)%2*8]-24-69)/12),.45,.3)
 wav('music-'+str(z),data)
for name,freq,end,duration in [('jump',200,450,.16),('dash',550,70,.17),('slash',280,70,.1),('shoot',850,270,.13),('hurt',150,40,.22),('hit',100,30,.1),('kill',240,40,.25),('save',880,1320,.3),('locked',90,70,.14),('break',450,80,.22),('death',220,30,.7)]:
 data=[0.]*int(duration*RATE);note(data,0,freq,duration,.8,end);wav(name,data)
for name in ['upgrade','victory']:
 data=[0.]*int(1.1*RATE)
 for i,n in enumerate([0,4,7,12,16]):note(data,i*.11,330*2**(n/12),.45,.6)
 wav(name,data)
print('3 music loops and 13 effects baked into WAV files.')
