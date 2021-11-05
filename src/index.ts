import { Server } from './server'

function main() {
  try {
    const server = new Server(3000);
    server.listen();   
  } catch (error) {
    (error: unknown)=> console.log(error)
  }
}

main();