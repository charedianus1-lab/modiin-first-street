import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
const canvas=document.querySelector('#world');
const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
const scene=new T.Scene();scene.background=new T.Color('#afc8d5');scene.fog=new T.Fog('#b8c6ca',45,155);
const camera=new T.PerspectiveCamera(64,1,.1,250);
scene.add(new T.HemisphereLight('#e0eefb','#7a705e',2.1));
const sun=new T.DirectionalLight('#fff0d0',3);sun.position.set(-24,38,-15);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-30;sun.shadow.camera.right=30;sun.shadow.camera.top=30;sun.shadow.camera.bottom=-30;sun.shadow.normalBias=.03;sun.shadow.bias=-.0002;scene.add(sun);scene.add(sun.target);
function texture(type){const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');
if(type==='stone'){g.fillStyle='#d1c7ac';g.fillRect(0,0,512,512);for(let y=0;y<512;y+=64)for(let x=-128;x<512;x+=128){const xx=x+(y%128?64:0);g.fillStyle=`hsl(42 19% ${68+Math.random()*12}%)`;g.fillRect(xx+2,y+2,124,60);for(let n=0;n<140;n++){g.fillStyle=`rgba(66,54,37,${Math.random()*.1})`;g.fillRect(xx+Math.random()*128,y+Math.random()*64,Math.random()*4,1);}}}
else{g.fillStyle=type==='asphalt'?'#565958':'#aaa89c';g.fillRect(0,0,512,512);for(let i=0;i<45000;i++){const v=Math.random()*100;g.fillStyle=`rgba(${v+70},${v+70},${v+65},.23)`;g.fillRect(Math.random()*512,Math.random()*512,1,1);}if(type==='paving'){g.strokeStyle='#7f817b';g.lineWidth=2;for(let y=0;y<=512;y+=64){g.beginPath();g.moveTo(0,y);g.lineTo(512,y);g.stroke();for(let x=0;x<=512;x+=128){g.beginPath();g.moveTo(x+(y%128?64:0),y);g.lineTo(x+(y%128?64:0),y+64);g.stroke();}}}}
const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;return t;}
const stone=texture('stone'),roadTex=texture('asphalt'),paveTex=texture('paving');roadTex.repeat.set(7,70);paveTex.repeat.set(2,90);
const stoneMat=new T.MeshStandardMaterial({map:stone,roughness:.94}),concrete=new T.MeshStandardMaterial({color:'#c4bba5',roughness:1}),glass=new T.MeshStandardMaterial({color:'#526570',metalness:.45,roughness:.25}),metal=new T.MeshStandardMaterial({color:'#464d4c',roughness:.65}),doorMat=new T.MeshStandardMaterial({color:'#665a49',roughness:.85});
function box(x,y,z,w,h,d,mat,shadow=true){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y+h/2,z);m.castShadow=shadow;m.receiveShadow=true;scene.add(m);return m;}
function plane(w,h,mat,x,y,z){const m=new T.Mesh(new T.PlaneGeometry(w,h),mat);m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.receiveShadow=true;scene.add(m);return m;}
plane(240,320,new T.MeshStandardMaterial({color:'#9d9e83',roughness:1}),0,-.1,85);
plane(13,240,new T.MeshStandardMaterial({map:roadTex,roughness:.94}),0,0,80);
for(let side of [-1,1]){plane(3.2,240,new T.MeshStandardMaterial({map:paveTex,roughness:1}),side*8.1,.14,80);box(side*6.56,0,80,.16,.17,240,concrete,false);}
const stripeMat=new T.MeshStandardMaterial({color:'#e3d6ac',roughness:.8});for(let z=-36;z<200;z+=8){plane(.1,3.5,stripeMat,0,.014,z);}for(let side of [-1,1])plane(.1,240,stripeMat,side*5.9,.015,80);
const railMat=new T.MeshStandardMaterial({color:'#77776e',metalness:.65,roughness:.55});
for(let side of [-1,1])for(let i=-1;i<9;i++){const z=i*20,height=12+(i%3+3)%3*2.7,x=side*15;
const mat=stoneMat.clone();mat.map=stone.clone();mat.map.repeat.set(2.5,3.5);mat.map.needsUpdate=true;box(x,0,z,10,height,16,mat);box(x,height,z,10.2,.28,16.2,concrete);
const frontX=side*9.96;
for(let floor=0;floor<4;floor++)for(let col=0;col<5;col++){const zz=z-6+col*2.9,yy=1.3+floor*2.8;
box(frontX,yy,zz,.055,1.65,1.35,glass,false);box(frontX-side*.04,yy+.78,zz,.08,.06,1.35,concrete,false);box(frontX-side*.05,yy,zz,.08,1.65,.06,concrete,false);
if((col+floor)%3===0){box(frontX-side*.6,yy-.1,zz,1.3,.13,1.75,concrete);box(frontX-side*1.22,yy,zz,.05,.85,1.75,railMat,false);for(let dz of [-.8,.8])box(frontX-side*.6,yy,zz+dz,1.25,.85,.04,railMat,false);}
if(col===4 && floor%2===0){box(frontX-side*.27,yy,zz+.9,.55,.5,.65,concrete);}
}
box(frontX,0,z,.1,2.4,1.8,doorMat);box(frontX-side*.8,.14,z,1.6,.12,3,concrete);
}
// Street lamps and trees are scenery, not added game mechanics.
const bark=new T.MeshStandardMaterial({color:'#78644f',roughness:1});const foliage=new T.MeshStandardMaterial({color:'#607b4f',roughness:1});
for(let i=-1;i<9;i++){for(const side of [-1,1]){const z=i*21+10,x=side*7.2;box(x,.14,z,.1,5.2,.1,metal);box(x-side*.45,5.3,z,1,.12,.12,metal);box(x-side*.9,5.25,z,.4,.08,.25,new T.MeshStandardMaterial({color:'#d8d2b7',emissive:'#c8b78b',emissiveIntensity:.1}));if(i%2===0){box(side*8.7,.14,z+5,.23,2.2,.23,bark);for(let n=0;n<3;n++){const crown=new T.Mesh(new T.IcosahedronGeometry(1.1,1),foliage);crown.position.set(side*8.7+(n-1)*.3,2.7+n*.3,z+5);crown.castShadow=true;scene.add(crown);}}}}
function sign(){const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');g.fillStyle='#245669';g.fillRect(0,0,512,128);g.strokeStyle='#e7e8df';g.lineWidth=5;g.strokeRect(8,8,496,112);g.fillStyle='white';g.font='bold 45px Arial';g.textAlign='center';g.fillText('הרחוב הראשון',256,82);const m=new T.MeshStandardMaterial({map:new T.CanvasTexture(c),roughness:.7});box(-7.9,.14,1,.1,2.7,.1,metal);box(-7.9,2.5,1,2.2,.55,.09,m);}sign();
const player=new T.Group();scene.add(player);const pos=new T.Vector3(-3,0,0);let yaw=0,pitch=.12,mixer,idle,walk,active;
const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const assets=Promise.all(['character','idle','walk'].map(n=>loader.loadAsync(`assets/${n}.glb`)));
assets.then(([model,ig,wg])=>{const avatar=model.scene;const bb=new T.Box3().setFromObject(avatar);const size=bb.getSize(new T.Vector3());avatar.scale.setScalar(1.78/size.y);const b2=new T.Box3().setFromObject(avatar);avatar.position.y=-b2.min.y;avatar.rotation.y=0;avatar.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});player.add(avatar);mixer=new T.AnimationMixer(avatar);
const fix=clip=>{const c=clip.clone();c.tracks=c.tracks.filter(t=>!t.name.includes('Footsteps'));return c;};idle=mixer.clipAction(fix(ig.animations[0]));walk=mixer.clipAction(fix(wg.animations[0]));idle.play();active=idle;document.querySelector('#loading').style.display='none';window.gameReady=true;}).catch(e=>{document.querySelector('#loading').innerHTML='<strong>הטעינה לא הסתיימה</strong><span>נא לרענן את הדף</span>';console.error(e);});
const input={x:0,y:0},keys=new Set();window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key)){e.preventDefault();keys.add(e.key);}});window.addEventListener('keyup',e=>keys.delete(e.key));
const stick=document.querySelector('#stick'),knob=document.querySelector('#knob');let stickId=null;
function stickMove(e){const r=stick.getBoundingClientRect();const dx=e.clientX-r.x-r.width/2,dy=e.clientY-r.y-r.height/2,l=Math.hypot(dx,dy),scale=l>43?43/l:1;input.x=dx*scale/43;input.y=-dy*scale/43;knob.style.transform=`translate(${dx*scale}px,${dy*scale}px)`;}
stick.addEventListener('pointerdown',e=>{stickId=e.pointerId;stick.setPointerCapture(e.pointerId);stickMove(e);});stick.addEventListener('pointermove',e=>{if(stickId===e.pointerId)stickMove(e);});function release(){input.x=input.y=0;stickId=null;knob.style.transform='';}stick.addEventListener('pointerup',release);stick.addEventListener('pointercancel',release);stick.addEventListener('lostpointercapture',release);
const look=document.querySelector('#look');let lookId=null,prevX,prevY;look.addEventListener('pointerdown',e=>{lookId=e.pointerId;prevX=e.clientX;prevY=e.clientY;look.setPointerCapture(e.pointerId);});look.addEventListener('pointermove',e=>{if(lookId===e.pointerId){yaw-=(e.clientX-prevX)*.005;pitch=T.MathUtils.clamp(pitch+(e.clientY-prevY)*.003,-.15,.5);prevX=e.clientX;prevY=e.clientY;}});look.addEventListener('pointerup',()=>lookId=null);look.addEventListener('pointercancel',()=>lookId=null);
window.addEventListener('blur',()=>{keys.clear();release();lookId=null;});document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();release();}});
document.querySelector('#reset').onclick=()=>{pos.set(-3,0,0);yaw=0;pitch=.12;keys.clear();release();};document.querySelector('#fullscreen').onclick=async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}catch{document.querySelector('#status').textContent='אפשר לשחק גם בחלון הדפדפן';}};
let previousTime=performance.now();let frames=0;
function animate(){const now=performance.now();const dt=Math.min((now-previousTime)/1000,.05);previousTime=now;const width=canvas.clientWidth,height=canvas.clientHeight;if(canvas.width!==Math.floor(width*renderer.getPixelRatio())||canvas.height!==Math.floor(height*renderer.getPixelRatio())){renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}
let ix=input.x+(keys.has('d')||keys.has('ArrowRight')?1:0)-(keys.has('a')||keys.has('ArrowLeft')?1:0);let iy=input.y+(keys.has('w')||keys.has('ArrowUp')?1:0)-(keys.has('s')||keys.has('ArrowDown')?1:0);const amount=Math.min(1,Math.hypot(ix,iy));if(amount>.1){const len=Math.hypot(ix,iy);ix/=len;iy/=len;pos.x+=(-Math.sin(yaw)*iy+Math.cos(yaw)*ix)*dt*2.4;pos.z+=(Math.cos(yaw)*iy+Math.sin(yaw)*ix)*dt*2.4;pos.x=T.MathUtils.clamp(pos.x,-8.9,8.9);pos.z=T.MathUtils.clamp(pos.z,-12,135);player.rotation.y=Math.atan2(-Math.sin(yaw)*iy+Math.cos(yaw)*ix,Math.cos(yaw)*iy+Math.sin(yaw)*ix);}
player.position.copy(pos);if(mixer){const next=amount>.1?walk:idle;if(next!==active){active.fadeOut(.18);next.reset().fadeIn(.18).play();active=next;}mixer.update(dt);}
const desired=new T.Vector3(pos.x+Math.sin(yaw)*3.3,1.7+pitch*2,pos.z-Math.cos(yaw)*3.3);camera.position.lerp(desired,1-Math.exp(-dt*12));camera.lookAt(pos.x-Math.sin(yaw)*4,1.4-pitch*2,pos.z+Math.cos(yaw)*4);sun.target.position.copy(pos);sun.position.set(pos.x-24,38,pos.z-15);renderer.render(scene,camera);frames++;window.gameState={x:pos.x,z:pos.z,yaw,frames,moving:amount>.1,animation:active===walk?'walk':'idle',triangles:renderer.info.render.triangles};}
renderer.setAnimationLoop(animate);
