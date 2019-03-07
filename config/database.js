const keys = require('./keys');

module.exports = {
    database:'mongodb://admin:2O83xloJWnKClXGK@cluster0-shard-00-00-x3r74.gcp.mongodb.net:27017,cluster0-shard-00-01-x3r74.gcp.mongodb.net:27017,cluster0-shard-00-02-x3r74.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
    secret: keys.database.secret
}