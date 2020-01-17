// JavaScript Document
"use strict"

var images = "images/";
var thumbnails = "thumbnails/";
var file = 'data.xml';
var xmlData;
var currentProject;

document.addEventListener('DOMContentLoaded', function() {
    displayMenu();
	document.documentElement.style.background = "url(images/frontpage_josejompero.jpg) no-repeat center center fixed";
	//loadThumbnails(0);
}, false);

function displayMenu() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			createMenu(this);
    	}
	};
	xhttp.open("GET", file, true);
	xhttp.send();
}

function createMenu(xml) {
	var i;
	xmlData = xml.responseXML;	
	var projectList = xmlData.getElementsByTagName('project');
	var menuList = '';
	
	for (i = 0; i < projectList.length; i++) {
		var project = projectList[i].getAttribute('name');
		if (i == currentProject) {
			menuList += '<li onclick="openProject(' + i + ')"><u>' + project + '</u></li>';
		} else {
			menuList += '<li onclick="openProject(' + i + ')">' + project + '</li>';
		}
	}
	document.getElementById("projectMenu").innerHTML = menuList;
}

function openProject(project) {
	currentProject = project;
	clearInfo();
	document.documentElement.style.background = "";
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			displayPhoto(0);
    	}
	};
	xhttp.open("GET", file, true);
	xhttp.send();
	
	displayMenu();
}

function loadThumbnails(project) {
	currentProject = project;
	clearInfo();
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			displayThumbnails();
    	}
	};
	xhttp.open("GET", file, true);
	xhttp.send();
	
	displayMenu();
}

function displayThumbnails() {
	var allThumbnails = '';
		
	var i;
	var projectList = xmlData.getElementsByTagName("project");
	var thumbnailList = projectList[currentProject].getElementsByTagName("image");
	for (i = 0; i < thumbnailList.length; i++) {
		var image = thumbnailList[i].childNodes[0].nodeValue;
		var thumbnailX = thumbnailList[i].getElementsByTagName("thumbnailX")[0].childNodes[0].nodeValue;
		var thumbnailY = thumbnailList[i].getElementsByTagName("thumbnailY")[0].childNodes[0].nodeValue;
			
		allThumbnails += '<img class="thumbnail" src="' + thumbnails + image + '" alt="' + image + '" style="margin-left:' + thumbnailX + '; margin-top:' + thumbnailY + '"; onclick="displayPhoto(' + i + ')">';
	}
	document.getElementById("thumbnails").innerHTML = allThumbnails;
}

function displayPhoto(i) {
	//document.getElementById("thumbnails").innerHTML = '';	
	var photo = xmlData.getElementsByTagName("project")[currentProject].getElementsByTagName("image")[i];
	
	var image = photo.childNodes[0].nodeValue;
	var title = photo.getElementsByTagName("title")[0].childNodes[0].nodeValue;
	var description = photo.getElementsByTagName("description")[0].childNodes[0].nodeValue;
	
	var photos = xmlData.getElementsByTagName("project")[currentProject].getElementsByTagName("image").length;
	var nextPhoto = i + 1;
	var prevPhoto = i - 1;
	
	if (nextPhoto >= photos) {
		nextPhoto = 0;
	}
	if (prevPhoto < 0) {
		prevPhoto = photos - 1;
	}
		
	var display = 	
		'<div class="photoNav"><div><a onclick="displayPhoto(' + prevPhoto + ')">Previous</a> / <a onclick="displayPhoto(' + nextPhoto + ')">Next </a></div><div class="navInfo">(' + (i + 1) + '/' + photos + ')</div></div><div class="photo"><img src="' + images + image + '" alt="' + image + '"><h2 class="photoTitle">' + title + '</h2><p class="description">' + description + '</p></div>';
	
	document.getElementById("photoDisplay").innerHTML = display;
	
	document.onkeydown = function(e) {
        e = e || window.event;
        if (e.keyCode == '37') {
            displayPhoto(prevPhoto); //left <- show Prev image
        } else if (e.keyCode == '39') {
            // right -> show next image
            displayPhoto(nextPhoto);
		}
	};
}

/* Old
function displayPhoto(i) {
	document.getElementById("thumbnails").innerHTML = '';	
	var photo = xmlData.getElementsByTagName("project")[currentProject].getElementsByTagName("image")[i];
	
	var image = photo.childNodes[0].nodeValue;
	var title = photo.getElementsByTagName("title")[0].childNodes[0].nodeValue;
	var description = photo.getElementsByTagName("description")[0].childNodes[0].nodeValue;
		
	var display = '<div class="closePhoto" onclick="clearPhotoDisplay()">X</div><div class="photo"><img class="image" src="' + images + image + '" alt="' + image + '"><h2 class="photoTitle">' + title + '</h2><p class="description">' + description + '</p></div>';
	document.getElementById("photoDisplay").innerHTML = display;
}*/

function clearPhotoDisplay() {
	document.getElementById("photoDisplay").innerHTML = '';
	loadThumbnails(currentProject);
}

function info() {
	var info = xmlData.getElementsByTagName("info")[0].childNodes[0].nodeValue;
	
	document.getElementById("photoDisplay").innerHTML = '<div class="infoText">' + info + '</div>';
	document.documentElement.style.background = "";
	
	currentProject = null;
	displayMenu();
	
	document.getElementById("email").innerHTML = 'info@josejompero.com';
	

}

function clearInfo() {
	document.getElementById("email").innerHTML = '';
}