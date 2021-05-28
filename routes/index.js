const express = require('express');
const router = express.Router();
// Import required AWS SDK clients and commands for Node.js 
const { EC2Client, DescribeInstancesCommand } = require("@aws-sdk/client-ec2"); 

// Set the AWS region 
const REGION = "ap-northeast-1"; //e.g. "us-east-1" 
const OWNER = "pana"; 

// Set the parameters 
const params = { 
  Filters: [{ Name: "tag:Owner", Values: [OWNER] }], 
}; 

// Create EC2 service object 
const ec2client = new EC2Client({ region: REGION }); 
  

/* GET home page. */
router.get('/', function(req, res, next) {
  const run = async () => { 
    try { 
      const data = await ec2client.send(new DescribeInstancesCommand(params)); 
      const instanceList = [];
  
      // display instance informations. 
      data.Reservations.forEach(function(reservation){ 
        reservation.Instances.forEach(function(instance){
          instanceList.push({
              Name: instance.Tags.filter(tag => tag.Key == "Name")[0].Value,
              State: instance.State.Name,
              IP: instance.PublicIpAddress,
              InstanceId: instance.InstanceId 
            });       
        });        
      });
      res.render('index', { title: OWNER, instances: instanceList }); 
    } catch (err) {   
      console.log("Error", err);  
    } 
  }; 
  run(); 
});

module.exports = router;
