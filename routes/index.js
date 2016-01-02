var express = require('express')
var router = express.Router()
var hbase = require('hbase')
var client = hbase()
var table = client.table('youbike')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
})

router.get('/data', (req,res)=>{
  var site = req.query.site ? req.query.site : ''
  if(!site) return res.json({info:{},data:[]})
  var time = new Date
  time.setHours(time.getHours()-24)

  var siteFilter = { op:"EQUAL", type:"RowFilter", comparator:{value:".+_" + site, type:"RegexStringComparator"} }
  var timeFilter = { op:"GREATER_OR_EQUAL", type:"RowFilter", comparator: { value: time.valueOf().toString(), type: "BinaryPrefixComparator"} }
  var filterList = { type: "FilterList", op: "MUST_PASS_ALL", filters: [siteFilter, timeFilter] }
  var scanner = new hbase.Scanner(client, {table:'youbike',column:"data:sbi", filter:filterList})
  


  var results = []
  var key = ""
  
  scanner.init( ()=>{
    var cb = function( error, cells ){
      if(error) return res.json({err:error})
      if(cells){
        if(!key){
          key = cells[0].key.toString()
        }

        
        cells.map( e=>{ 
          var date = new Date(e['timestamp'])
          var hours = "0" + date.getHours()
          var minutes = "0" + date.getMinutes()
          var seconds = "0" + date.getSeconds()
          var formattedTime = hours .substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)  
          results.push( {t:formattedTime,d:e['$'].toString()} )
        })

        scanner.get(cb)
      }
      else{
        scanner.delete( e=>{} )
        var info = {}
        table.row(key).get( (error,row)=>{
            if(error) return res.json({err:error})
            
            row.map( e=>{
              info[e['column'].toString().split(':')[1]] = e['$'].toString()
            })
            
            res.json({info:info,data:results})
          })
      }
    }

    scanner.get( cb )

  })

  //res.json()
})

module.exports = router;
