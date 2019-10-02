
$(function(){
	$("#nav-placeholder").load("nav.html");
});

function tracklist_isTrack(e) {

	e.target.classList.toggle("fas");
	let data = e.target.classList.value.split(" ")[2];
	isTrack(data);

}

function product_isTrack(e){

	e.target.classList.toggle("fas");
	let data = e.target.parentNode.classList.value;;
	isTrack(data);

}

function isTrack(track) {

	let user_info = localStorage.getItem('user_info');

	if(!user_info){

		window.alert('Please sign in first!');
		window.location.href='/signin.html#sign-in';

	}else{

		let xhr = new XMLHttpRequest();

		xhr.open("POST", "/api/1.0/tracklist");

		xhr.setRequestHeader('Content-Type', 'application/json');

		let token = JSON.parse(user_info).data.access_token;
		xhr.setRequestHeader('Authorization', 'Bearer '+ token);

		let trackInfo = {

		    "product_id":track.split('-')[2], 
		    "store":track.split('-')[0],
		    "price":track.split('-')[1]

		};

		if(localStorage.getItem('track_info')){

			let track_info = JSON.parse(localStorage.getItem('track_info'));

			let product_track = track_info.find(function(item, index, array){

			return item.product_id === trackInfo.product_id && item.store === trackInfo.store;

			});

			if(!product_track||product_track === undefined){

				track_info.push(trackInfo)
				localStorage.setItem('track_info', JSON.stringify(track_info));
				console.log('add track cache')

			}else{

				track_info.splice(track_info.indexOf(product_track), 1);
				localStorage.setItem('track_info', JSON.stringify(track_info));
				console.log('delete track cache')

			}

		}else{

			let track_info = [];
			track_info.push(trackInfo);
			localStorage.setItem('track_info', JSON.stringify(track_info));

		};

		xhr.send(JSON.stringify(trackInfo));

		xhr.onreadystatechange = function(){
		    
		    let msg = JSON.parse(xhr.responseText);

		    if(msg.data) {

		    	console.log(msg.data)

		    }else if(msg.error){

		        console.log(msg.error);

		    }
		};

	}

}

function index_isWish(e) {
      
    let heart = e.target;

    heart.classList.toggle("fas");

    let product_id = heart.parentNode.children[1].href;

    isWish(product_id);

}

function store_isWish(e) {
      
    let heart = e.target;

    heart.classList.toggle("fas");

    let product_id = heart.parentNode.children[0].href;

    isWish(product_id);

}

function isWish(product_id) {

	let user_info = localStorage.getItem('user_info');

	if(!user_info){

		window.alert('Please sign in first!');
		window.location.href='/signin.html#sign-in';

	}else{

		let xhr = new XMLHttpRequest();

		xhr.open("POST", "/api/1.0/wishlist");

		xhr.setRequestHeader('Content-Type', 'application/json');

		let token = JSON.parse(user_info).data.access_token;

		xhr.setRequestHeader('Authorization', 'Bearer '+ token);

		let wishInfo = {

		    "product_id":product_id.split('=')[1].split('&')[0], 
		    "store":product_id.split('=')[2],

		};

		if(localStorage.getItem('wish_info')){

			let wish_info = JSON.parse(localStorage.getItem('wish_info'));

			let product_track = wish_info.find(function(item, index, array){

			return item.product_id === wishInfo.product_id && item.store === wishInfo.store;

			});

			if(!product_track||product_track === undefined){

			wish_info.push(wishInfo)
			localStorage.setItem('wish_info', JSON.stringify(wish_info));
			console.log('add track')

			}else{

			wish_info.splice(wish_info.indexOf(product_track), 1);
			localStorage.setItem('wish_info', JSON.stringify(wish_info));
			console.log('delete track')

			}

		}else{

			let wish_info = [];
			wish_info.push(wishInfo);
			localStorage.setItem('wish_info', JSON.stringify(wish_info));

		};

		xhr.send(JSON.stringify(wishInfo));

		xhr.onreadystatechange = function () {
		    
		    let msg = JSON.parse(xhr.responseText);

		    if(msg.data) {
		      console.log(msg.data)
		    }else if(msg.error){
		        console.log(msg.error);
		    }

		};

	}

}

function moreItem(e) {

    let store = e.name;
    location.assign(`/store.html?store=${store}`);
}

function search(e) {

    let keyword = document.getElementById('searchInput').value
    location.assign(`/search.html?keyword=${keyword}`);

}

let input = document.getElementById('searchInput');

input.addEventListener("keyup", function(event) {

	if (event.keyCode === 13) {

	  	event.preventDefault();
	  	search(this);

	}

});

function signOut() {

	let user_info = localStorage.getItem('user_info');
	let token = JSON.parse(user_info).data.access_token;

	if(!user_info){

		window.alert('Please sign in first!');

	}else{

		localStorage.removeItem('user_info');
		localStorage.removeItem('track_info');
		localStorage.removeItem('wish_info');

	}

}
