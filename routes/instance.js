var express = require('express');
var router = express.Router();

// Import required AWS SDK clients and commands for Node.js
const {
  EC2Client,
  StartInstancesCommand,
  StopInstancesCommand
} = require("@aws-sdk/client-ec2");
// Set the AWS region
const REGION = "ap-northeast-1"; //e.g. "us-east-1"
// Create EC2 service object
const ec2client = new EC2Client({ region: REGION });

/*
   return api description
*/
router.get('/', function(req, res, next) {
  var param = {"description":"start/stop instance"};
  res.header('Content-Type', 'application/json; charset=utf-8')
  res.send(param);
});

/*
   start instance
*/
router.get('/start', function(req, res, next) {
  console.log('start instance');
  
  const run = async () => {
    try {
      const data = await ec2client.send(new StartInstancesCommand({ InstanceIds: [req.query.InstanceId]}));
      console.log("Success", data.StartingInstances);
    } catch (err) {
      console.log("Error2", err);
    }
    res.redirect('/');
  };
  run();
});

/*
  stop instance
*/
router.get('/stop', function(req, res, next) {
  console.log('stop instance');
  const run = async () => {
    try {
      const data = await ec2client.send(new StopInstancesCommand({ InstanceIds: [req.query.InstanceId]}));
      console.log("Success", data.StoppingInstances);
    } catch (err) {
      console.log("Error", err);
    }
    res.redirect('/');
  };
  run();
});

module.exports = router;