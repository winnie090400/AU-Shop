// products
// app.getProducts=function(tag, paging){
// 	let path;
// 	let keyword;
// 	if(tag===null){
// 		path="/all";
// 	}else if(tag==="women"){
// 		path="/women";
// 	}else if(tag==="men"){
// 		path="/men";
// 	}else if(tag==="accessories"){
// 		path="/accessories";
// 	}else{
// 		path="/search";
// 		keyword=tag;
// 	}
// 	app.state.product=null;
// 	app.ajax("get", app.cst.API_HOST+"/products"+path, "paging="+paging+(keyword?"&keyword="+encodeURIComponent(tag):""), {}, function(req){
// 		app.state.product=JSON.parse(req.responseText);
// 		app.showProducts(app.state.product.data);
// 	});
// };


// // lib
// app.ajax=function(method, src, args, headers, callback){
// 	let req=new XMLHttpRequest();
// 	if(method.toLowerCase()==="post"){ // post through json args
// 		req.open(method, src);
// 		req.setRequestHeader("Content-Type", "application/json");
// 		app.setRequestHeaders(req, headers);
// 		req.onload=function(){
// 			callback(this);
// 		};
// 		req.send(JSON.stringify(args));
// 	}else{ // get through http args
// 		req.open(method, src+"?"+args);
// 		app.setRequestHeaders(req, headers);
// 		req.onload=function(){
// 			callback(this);
// 		};
// 		req.send();
// 	}
// };


// app.showProducts=function(data){
// 	let container=app.get("#products");
// 	if(data.length===0){
// 		app.createElement("h2", {atrs:{
// 			className:"no-result", textContent:"沒有搜尋到任何產品哦"
// 		}}, container);
// 	}else{
// 		for(let i=0;i<data.length;i++){
// 			let product=data[i];
// 			let productContainer=app.createElement("a", {atrs:{
// 				className:"product", href:"product.html?id="+product.id
// 			}}, container);
// 			app.showProduct(product, productContainer);
// 		}
// 	}
// };
// 	app.showProduct=function(product, container){
// 		// main Image
// 		app.createElement("img", {atrs:{
// 			src:product.main_image
// 		}}, container);
// 		// colors
// 		let colorsContainer=app.createElement("div", {atrs:{
// 			className:"colors"
// 		}}, container);
// 		for(let key in product.colors){
// 			let color=product.colors[key];
// 			app.createElement("div", {atrs:{
// 				className:"color"
// 			}, stys:{
// 				backgroundColor:"#"+color.code
// 			}}, colorsContainer);
// 		}
// 		// name and price
// 		app.createElement("div", {atrs:{
// 			className:"name", textContent:product.title
// 		}}, container);
// 		app.createElement("div", {atrs:{
// 			className:"price", textContent:"TWD."+product.price
// 		}}, container);
// 	};


let xhr = new XMLHttpRequest();   // new HttpRequest instance 

xhr.open("GET", '/api/1.0/products/all');
xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

xhr.onreadystatechange = function() {
if (xhr.readyState == 4 && xhr.status == 200) {
  let wws = JSON.parse(xhr.responseText).wws;
  let chemist = JSON.parse(xhr.responseText).chemist;
  let bigw = JSON.parse(xhr.responseText).bigw;

  for (let i = 0; i < wws.length; i++) {

          var card = document.createElement("div");
          card.classList.add("card-body");

          var image = document.createElement("img");
          image.classList.add("card-img-top");
          image.src = wws[i].img;

          var title = document.createElement("h6");
          title.innerHTML = wws[i].title;
          card.appendChild(title);

          var price = document.createElement("h5");
          price.innerHTML = '$ '+ wws[i].price;
          card.appendChild(price);

          var cardList = document.getElementById(`#c${i}`);
          cardList.appendChild(card);
          cardList.appendChild(image);
      }
  }
}
xhr.send();