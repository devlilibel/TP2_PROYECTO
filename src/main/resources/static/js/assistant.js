import {c, images} from '/js/avatar.js';
import EasySpeech from '/js/espeech.js';

var speak = false;
var count = 0;
var hold = 0;

var i = 0;
var t = false;

setInterval(function(){
if (speak) {
	if (t)
	i--;
	else i++;
	if (i == 0) {
        t=false;
    }
   	if (i == 48){
    	t=true;
   	}
   	c.drawImage(images[i],0,0,150,150);
}},60)

setInterval(function(){
count--;
console.log(count);

if (count == hold)
	speak = true;
	
if (count <= 0){
	speak=false;
	count = 0;
	c.drawImage(images[8],0,0,150,150);
}
},500)

EasySpeech.detect();
await EasySpeech.init();
console.log(EasySpeech.voices());
const voice = EasySpeech.voices()[240];
var text = null;
/*const synth = window.speechSynthesis;
const tts = new SpeechSynthesisUtterance();
var voices = synth.getVoices();
//const lastVoice = voices[voices.length - 1];
tts.default = false;
tts.voice = voices.filter(function(voice) { return voice.name == 'Google español de Estados Unidos'; })[0];
tts.lang = 'es-US';*/

switch (window.location.pathname) {
	case '/':
		text = 'Hola! Soy Aleli, tu asistente virtual. En qué puedo ayudarte hoy?';
		hold = 12;
		count = hold + 1;
	break;
	case '/map':
		hold = 9;
		count = hold + 1;
	break;
	case '/login':
		hold = 22;
		count = hold + 1;
	break;
	case '/reclamaciones':
		hold = 12;
		count = hold + 1;
	break;
	case '/signup':
		hold = 28;
		count = hold + 1;
	break;
	case '/recomendacion':
		hold = 18;
		count = hold + 1;
	break;
	default:
		if (window.location.pathname.includes('products2')) {
			hold = 6;
			count = hold + 1;
		}
		if (window.location.pathname.includes('productsbycategory')) {
			hold = 6;
			count = hold + 1;
		}
		if (window.location.pathname.includes('search/products')) {
			hold = 6;
			count = hold + 1;
		}
	break;
}

if (window.location.pathname == '/') {
	await EasySpeech.speak({
  	text: text,
  	voice: voice
	})
}

const assistant = document.getElementById("assistant");
let recordAudio;

assistant.addEventListener("mousedown", () => {
  assistant.style.backgroundColor = "#87e087";
  
  navigator.getUserMedia({
            audio: true
        }, function(stream) {
                recordAudio = RecordRTC(stream, {
                type: 'audio',
                mimeType: 'audio/webm',
                sampleRate: 48000,

                recorderType: StereoAudioRecorder,

                numberOfAudioChannels: 1,

                timeSlice: 4000,

                desiredSampRate: 16000
            });

            recordAudio.startRecording();
        }, function(error) {
            console.error(JSON.stringify(error));
	});
	
});

const socketio = io('https://alpine-alike-string.glitch.me');

