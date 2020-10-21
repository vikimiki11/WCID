sign=[]
equation=[]
let toprint=""
for(let i of template){
	for(let z of i){
		if(typeof z == "object"){
			equation[equation.length]=[]
			for(let y=0;y<=z.length;y+=2){
				if(y!=0){
					toprint+=" "+z[y-1]+" "
				}
				if(typeof z[y]!="undefined"){
						toprint+=' <span class="'+z[y]+'">'+z[y]+"</span> "
					if(!equation[equation.length-1].includes(z[y])){
						equation[equation.length-1][equation[equation.length-1].length]=z[y]
					}
					if(!sign.includes(z[y])){
						sign[sign.length]=z[y]
					}
				}
				
				
				
			}
		}else{toprint+=" "+z+" "}
	}
	toprint+="<hr>"
}
document.querySelector("#output").innerHTML=toprint
toprint="<table><tr><th>Sign</th><th>I have</th><th>I need</th></tr>"
for(let i of sign){
	toprint+="<tr><td>"+i+':</td><td><input type="checkbox" value="'+i+'" class="have"></td><td><input type="checkbox" value="'+i+'" class="need"></td></tr>'
}
document.querySelector("#input").innerHTML=toprint
function changeinput(){
	let have=[]
	let need=[]
	for(i of document.querySelectorAll("input")){
		if(i.checked){
			if(i.className=="have"){
				have[have.length]=i.value
			}else{
				if(!have.includes(i.value)){
					need[need.length]=i.value
				}
			}
		}
	}
	update(have,need,{},0)
}
function update(have,need,calculated,round){
	change=false
	for(i of equation){
		x=[]
		round=0
		for(y of i){
			if(!have.includes(y) && typeof calculated[y] == "undefined" && !x.includes(y)){
				x[x.length]=y
				if(typeof calculated[y] != "undefined" ){
					if(calculated[y][1]>=round){
						round=calculated[y][1]+1
					}
				}
			}
		}
		if(x.length==1){
			calculated[x[0]]=[x[0],round,i]
			change=true
		}
	}
	if(change){
		update(have,need,calculated,round)
	}else{
		write(have,need,calculated,round)
	}
}
function write(have,need,calculated,round){
	toprint="."+have.join(",.")+"{color:rgb(0,255,0);text-decoration: underline;}\n"
	for(i in calculated){
		color=256*(calculated[i][1]+1)/(round+1)
		toprint+="."+i+"{color:rgb(0,"+(256-color)+","+color+")}\n"
	}
	document.querySelector("#change").innerHTML=toprint
	document.querySelector("#steps").innerHTML=""
	for(i of need){
		if(typeof calculated[i]!="undefined"){
			document.querySelector("#steps").appendChild(get_way(i,have,calculated))
		}
	}
}
function get_way(x,have,calculated){
	if(have.includes(x)){
		return document.createTextNode(x);
	}else{
		let z=[]
		for(y of calculated[x][2]){
			if(y!=x){
				z[z.length]=y
			}
		}
		let trtoprint=document.createElement("tr");
		for(i of z){
			let tdtoprint=document.createElement("td");
			tdtoprint.appendChild(get_way(i,have,calculated));
			trtoprint.appendChild(tdtoprint);
		}
		let toprint=document.createElement("table");
		toprint.appendChild(trtoprint);
		trtoprint=document.createElement("tr");
		let tdtoprint=document.createElement("td");
		tdtoprint.appendChild(document.createTextNode(template[equation.indexOf(calculated[x][2])][0].join(" ")))
		tdtoprint.colSpan="200"
		trtoprint.appendChild(tdtoprint)
		toprint.appendChild(trtoprint);
		trtoprint=document.createElement("tr");
		tdtoprint=document.createElement("td");
		tdtoprint.appendChild(document.createTextNode(x))
		tdtoprint.colSpan="200"
		trtoprint.appendChild(tdtoprint)
		toprint.appendChild(trtoprint);
		return toprint
	}
}
function repAll(txt){
	for(o in toreplace){
		txt=txt.replaceAll(o,toreplace[o])
	}
	return txt
}