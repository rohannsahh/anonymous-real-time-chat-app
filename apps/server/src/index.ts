import http from 'http';

async function init(){
    const httpServer= http.createServer();
    const Port= process.env.PORT ? process.env.PORT :8000 ;

    httpServer.listen(Port,()=>{
    console.log(`http server created at ${Port}`)
    })
}


init()