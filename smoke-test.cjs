/** Run with: node tests/smoke-test.cjs */
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const elements=new Map(),handlers={};const node=()=>({innerHTML:'',addEventListener(){},value:'',click(){}});
for(const id of ['#app','#modal-root','#toast-root','#camera-input','#photo-input','#backup-input'])elements.set(id,node());
const document={querySelector:s=>elements.get(s)||node(),addEventListener:(name,fn)=>handlers[name]=fn,createElement:()=>node(),body:{appendChild(){}}};
const backing={};const context={document,window:{location:{protocol:'file:'},scrollTo(){}},navigator:{},localStorage:{getItem:k=>backing[k]??null,setItem:(k,v)=>backing[k]=v},crypto:{randomUUID:()=>`test-id-${Math.random()}`},URL:{},console,Date,Math,Set,Number,String,Array,Object,RegExp,JSON,setTimeout,clearTimeout};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../app.js'),'utf8'),context);const api=context.window.PantryPilotTest;
const scanned=api.parseReceipt(api.RECEIPT_SAMPLE);assert.equal(scanned.length,12,'12 groceries on sample receipt');
assert.equal(scanned.find(x=>x.name==='Eggs').qty,12);
assert.equal(scanned.find(x=>x.name==='Milk').unit,'gal');
for(const [line,expected] of [['PEANUT BUTTER 1 JAR 3.49','Peanut butter'],['PASTA SAUCE 1 JAR 2.99','Pasta sauce'],['DICED TOMATOES 1 CAN 1.99','Canned tomatoes']])assert.equal(api.parseReceipt(line)[0].name,expected);
assert.equal(api.parseReceipt('SUBTOTAL 12.34\nTAX 0.41\nTOTAL 12.75').length,0);
function click(action,id){handlers.click({target:{closest:()=>({dataset:{action,id}})},preventDefault(){}});}
click('sample');assert.match(elements.get('#modal-root').innerHTML,/Review groceries/);
click('save-review');assert.equal(api.getData().inventory.length,12,'review adds 12 pantry items');
const ready=api.recipes.filter(r=>api.coverage(r).ready);
assert.equal(ready.length,5,'sample yields five candidate recipes');
assert.equal(api.compareUnits(1,'gal',2,'cup'),'yes');
assert.equal(api.compareUnits(1,'ea',2,'cup'),'unknown');
click('recipe','recipe-3');assert.match(elements.get('#modal-root').innerHTML,/Chicken rice bowls/);
click('recipe-shop','recipe-3');assert.equal(api.getData().shopping.length,1,'broccoli added to shopping list');
click('cook','recipe-17');click('confirm-cook','recipe-17');
const chicken=api.getData().inventory.find(x=>x.name==='Chicken breast');assert.equal(chicken.qty,1.5,'cooking chicken tacos deducts 0.5 lb');
assert.ok(backing['pantrypilot-v1'],'pantry is saved locally');
console.log('✅ PantryPilot smoke tests passed: receipt parse, ingredient matching, shopping list, cooking deductions, persistence.');