assistant.addEventListener("mouseup", () => {
  assistant.style.backgroundColor = "transparent";
  
  recordAudio.stopRecording(function() {

            recordAudio.getDataURL(function(audioDataURL) {
                var files = {
                    audio: {
                        type: recordAudio.getBlob().type || 'audio/wav',
                        dataURL: audioDataURL
                    }
                };
                // submit the audio file to the server
                socketio.emit('message-transcribe', files);
            });
        });
});


    /*const socket = socketio.on('connect', function() {
        
    });*/

    socketio.on('results', function (data) {
        if (data) {
        	console.log(data);
            text = data;
            
            if (!data.includes('https')) {
				EasySpeech.speak({
			  	text: text,
  				voice: voice
				})
			}
            
            if (data == "Lo siento, no entendí ¿Puedes repetirme de nuevo?" || data == "Me temo que no entiendo. ¿Puedes repetirme de nuevo?" || data == "Lo lamento. No entendí muy bien lo que acabas de decir.") {
				hold = 7;
				count = hold + 1;
			}
            
            if (data == "Aquí te muestro nuestras principales zonas de reparto en Lima y Callao." || data == "Aquí te muestro  la información acerca de las zonas de cobertura en Lima y Callao." || data == "Aquí te muestro información de los distritos de cobertura en Lima y Callao.")
				window.location = '/map';
				
    		if (data == "https://wa.me/51970865569?text=Buen%20dia%20equipo%20Avinka!%20tengo%20una%20consulta")
                window.location = 'https://wa.me/51970865569?text=Buen%20dia%20equipo%20Avinka!%20tengo%20una%20consulta';
                
            if (data == "https://www.google.com/maps/search/avinka/@-12.1611645,-77.0020915,13z/data=!3m1!4b1")
                window.location = 'https://www.google.com/maps/search/avinka/@-12.1611645,-77.0020915,13z/data=!3m1!4b1';
                
    		if (data == "Aquí puedes iniciar sesión! Ingresa tu correo, tu contraseña y luego deberá hacer click en Ingresar. Si aún no tiene una cuenta, seleccione el botón Regístrate.")
                window.location = '/login';

    		if (data == "Lamentamos lo sucedido. Para generar un reclamo ingrese su nombre, apellido, correo electrónico, documento de identidad y el detalle de su reclamo, luego haga click en Enviar.")
                window.location = '/reclamaciones';

    		if (data == "Aquí te puedes registrar. Escriba su nombre, apellido, número de celular, correo electrónico y cree una contraseña. Acepte los términos y condiciones y la Política de privacidad y luego haga click en registrarse.")
                window.location = '/signup';

    		if (data == "Ayúdanos a mejorar, ingresa tu correo y el detalle de tu sugerencia y luego haga click en Enviar. Tu opinión es importante para nosotros.")
                window.location = '/recomendacion';
                
            if (data.split(":")[0] == 'Aquí te muestro el detalle acerca del producto') {
				switch (data.split(": ")[1]) {
					case 'Huevo pardo':
					window.location = '/products2/5';
					break;
					case 'Milanesa de Pollo':
					window.location = '/products2/4';
					break;
					case 'Pavo marinado':
					window.location = '/products2/1';
					break;
					case 'Hamburguesa de pollo':
					window.location = '/products2/3';
					break;
					case 'garbanzo':
					window.location = '/products2/7';
					break;
					case 'Yuca amarilla':
					window.location = '/products2/8';
					break;
					case 'Huevo Artizan':
					window.location = '/products2/6';
					break;
				}
			}
			
			if (data.split(":")[0] == 'Aquí te muestro lo que encontré en la categoría'){
				switch (data.split(": ")[1]) {
					case 'Huevos':
					window.location = '/search/productsbycategory?name=Huevos';
					break;
					case 'Ofertas':
					window.location = '/search/productsbycategory?name=Ofertas';
					break;
					case 'Complementos':
					window.location = '/search/productsbycategory?name=Complementos';
					break;
					case 'Preparados':
					window.location = '/search/productsbycategory?name=Preparados';
					break;
				}
			}
			
			if (data.split(":")[0] == 'Estas son las mejores opciones para el producto'){
				switch (data.split(": ")[1]) {
					case 'Huevo pardo':
					window.location = '/search/products?name=Huevo+pardo';
					break;
					case 'Milanesa de Pollo':
					window.location = '/search/products?name=Milanesa+de+Pollo';
					break;
					case 'Pavo marinado':
					window.location = '/search/products?name=Pavo+marinado';
					break;
					case 'Hamburguesa de pollo':
					window.location = '/search/products?name=Hamburguesa+de+pollo';
					break;
					case 'garbanzo':
					window.location = '/search/products?name=garbanzo';
					break;
					case 'Yuca amarilla':
					window.location = '/search/products?name=Yuca+amarilla';
					break;
					case 'Huevo Artizan':
					window.location = '/search/products?name=Huevo+Artisan';
					break;
				}
			}
            
            //resultpreview.innerHTML += "" + data;
        }
    });

