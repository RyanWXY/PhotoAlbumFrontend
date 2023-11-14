var additionalParams = {
    headers: {
        "x-api-key": "0cng9HVm2h9YKSNAXC13qpvZsPkKcL820PB0wJl7"
    }
}

// A utility function to create HTML.
function getHtml(template) {
    return template.join('\n');
}

function callUpload() {
    // file uploaded by user
    var files = document.getElementById("photo-input").files;
    if (!files.length) {
    return alert("Please choose a file to upload first.");
    }
    var file = files[0];
    var fileName = file.name;
    // label uploaded by user
    var message = document.getElementById('custom-labels').value
    // Upload image to S3
    console.log("begin upload")

    // Turn image into Base64
    let reader = new FileReader();
    reader.onload = function () {
        base64String = reader.result;
        param = {}
        param["Content-Type"] = 'text/base64';
        param["upload"] = fileName;
        param["uploadHeader"] = message;
        sdk.uploadPut(param, base64String, additionalParams);
    }
    reader.readAsDataURL(file);
}


function uploadFunction() {
    var template = [
    '<input type="file" id="photo-input" accept="image" required>',
    '<input type="text" id="custom-labels" placeholder="Labels (comma-separated)">',
    '<button onclick="callUpload()">Upload</button>',
    ]
    document.getElementById('upload-photo').innerHTML=getHtml(template);
}


function callSearchApi(message) {
    // params, body, additionalParams
    console.log(message)
    a = sdk.searchGet({q: message}, {}, additionalParams);
    a.then((response) => {
        var urls = response.data.urls;
        console.log(urls)
        var img_temp = ['<br>', '<div class="container">'];
        for (let i = 0; i < urls.length; i++) {
            console.log(urls[i])
            xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function()
            {
                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                {
                    var img_encode = xmlhttp.responseText;
                    var line = '<div class="image"> <img src=' + img_encode + ' width="180" height="200"/> </div>';
                    img_temp.push(line)
                }
            }
            xmlhttp.open('GET', urls[i], false);
            xmlhttp.send();
        }
        img_temp.push("</div>")
        document.getElementById('show-photo').innerHTML=getHtml(img_temp);
    })
}


function searchFunction() {
    var template = [
    '<input type="text" id="search-input" placeholder="Search Query">',
    '<button onclick="callSearchApi(document.getElementById(\'search-input\').value)">',
    'Text Search',
    '</button>',
    ]
    document.getElementById('make-query').innerHTML=getHtml(template);
}




