#IDCC HW4 Report
##Objective
 * Write a web application that can process data got from the on-line open data provided by Taipei City Government (such as the youbike on-line data of all stations) and transform and load it to a data base (or a NoSQL data store chosen by you, such as MongoDB).
 * (Optional and Bonus 10%) Use Hbase as the database

##Approach
I used Hbase as the database, and used Youbike data as the data source.
Program written in node.js. The data is provided by Taipei City ([http://data.taipei/youbike]()). Since the data is compressed by gzip, we need to do an additional decompression to get the raw data, which is in JSON. Fetches data every minute. The GUI of the data is built with `express` framework.

### Modules
1. **express** Used to build the web app.
2. **request** Used to get the data from host.
3. **split** Parse the data to JSON object in javascript.
4. **hbase** A node.js module used to communicate with the Hbase RESTful API.
5. **react.js** Frontend framework of query interface.
6. **c3.js** Drawing the charts of data.
7. **react-bootstrap** Frontend UI.

### How to use
Dependencies:

1. node.js
2. Running Hbase instance with RESTful server started

``` bash
	$ npm install
	# The parser
	$ node parser.js
	# The web service
	$ npm start
	# The web app is at localhost:3000
```

## Discussion
In this assignment, the hardest part was to get Hbase working and figuring out the schema of it. Hbase also crashes occasionally, and sometimes a large latency although we run it locally. Maybe I will try to use the **Thrifty** interface introduced by Apache, which is claimed to have better performance since it has less overhead caused by HTTP traffic. 

## Snapshots
![](2.png)
![](3.png)
![](4.png)