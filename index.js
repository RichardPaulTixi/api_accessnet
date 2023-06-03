const express = require('express');
const { Client } = require('ssh2');

const app = express();
const client = new Client();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/ssh', (req, res) => {
  const { ip, username, password, command1} = req.body;
  const comandoFinal= "display ont info summary " + command1 + " | no-more";


  client.on('ready', () => {
    client.exec('enable \n config \n'+ comandoFinal +'\n \r ',  (err, stream) => {
      if (err) throw err;
      let output = '';

      stream.on('close', () => {
        res.send(output);
      }).on('data', (data) => {
        output += data;
      });
    });
  }).connect({
    host: ip,
    port: 22,
    username,
    password,
  });
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
