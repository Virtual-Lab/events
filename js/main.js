var header = $('header');
var section = $('section');

function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'event_data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
}

// $.ajax({
//     url : "https://www.zhdk.ch/api/event/?offset=0&limit=20",
//     type : 'GET',
//     crossDomain: true,
//     data : "json",
//     async: false, 
//     dataType : "jsonp",
//     success : function(response) {

//     var zhdkEvents = response;
//     console.log(zhdkEvents);
//     parseFile(zhdkEvents);

//     }
// });

function init() {
 loadJSON(function(response) {
  // Parse JSON string into object
    var zhdkEvents = JSON.parse(response);
    console.log(zhdkEvents);
    parseFile(zhdkEvents);
 });
}

function parseFile(jsonObj) {

	var meta = jsonObj['meta'];
	var hits = jsonObj['hits'];
	var aggregations = jsonObj['aggregations'];

	for (var i = 0; i < hits.length; i++) {

		createArticle(hits[i], aggregations[i])

	}
}

function createArticle(obj, aggregations) {
	var data = obj['data'];
	
	var title = data['title'];
	var date_start = data['date_start'];
	var date = date_start.date.split(" ");

	var teaserobj = data['teaser'];
	console.log("teaser = ", teaserobj);

	if (teaserobj.length > 0) {
		var teaser = teaserobj[0].attributes;
		var teaser_image = "https://www.zhdk.ch/file/"+teaser.path_file;
		//var teaser_image = teaser.path_source;
  		console.log(teaser_image);
  	} else { teaser_image = "default.jpg"};

	var myArticle = $('<article></article>');
	var headline = $('<h2></h2>');
	var para1 = $('<p></p>');
	var para2 = $('<p></p>');
	var para3 = $('<p></p>');
	var image = document.createElement("IMG");;

	myArticle.addClass("pure-u-1");
	myArticle.addClass("pure-u-md-1-2");
	myArticle.addClass("teaser");

	headline.text(title);
	para1.text(data.location);
	//para2.text('Description: ' + data.description);
	para3.text('Beginn: ' + date[0]);
	image.src = teaser_image;

	myArticle.append(headline);
	myArticle.append(image);

	myArticle.append(para1);
	myArticle.append(para2);
	myArticle.append(para3);
	

	section.append(myArticle);
  
}

init();