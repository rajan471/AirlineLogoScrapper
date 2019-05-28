var Horseman = require('node-horseman');
var base64ToImage = require('base64-to-image')

let getURL = async (airline) => {
    airline = airline.replace(' ', '+');
    return new Promise((resolve, reject) => {
        var horseman = new Horseman();
        let url = `https://www.google.com/search?q=${airline}+airline`;
        horseman
            .userAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36')
            .wait(1000)
            .open(url)
            .evaluate(function () {
                return document.getElementById('rhs') ?
                    document.getElementById('rhs').querySelectorAll("g-img img").length > 0 ? document.getElementById('rhs').querySelectorAll("g-img img")[0].getAttribute('src') : '' : '';
            })
            .then(function (data) {
                resolve(data);
                return horseman.close();
            })
            .catch(function (error) {
                horseman.close();
                reject(error);
            });
    })
}
const airlines = require('./airlines');

function* iGenerator() {
    let i = 0;
    while (i < airlines.length) {
        yield i++;
    }
}

let i = 0;

let get_all_images = async () => {
    let generator = iGenerator();
    while (i < airlines.length) {
        let index = generator.next().value;
        let airline = airlines[index];
        try {
            let image = await getURL(airline);
            i = index;
            if (!!image) {
                let type = 'png'
                if (image.indexOf('data:image/jpeg') >= 0) type = 'jpg';

                var optionalObj = { 'fileName': airline, 'type': type }
                try {
                    var imageInfo = base64ToImage(image, './logos/', optionalObj);
                }
                catch (error) {
                    console.log(image, error)
                }
            }
        }
        catch (error) {
            console.log(error);
            // Handle error
        }
    }

}


get_all_images();
