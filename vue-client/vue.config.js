module.exports = {
    devServer: {
        proxy: {
            '/api':{
                target: 'localhost:8080',
                "secure": false
            }
        }
    }
}