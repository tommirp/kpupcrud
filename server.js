const 
  engine = require('./engine'),
  debug = require('debug')('hospicloud:server'),
  http = require('http'),
  port = normalizePort(process.env.PORT || '3000');

engine.set('port', port);

const server = http.createServer(engine);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  let port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') throw error;

  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
console.log("\n\n\nServer berhasil dijalankan!\nSilahkan buka http://localhost:"+port+" di browser!");
console.log("\nALERT : Ini adalah website versi prototype\ndan dalam penggunaan terbatas (Sebatas uji coba).\nJangan gunakan untuk production / live!!!");
console.log("\nNOTE : Tekan Ctrl+C Untuk Menghentikan Aplikasi");