/*
*   Busqueda de informacion de mercadolibre
*/
const melli           = require('mercadolibre')    ;
//const requestPromise  = require('request-promise') ;
const path            = require('path')            ;
const db              = require( path.join(__dirname,'../db/dbIndex') ).bases ;
//
class MercadolibreGeneric {
    constructor( argConfigML ){
        if ( !argConfigML ){ argConfigML={}; }
        this.appId    = argConfigML.AppId       || "5820076076281938" ;
        this.secret   = argConfigML.secret      || "NUTGIk5rSkG0GCbRrY1SnY9YAzdr7Sqb" ;
        this.tokenId  = argConfigML.accessToken || false ;
        this.refreshToken  = argConfigML.refreshToken ;
        this.refreshTocken = '' ;
        this.requestPromise  = require('request-promise') ;
        this.meliObj    = new melli.Meli( this.appId, this.secret, this.tokenId, this.refreshToken ) ;
        this.dbases     = db(argConfigML.mongoDb) ;

    }
    //
    accessToken(){ // Todavia no funciona esto, nose ni para que es
        return new Promise(function(respData,respRej){
            try {
                //
                this.meliObj.refreshAccessToken(function(err, refresh){
                    console.dir(refresh) ;
                    if ( err ){
                        respRej( err ) ;
                    } else {
                        this.tokenId = refresh ;
                        respData( refresh ) ;
                    }
                }.bind(this)) ;
                //
            } catch(errUser){
                respRej(errUser) ;
            }
        }.bind(this)) ;
    }
    //
    buscaTodosOffsetMercadolibre(argDatosOffset0,argCBpromise,argBuscado){
        return new Promise(function(respDatos,respRej){
            try {
                //
                let self         = this ;
                let argTotal     = argDatosOffset0.paging.total ;
                let argLimit     = argDatosOffset0.paging.limit ;
                if ( argLimit>=argTotal ){
                    return( argDatosOffset0.results ) ;
                }
                //
                let offsetFaltan = argTotal/argLimit ;
                offsetFaltan     = Math.ceil( parseInt(offsetFaltan) ) ;
                let arrayDatos     = argDatosOffset0.results || [] ;
                let arrayPromises  = [] ;
                //
                let offSetPosicion = argDatosOffset0.length ? argDatosOffset0.length : 0 ;
                for(let posProm=1;posProm<=offsetFaltan;posProm++){
                    offSetPosicion++ ;
                    if ( offSetPosicion>argTotal ){
                        let faltantes   = offSetPosicion - argTotal ;
                        offSetPosicion -= faltantes ;
                    }
                    arrayPromises.push( argCBpromise(argBuscado,offSetPosicion,argLimit) ) ;
                    offSetPosicion += argLimit ;
                }
                //
                Promise.all( arrayPromises )
                        .then(function(respPromises){
                            for( let posArr=0;posArr<respPromises.length;posArr++){
                                arrayDatos = arrayDatos.concat( respPromises[posArr].results ) ;
                            }
                            respDatos(arrayDatos) ;
                        }.bind(this))
                        .catch(errorAll => {
                            console.log('buscaTodosItemsMl::ERROR: Algo fallo en las Promises.All:: Length: '+arrayPromises.length+';')  ;
                            console.dir(errorAll) ;
                            respRej(errorAll) ;
                        }) ;
                //
            } catch(errTodos){
                respRej(errTodos) ;
            }
        }.bind(this)) ;
    }
    //
}
//
module.exports.class    = MercadolibreGeneric ;
module.exports.instance = (argConfig) => {
    const mlApi = new MercadolibreData(argConfig) ;
    return mlApi ;
}