var request = require('request')
var zlib = require('zlib')
var split = require('split')
var hbase = require('hbase')
var client = hbase()

var table = client.table('youbike')


var fetch = ()=>{
   request('http://data.taipei/youbike')
   .pipe( zlib.createGunzip() )
   .pipe( split(JSON.parse) )
   .on('data',d=>{
      var obj = d.retVal
      var arr = Object.keys(obj).map( key=>obj[key] )
      var time = Date.now()
      
      var rows = []
      arr.map( (el,id)=>{
         Object.keys(el).map( (k)=>{
            rows.push({ key: time + '_' + el.sno , column: 'data:' + k ,timestamp:time , $: el[k]})
         })
      })

      table.row(null).put(rows,(e,s)=>{
         if(e) return console.log( '[ERROR] ' + e)    
        
         return console.log( '[INFO] ' + rows.length +' entries put ' + ( s ? 'succeeded.' : 'failed.') )
      })
   })
}

var loop = 0;
table.exists( (e,r)=>{
   if(r){
      fetch()
      loop = setInterval( fetch, 60000)
   }
   else{
      table.create('data',( e,r)=>{
         if(r){
            console.log('[INFO] ' + 'Created table \'youbike\'.')
            fetch()
            loop = setInterval(fetch, 60000)
         }
         else{
            console.log(e)
         }
      })
   }
})
