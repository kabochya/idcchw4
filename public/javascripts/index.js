var Input = ReactBootstrap.Input
var ListGroup = ReactBootstrap.ListGroup
var ListGroupItem = ReactBootstrap.ListGroupItem

var Application = React.createClass({
  getInitialState: function(){
    return {data:{data:[],info:{}}}
  },
  componentDidMount: function(){
    this.query('');
  },
  query: function(q){
    $.ajax({
      url: '/data',
      data:{site:q},
      dataType: 'json',
      cache: false,
      success: function(data){
        this.setState({data:data})
      }.bind(this)
    })
  },
  render: function(){
    return (
      <div>
        <QueryForm query={ this.query }/>
        <QueryResult data={ this.state.data.data } info={this.state.data.info} />
      </div>
      )
  }
});

var QueryForm = React.createClass({
  getInitialState: function(){
    return {query:''}
  },
  change: function(){
    var site = this.refs.site.getValue()
    this.setState({query:site})
    this.props.query(site)
  },
  render: function(){

    var siteSelOpts = Sites.map( (e,i)=>{
      return (
          <option key={i} value={"0000".slice(0,-1*(i+1).toString().length)+(i+1)}>{e}</option>
        )
    } )
    return (
      <div>
        <form>
          < Input ref="site" type="select" label="站名" value={this.state.query} onChange={ this.change } >
            <option value='' disabled>請選擇站點</option>
            {siteSelOpts}
          </Input>
        </form>
      </div>
      )
  }

})

var QueryResult = React.createClass({
  render: function(){

    var renderOnData = ''

    if(this.props.data && this.props.data.length){
      renderOnData = (
        <SiteInfo info={this.props.info} />
        )
    }
    return (
      <div>
        {this.props.data.length ? "過去24小時使用情形：" : ''}
        <Chart data={this.props.data}/>
        {renderOnData}
      </div>
      )
  }
})

var SiteInfo = React.createClass({
  render: function(){
    if(!this.props.info) return null

    var info = this.props.info

    var time =  info.mday.slice(0,4) + ' ' +
                info.mday.slice(4,6) + '/' +
                info.mday.slice(6,8) + ' ' +
                info.mday.slice(8,10) + ':' +
                info.mday.slice(10,12) + ':' +
                info.mday.slice(12,14)
    return (
      <div>

        <ListGroupItem header="地址">{info.ar}</ListGroupItem>
        <ListGroupItem header="最大車輛數">{info.tot}</ListGroupItem>
        <ListGroupItem header="啟用情況">{info.act=="1" ? "啟用中" : "全站關閉"}</ListGroupItem>
        <ListGroupItem header="更新時間">{time}</ListGroupItem>
        
      </div>
      )
  }
})

var Chart = React.createClass({
  componentDidUpdate: function(){
    var data = this.props.data
    if(data.length){
      var t = ['t']
      var d = ['剩餘車輛']

      data.map( e=>{
        t.push(e.t)
        d.push(e.d)
      })

      var chart = c3.generate({
        bindto: '#chart',

        data:{
          x: 't',
          xFormat: '%H:%M:%S',
          columns: [
            t,d
          ]
        },
        axis:{
          x:{
            type: 'timeseries',
            tick:{
              count: 5,
              format: '%H:%M:%S',
              culling: {
                max: 5
              }
            }
          }
        },
        subchart: {
          show: true
        },
        point:{
          r:1.5
        }
      })
    }
  },
  render: function(){
    
    return (
      <div id="chart">
      </div>
      )
  }
})

ReactDOM.render(
  <Application />,
  document.getElementById('root')
)
