import express, { Application } from 'express';
import path from "path";

export class Server {
  private app: Application;
  public http: any;
  public io: any;

  constructor(private port?: number | string){
    this.app = express();
    this.http = require('http').Server(this.app);
    this.io = require('socket.io')(this.http);

    this.settings();
    this.midlewares();
    this.routes();
    this.socket();
  }

  settings() {
    this.app.set('port', this.port || process.env.PORT || 3000);
  }

  midlewares(){
    this.app.use(express.static(path.join(__dirname, '/../public')));
  }

  socket(){
    let messages: any = [];
    let users: Array<any> = [];

    this.io.on('connection', (socket: any) => {
      console.log(`Socket conectado: ${socket.id}`);
    
      socket.emit('previousMessage', messages);

      socket.on('sendMessage', (data: any) => {
          messages.push(data);
          socket.broadcast.emit('receivedMessage', data);
      })

      users.push(socket);
      socket.on('disconnect', () => {
        users.splice(users.indexOf(socket), 1);
        console.log(`Client disconnected ${socket.id}`)
      })
    })
  }

  routes(){
    this.app.get("/", (req: any, res: any) => {
      res.sendFile(path.resolve("./public/index.html"));
    });
  }

  async listen(){
    await this.http.listen(this.app.get('port'));
    console.log(`Servidor rodando na porta ${this.app.get('port')}`);
  }
}