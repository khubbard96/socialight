import path from 'path'
import express from 'express';
import subApp from './router';
import authenticationLayer from './api-authentication-layer';


const app = express();

app.use(authenticationLayer);

app.use(express.static(DIST_DIR))

app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
});



app.use(subApp);