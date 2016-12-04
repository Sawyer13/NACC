var express = require('express');
var nmap = require('node-nmap');
var os = require('os');

var app = express();


//----------------------------------------------------------------------------//
// - showmyip: show the ip user 																							//
// - showallobjetives: show all objetives, it dont send packages              //
// - doscanmaclist: show MAC address from the IP given.                    	  //
// - doscanoslist: show information about own operative system if possible.  	//
// - doscanportlist: show a list of all available ports.                   		//
// - doscanfullscan: perform a complete scan.                                	//
//                                                   													//
//                                                                            //
//  **If you want another options, only need change parameters                //
//  **Now, you cant send alerts, only emails, see below												//                                                //
//----------------------------------------------------------------------------//

//showmyip
app.get('/showmyip', function showmyip(req, res){
	//We tell the user the command to execute
	res.send('Executing ifconfig...');

	//We found our IP
	var interfaces = os.networkInterfaces();
	var addresses = [];
	for (var k in interfaces) {
	    for (var k2 in interfaces[k]) {
	        var address = interfaces[k][k2];
	        if (address.family === 'IPv4' && !address.internal) {
	            addresses.push(address.address);
	        }
	    }
	}

	res.send(addresses);
});

//showallobjetives
//we need modify module node-nmap with a new accepting parameter as nmap -sL

//We tell the user the command to execute
//res.send('Executing nmap -sL <mask> ...');


//doscanmaclist
app.get('/doscanmaclist', function(req, res){
	//We need our IP
	var interfaces = os.networkInterfaces();
	var addresses = [];
	for (var k in interfaces) {
	    for (var k2 in interfaces[k]) {
	        var address = interfaces[k][k2];
	        if (address.family === 'IPv4' && !address.internal) {
	            addresses.push(address.address);
	        }
	    }
	}

	var i = 0;
	var completado = true;

	while(i < addresses.length && completado == true){
		completado = false;
		//console.log(addresses[i]);
		//Later, we run nmap
		nmap.nodenmap.nmapLocation = "nmap";

		var ip = addresses[i];
    var separation = ip.split(".");
    var masc = separation[0]+"."+separation[1]+"."+separation[2]+"."+"1-255";

		console.log(masc);

		//We tell the user the command to execute
		res.send('Executing nmap -sP '+masc+' ...');

		var quickscan = new nmap.nodenmap.QuickScan(masc);

		quickscan.on('complete', function(data){
			for (var j in data) {
				host = data[j];
			}

			//console.log(completado);
			completado = true;
			res.send(data);
			//console.log(completado);
		});

		quickscan.on('error', function(error){
			res.send(error);
		});

		quickscan.startScan();

		i++;
	}
});

//doscanoslist
//we need modify module node-nmap with a new accepting parameter as nmap -O

//We tell the user the command to execute
//res.send('Executing nmap -O <masc/ip> ...);


//doscanportlist
//we need modify module node-nmap with a new accepting parameter as nmap -sV

//We tell the user the command to execute
//res.send('Executing nmap <masc/ip> ...);


//doscanfullscan
app.get('/doscanfullscan', function(req, res){

	//We need our IP
	var interfaces = os.networkInterfaces();
	var addresses = [];
	for (var k in interfaces) {
	    for (var k2 in interfaces[k]) {
	        var address = interfaces[k][k2];
	        if (address.family === 'IPv4' && !address.internal) {
	            addresses.push(address.address);
	        }
	    }
	}

	var i = 0;
	var completado = true;

	while(i < addresses.length && completado == true){
		completado = false;
		console.log(addresses[i]);
		//Later, we run nmap
		nmap.nodenmap.nmapLocation = "nmap";

		var ip = addresses[i];
    var separation = ip.split(".");
    var masc = separation[0]+"."+separation[1]+"."+separation[2]+"."+"1-255";

		//We tell the user the command to execute
		res.send('Executing nmap -sV '+masc+' ...');

		console.log(masc);

		var osandports = new nmap.nodenmap.OsAndPortScan(masc);

		osandports.on('complete', function(data){
			//console.log(completado);
			res.send(data);
			completado = true;
			//console.log(completado);
		});

		osandports.on('error', function(error){
			res.send(error);
		});

		osandports.startScan();

		i++;
	}
});


//----------------------------------------------------------------------------//
// If you want to have alerts by email, only need install the module					//
// nodemailer as the others modules -> https://nodemailer.com/ 								//
// Later, you use this next code:																					 		//
//----------------------------------------------------------------------------//
//																																						//
// var nodemailer = require('nodemailer');																		//
//																																						//
// // create reusable transporter object using the default SMTP transport			//
// var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
//																																						//
// setup e-mail data with unicode symbols																			//
// var mailOptions = {																												//
//    from: '"Fred Foo ?" <foo@blurdybloop.com>', // sender address						//
//    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers		//
//    subject: 'Hello ✔', // Subject line																		 //
//    text: 'Hello world ?', // plaintext body																//
//    html: '<b>Hello world ?</b>' // html body																//
// };																																					//
//																																						//
// send mail with defined transport object																		//
// transporter.sendMail(mailOptions, function(error, info){										//
//    if(error){																															//
//        return console.log(error);																					//
//    }																																				//
//    console.log('Message sent: ' + info.response);													//
// });																																				//
//																																						//
//----------------------------------------------------------------------------//


//Listen
app.listen(9000);

console.log("Server Express escuchando en modo %s", app.settings.env);
