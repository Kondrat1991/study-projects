var express = require ('express');

var app = express();

var artists = [
    {
        id: 1,
        name: 'Bobul'
    },
    {
        id: 2,
        name: 'Vynnuk'
    },
    {
        id: 3,
        name: 'Giga'
    },



];


app.get('/artists', function (req,res) {
    res.send(artists);
});

app.get('/artists/:id', function (req,res) {
    console.log(req.params);
    var artist =artists.find(function (artist) {
        return artist.id === Number(req.params.id);
    });
    res.send(artist);
});




app.get('/', function (req, res) {
    res.send('Hello API');
});

app.listen(3012, function () {
    console.log('API app started');
});



