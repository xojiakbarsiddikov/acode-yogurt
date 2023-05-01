import{_ as F,j as H,r as n,o as Y,k as L,a as w,b as r,c,f as i,d as l,e as h,t as m,F as O,l as R,g as x,P as G,v as _,n as J,m as K,p as Q,h as W,q as C}from"./index-c7b8243f.js";const y=f=>(Q("data-v-937511e3"),f=f(),W(),f),X={class:"surface-section px-4 py-8 md:px-6 lg:px-8 border-1 surface-border border-round"},Z={class:"header-text flex text-center justify-content-center mb-3"},ee={class:"text-900 font-medium text-3xl text-center mb-2 mt-2 text-center"},te={key:0,class:"text-primary"},se={key:1},le={class:"text-900 font-medium text-3xl text-center mb-2 mt-2 ml-5"},oe={key:0,class:"text-red-600"},ae={key:1},ne=y(()=>l("p",{class:"mt-0 p-0 mb-5 text-900 font-medium text-2xl"},"Users",-1)),ie={class:"grid -mt-3 -ml-3 -mr-3"},ue={class:"p-2"},re={class:"shadow-2 p-4 surface-card border-round"},ce={class:"relative mb-3 flex"},de={class:"buttons p-button-rounded p-button-success mr-2 margin"},pe={class:"icon"},ve={class:"flex justify-content-between align-items-center mb-3"},me={class:"modal"},_e={class:"field"},fe=y(()=>l("label",{for:"name"},"Username",-1)),be={class:"field"},he=y(()=>l("label",{for:"quantity"},"Password",-1)),xe={class:"p-inputgroup"},ye={class:"flex align-items-center justify-content-center"},ge=y(()=>l("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1)),ke={key:0},we={__name:"CreateUser",setup(f){const g=H(),d=n(!1),u=n(null),t=n({}),S=n(null),V=n(null);n(null);const I=n(3),v=n(!1),T=new G,$=n(!1),p=n(null),D=n(null),k="http://127.0.0.1:8000";Y(async()=>{T.getUsers().then(s=>{u.value=s.reverse(),p.value=s[s.length-1],s.forEach(b=>{D.value=b.id}),S.value=u.value.length-p.value.id;let e=0;for(var a in s)e+=s[a].count;V.value=e})}),L(()=>{(()=>u.value.slice(0,I.value))()});const B=async()=>{if(t.value.username&&t.value.security.trim()){if(t.value.id){u.value[N(t.value.id)]=t.value;const s={username:t.value.username,password:t.value.security};await C({method:"PATCH",url:`${k}/edit/user/${t.value.id}/`,data:s,headers:{"Content-Type":"multipart/form-data"}}).then(e=>{console.log(e),window.location.reload()}).catch(e=>{console.log(e)}),g.add({severity:"success",summary:"Successful",detail:"Product Updated",life:3e3})}else{t.value.id=U(),t.value.code=U(),t.value.image="product-placeholder.svg",u.value.unshift(t.value);const s={username:t.value.username,password:t.value.security};await C({method:"POST",url:`${k}/user/`,data:s,headers:{"Content-Type":"multipart/form-data"}}).then(()=>{window.location.reload()}).catch(e=>console.log(e)),g.add({severity:"success",summary:"Successful",detail:"Product Created",life:3e3})}d.value=!1,t.value={}}},q=async s=>{console.log(s),u.value=u.value.filter(e=>e.id!==t.value.id),await C.delete(`${k}/delete/user/${s}/`).then(()=>{window.location.reload()}).catch(e=>console.log(e)),t.value={},v.value=!1,g.add({severity:"success",summary:"Successful",detail:"Product Deleted",life:3e3})},A=s=>{t.value=s,v.value=!0},j=s=>{t.value={...s},d.value=!0},N=s=>{let e=-1;for(let a=0;a<u.value.length;a++)if(u.value[a].id===s){e=a;break}return e},U=()=>{let s="";const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let a=0;a<5;a++)s+=e.charAt(Math.floor(Math.random()*e.length));return s};n([{breakpoint:"1024px",numVisible:3,numScroll:3},{breakpoint:"768px",numVisible:2,numScroll:2},{breakpoint:"560px",numVisible:1,numScroll:1}]);const z=()=>{t.value={},d.value=!0},M=()=>{d.value=!1};return(s,e)=>{const a=w("Button"),b=w("InputText"),P=w("Dialog");return r(),c("div",X,[i(a,{label:"User Yaratish",icon:"pi pi-fw pi-plus",class:"p-button-help bg-primary border-primary",onClick:e[0]||(e[0]=o=>z()),disabled:!p.value},null,8,["disabled"]),l("div",Z,[l("div",ee,[h("User: "),S.value?(r(),c("span",te,m(u.value.length-p.value.id),1)):(r(),c("span",se,"0"))]),l("div",le,[h("Admin: "),p.value?(r(),c("span",oe,m(p.value.id),1)):(r(),c("span",ae,"0"))])]),ne,l("div",ie,[(r(!0),c(O,null,R(u.value,o=>(r(),c("div",{class:"col-12 product md:col-6 lg:col-3 mb-5 lg:mb-0",key:o.id},[l("div",ue,[l("div",re,[l("div",ce,[i(a,{class:_(["surface-card text-900 shadow-2 px-3 py-2 absolute btn",o.id===1?"text-red-600":"text-primary"]),style:J({borderRadius:"1.5rem",top:"1rem"}),label:o.id===1?"Admin":"User"},null,8,["style","label","class"]),l("div",de,[i(a,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:E=>j(o)},null,8,["onClick"]),i(a,{icon:"pi pi-trash",disabled:o.id===1,class:"p-button-warning p-button p-button-icon-only p-button-rounded p-button-success mr-2",onClick:E=>A(o)},null,8,["disabled","onClick"])])]),l("div",pe,[l("i",{class:_(["pi pi-user text-center",o.id===1?"text-red-600":"text-primary"])},null,2)]),l("div",ve,[l("span",{class:_(["text-900 font-medium text-xl",o.id===1?"text-red-600":""])},m(o.username),3),l("span",{class:_(["text-xl font-medium",o.id===1?"red-color":"text-primary"])},m(o.security),3)])])])]))),128)),l("div",me,[i(P,{visible:d.value,"onUpdate:visible":e[3]||(e[3]=o=>d.value=o),style:{width:"450px"},header:"User yaratish",modal:!0,class:"p-fluid",value:t.value},{footer:x(()=>[i(a,{label:"Bekor qilish",icon:"pi pi-times",class:"p-button-text",onClick:M}),i(a,{label:"Saqlash",icon:"pi pi-check",class:"p-button-text",onClick:B})]),default:x(()=>[l("div",_e,[fe,i(b,{placeholder:"username",id:"name",modelValue:t.value.username,"onUpdate:modelValue":e[1]||(e[1]=o=>t.value.username=o),autofocus:"",class:_(["input",{activess:$.value}])},null,8,["modelValue","class"])]),l("div",be,[he,l("div",null,[l("div",xe,[i(b,{id:"quantity",modelValue:t.value.security,"onUpdate:modelValue":e[2]||(e[2]=o=>t.value.security=o),integeronly:"",placeholder:"Password"},null,8,["modelValue"])])])])]),_:1},8,["visible","value"]),i(P,{visible:v.value,"onUpdate:visible":e[6]||(e[6]=o=>v.value=o),style:{width:"450px"},header:"Tovar o'chirish",modal:!0},{footer:x(()=>[i(a,{label:"Yo'q",icon:"pi pi-times",class:"p-button-text",onClick:e[4]||(e[4]=o=>v.value=!1)}),i(a,{label:"Ha",icon:"pi pi-check",class:"p-button-text",onClick:e[5]||(e[5]=o=>q(t.value.id))})]),default:x(()=>[l("div",ye,[ge,t.value?(r(),c("span",ke,[h("Are you sure you want to delete "),l("b",null,m(t.value.username),1),h("?")])):K("",!0)])]),_:1},8,["visible"])])])])}}},Se=F(we,[["__scopeId","data-v-937511e3"]]);export{Se as default};
