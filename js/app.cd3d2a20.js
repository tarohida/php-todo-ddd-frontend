(function(e){function t(t){for(var n,r,d=t[0],s=t[1],l=t[2],b=0,u=[];b<d.length;b++)r=d[b],Object.prototype.hasOwnProperty.call(a,r)&&a[r]&&u.push(a[r][0]),a[r]=0;for(n in s)Object.prototype.hasOwnProperty.call(s,n)&&(e[n]=s[n]);i&&i(t);while(u.length)u.shift()();return o.push.apply(o,l||[]),c()}function c(){for(var e,t=0;t<o.length;t++){for(var c=o[t],n=!0,d=1;d<c.length;d++){var s=c[d];0!==a[s]&&(n=!1)}n&&(o.splice(t--,1),e=r(r.s=c[0]))}return e}var n={},a={app:0},o=[];function r(t){if(n[t])return n[t].exports;var c=n[t]={i:t,l:!1,exports:{}};return e[t].call(c.exports,c,c.exports,r),c.l=!0,c.exports}r.m=e,r.c=n,r.d=function(e,t,c){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:c})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var c=Object.create(null);if(r.r(c),Object.defineProperty(c,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(c,n,function(t){return e[t]}.bind(null,n));return c},r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/php-todo-ddd-frontend/";var d=window["webpackJsonp"]=window["webpackJsonp"]||[],s=d.push.bind(d);d.push=t,d=d.slice();for(var l=0;l<d.length;l++)t(d[l]);var i=s;o.push([0,"chunk-vendors"]),c()})({0:function(e,t,c){e.exports=c("56d7")},"0082":function(e,t,c){},"56d7":function(e,t,c){"use strict";c.r(t);c("e260"),c("e6cf"),c("cca6"),c("a79d");var n=c("7a23"),a=Object(n["n"])("data-v-c1a87bd6"),o=a((function(e,t,c,a,o,r){var d=Object(n["i"])("Navigation"),s=Object(n["i"])("ContentArea");return Object(n["e"])(),Object(n["c"])(n["a"],null,[Object(n["d"])(d),Object(n["d"])(s,{"backend-url":e.backendUrl},null,8,["backend-url"])],64)})),r=Object(n["n"])("data-v-00d41362");Object(n["g"])("data-v-00d41362");var d={class:"site-header sticky-top py-1"},s={class:"container d-flex flex-column flex-md-row justify-content-between"};Object(n["f"])();var l=r((function(e,t,c,a,o,r){var l=Object(n["i"])("NavigationTitle"),i=Object(n["i"])("NavigationProfileDropDownCaret");return Object(n["e"])(),Object(n["c"])("header",d,[Object(n["d"])("nav",s,[Object(n["d"])(l),Object(n["d"])(i)])])})),i=Object(n["n"])("data-v-67dba5c3");Object(n["g"])("data-v-67dba5c3");var b=Object(n["d"])("div",{class:"dropdown"},[Object(n["d"])("a",{class:"btn btn-secondary dropdown-toggle",href:"#",role:"button",id:"dropdownMenuLink","data-bs-toggle":"dropdown","aria-expanded":"false"},[Object(n["d"])("span",null,[Object(n["d"])("img",{src:"https://s3.ap-northeast-1.amazonaws.com/media.taro-hida.tk/hatsune_face_mask.jpg",alt:"",class:"user-avatar-md rounded-circle",width:"40",height:"40"})])]),Object(n["d"])("ul",{class:"dropdown-menu","aria-labelledby":"dropdownMenuLink"},[Object(n["d"])("li",null,[Object(n["d"])("span",{class:"dropdown-item"},"@tarohida")]),Object(n["d"])("li",null,[Object(n["d"])("a",{class:"dropdown-item",href:"#"},"ログアウト")])])],-1);Object(n["f"])();var u=i((function(e,t,c,a,o,r){return Object(n["e"])(),Object(n["c"])("div",null,[b])})),j={name:"Profile"};j.render=u,j.__scopeId="data-v-67dba5c3";var f=j,O={class:"py-2",href:"/","aria-label":"Product"},p=Object(n["d"])("svg",{xmlns:"http://www.w3.org/2000/svg",width:"40",height:"40",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",class:"d-block mx-auto",role:"img",viewBox:"0 0 24 24"},[Object(n["d"])("circle",{cx:"12",cy:"12",r:"10"}),Object(n["d"])("path",{d:"M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83m13.79-4l-5.74 9.94"})],-1);function k(e,t){return Object(n["e"])(),Object(n["c"])("a",O,[p])}const v={};v.render=k;var h=v,m={name:"Navigation",components:{NavigationProfileDropDownCaret:f,NavigationTitle:h}};c("b625");m.render=l,m.__scopeId="data-v-00d41362";var g=m,w=Object(n["n"])("data-v-7ca14404");Object(n["g"])("data-v-7ca14404");var y={class:"vue-todo-app-content-area"};Object(n["f"])();var x=w((function(e,t,c,a,o,r){var d=Object(n["i"])("TodoListWithOutBackend"),s=Object(n["i"])("TodoList");return Object(n["e"])(),Object(n["c"])("div",y,[r.backendUrlIsEmpty?(Object(n["e"])(),Object(n["c"])(d,{key:0})):(Object(n["e"])(),Object(n["c"])(s,{key:1,"backend-url":c.backendUrl},null,8,["backend-url"]))])})),T=Object(n["n"])("data-v-4884756a");Object(n["g"])("data-v-4884756a");var I=Object(n["d"])("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css",integrity:"sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk=",crossorigin:"anonymous"},null,-1),_={class:"container"},C={class:"col-md-12 col-12 col-sm-12"},U={class:"card"},P={class:"card-header"},L=Object(n["d"])("label",{for:"create-task-input-box",class:"create-task-input-box-label"},[Object(n["d"])("i",{class:"fas fa-greater-than fa-3x"})],-1),M={class:"card-body"},D={class:"table-responsive"},B={class:"table table-hover"},N={class:"p-1 text-center"},S={class:"custom-checkbox custom-control"};Object(n["f"])();var A=T((function(e,t,c,a,o,r){return Object(n["e"])(),Object(n["c"])(n["a"],null,[I,Object(n["d"])("div",_,[Object(n["d"])("div",C,[Object(n["d"])("div",U,[Object(n["d"])("div",P,[L,Object(n["l"])(Object(n["d"])("input",{type:"text",class:"custom-control-input create-task-input-box",id:"create-task-input-box",placeholder:"What needs to be done?","onUpdate:modelValue":t[1]||(t[1]=function(t){return e.newTask=t}),onKeyup:t[2]||(t[2]=Object(n["m"])((function(){return r.addTask&&r.addTask.apply(r,arguments)}),["enter"]))},null,544),[[n["k"],e.newTask]])]),Object(n["d"])("div",M,[Object(n["d"])("div",D,[Object(n["d"])("table",B,[Object(n["d"])("tbody",null,[(Object(n["e"])(!0),Object(n["c"])(n["a"],null,Object(n["h"])(e.tasks,(function(e,t){return Object(n["e"])(),Object(n["c"])("tr",{class:"todo-list",key:e.id},[Object(n["d"])("td",N,[Object(n["d"])("div",S,[Object(n["d"])("i",{class:"fas fa-times delete-icon",id:r.getDeleteIconId(e.id),onClick:function(t){return r.deleteTask(e.id)}},null,8,["id","onClick"]),Object(n["d"])("label",{for:r.getCheckBoxId(t),class:"custom-control-label"}," ",8,["for"])])]),Object(n["d"])("td",null,Object(n["j"])(e.title),1)])})),128))])])])])])])])],64)})),E=c("d4ec"),W=(c("498a"),c("99af"),c("d81d"),c("bc3a")),z=c.n(W),H=function e(t,c){Object(E["a"])(this,e),this.id=t,this.title=c},q={data:function(){return{tasks:[],newTask:""}},props:["backendUrl"],methods:{getCheckBoxId:function(e){return"checkbox-".concat(e)},getDeleteIconId:function(e){return"delete-icon-".concat(e)},addTask:function(){var e=this.newTask&&this.newTask.trim();if(e){var t=c("5a30"),n=new t;n.append("title",e),z.a.post("".concat(this.backendUrl,"/tasks/create"),n).catch((function(e){return console.log(e)})),this.newTask=""}},deleteTask:function(e){z.a.delete("".concat(this.backendUrl,"/tasks/").concat(e)).catch((function(e){return console.log(e)}))}},mounted:function(){var e=this;setInterval((function(){return z.a.get("".concat(e.backendUrl,"/tasks")).then((function(t){return e.tasks=t.data.map((function(e){return new H(e.id,e.title)}))})).catch((function(e){return console.log(e)}))}),1e3)}};c("9328");q.render=A,q.__scopeId="data-v-4884756a";var F=q,J=Object(n["n"])("data-v-71bdc1c7");Object(n["g"])("data-v-71bdc1c7");var K=Object(n["d"])("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css",integrity:"sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk=",crossorigin:"anonymous"},null,-1),Q={class:"container"},R={class:"col-md-12 col-12 col-sm-12"},V={class:"card"},X={class:"card-header"},Y=Object(n["d"])("label",{for:"create-task-input-box",class:"create-task-input-box-label"},[Object(n["d"])("i",{class:"fas fa-greater-than fa-3x"})],-1),Z={class:"card-body"},G={class:"table-responsive"},$={class:"table table-hover"},ee={class:"p-1 text-center"},te={class:"custom-checkbox custom-control"};Object(n["f"])();var ce=J((function(e,t,c,a,o,r){return Object(n["e"])(),Object(n["c"])(n["a"],null,[K,Object(n["d"])("div",Q,[Object(n["d"])("div",R,[Object(n["d"])("div",V,[Object(n["d"])("div",X,[Y,Object(n["l"])(Object(n["d"])("input",{type:"text",class:"custom-control-input create-task-input-box",id:"create-task-input-box",placeholder:"What needs to be done?","onUpdate:modelValue":t[1]||(t[1]=function(t){return e.newTask=t}),onKeyup:t[2]||(t[2]=Object(n["m"])((function(){return r.addTask&&r.addTask.apply(r,arguments)}),["enter"]))},null,544),[[n["k"],e.newTask]])]),Object(n["d"])("div",Z,[Object(n["d"])("div",G,[Object(n["d"])("table",$,[Object(n["d"])("tbody",null,[(Object(n["e"])(!0),Object(n["c"])(n["a"],null,Object(n["h"])(e.tasks,(function(e,t){return Object(n["e"])(),Object(n["c"])("tr",{class:"todo-list",key:e},[Object(n["d"])("td",ee,[Object(n["d"])("div",te,[Object(n["d"])("i",{class:"fas fa-times delete-icon",id:r.getDeleteIconId(t),onClick:function(e){return r.deleteTask(t)}},null,8,["id","onClick"]),Object(n["d"])("label",{for:r.getDeleteIconId(t),class:"custom-control-label"}," ",8,["for"])])]),Object(n["d"])("td",null,Object(n["j"])(e),1)])})),128))])])])])])])])],64)})),ne=(c("a434"),{data:function(){return{tasks:[],newTask:""}},methods:{getCheckBoxId:function(e){return"checkbox-".concat(e)},getDeleteIconId:function(e){return"delete-icon-".concat(e)},addTask:function(){var e=this.newTask&&this.newTask.trim();e&&(this.tasks.push(e),this.newTask="")},deleteTask:function(e){this.tasks.splice(e,1)}}});c("85cc");ne.render=ce,ne.__scopeId="data-v-71bdc1c7";var ae=ne,oe={name:"ContentArea",components:{TodoListWithOutBackend:ae,TodoList:F},props:["backendUrl"],computed:{backendUrlIsEmpty:function(){return!this.backendUrl}}};c("efe3");oe.render=x,oe.__scopeId="data-v-7ca14404";var re=oe,de={name:"App",data:function(){return{backendUrl:""}},components:{ContentArea:re,Navigation:g}};de.render=o,de.__scopeId="data-v-c1a87bd6";var se=de;c("ab8b"),c("7b17");Object(n["b"])(se).mount("#app")},"690c":function(e,t,c){},"7cde":function(e,t,c){},"82b6":function(e,t,c){},"85cc":function(e,t,c){"use strict";c("0082")},9328:function(e,t,c){"use strict";c("82b6")},b625:function(e,t,c){"use strict";c("7cde")},efe3:function(e,t,c){"use strict";c("690c")}});
//# sourceMappingURL=app.cd3d2a20.js.map